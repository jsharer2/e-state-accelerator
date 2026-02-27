import { createReadStream } from 'fs';
import crypto from 'crypto';
import { EventEmitter } from 'events';

export interface EmailMessage {
  message_id: string | null;
  fallback_hash: string;
  from_domains: string[];
  to_domains: string[];
  cc_domains: string[];
  bcc_domains: string[];
  date_ts: string | null;
  subject: string | null;
}

export interface ExpandedMessage extends EmailMessage {
  from_domain: string;
  base_domain: string;
}

export class MboxParser {
  private MULTI_SUFFIXES = new Set([
    'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
    'com.au', 'net.au', 'org.au',
    'co.jp', 'ne.jp',
    'com.br', 'com.mx',
    'co.in', 'com.sg', 'com.hk',
    'co.nz',
  ]);

  async parse(filepath: string): Promise<EmailMessage[]> {
    return new Promise((resolve, reject) => {
      const messages: EmailMessage[] = [];
      let buffer = '';
      let messageCount = 0;

      const stream = createReadStream(filepath, { encoding: 'utf-8', highWaterMark: 64 * 1024 });

      stream.on('data', (chunk: string | Buffer) => {
        buffer += typeof chunk === 'string' ? chunk : chunk.toString();

        // Process complete messages (look for MBOX message separator)
        const mboxSeparatorRegex = /\nFrom [^\n]*\n/g;
        let lastIndex = 0;
        let match;

        while ((match = mboxSeparatorRegex.exec(buffer)) !== null) {
          // Extract the message before this separator
          const messageBlock = buffer.substring(lastIndex, match.index);
          
          if (messageBlock.trim().length > 0) {
            const msg = this.parseMessageBlock(messageBlock);
            if (msg) {
              messages.push(msg);
              messageCount++;
            }
          }

          lastIndex = match.index + 1; // Move past the \n before "From "
        }

        // Keep the rest in buffer for next chunk
        buffer = buffer.substring(lastIndex);
      });

      stream.on('end', () => {
        // Process remaining buffer
        if (buffer.trim().length > 0) {
          const msg = this.parseMessageBlock(buffer);
          if (msg) {
            messages.push(msg);
            messageCount++;
          }
        }

        console.log(`Parsed ${messageCount} messages from MBOX`);
        resolve(messages);
      });

      stream.on('error', (error) => {
        console.error('Error reading MBOX file:', error);
        reject(new Error(`Failed to parse MBOX file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      });
    });
  }

  private parseMessageBlock(rawMessage: string): EmailMessage | null {
    try {
      // Extract headers (everything before first blank line)
      const headerEnd = rawMessage.search(/\r?\n\r?\n/);
      const headerText = headerEnd > -1 ? rawMessage.substring(0, headerEnd) : rawMessage;

      // Parse headers
      const headers = this.parseHeaders(headerText);

      const messageId = (headers['message-id'] || '').trim() || null;
      const subject = headers['subject'] || null;
      const dateStr = headers['date'] || null;

      // Parse date
      let dateTs: string | null = null;
      if (dateStr) {
        try {
          dateTs = new Date(dateStr).toISOString();
        } catch {
          // Keep null
        }
      }

      // Extract domains
      const fromDomains = this.extractDomains(headers['from'] || '');
      const toDomains = this.extractDomains(headers['to'] || '');
      const ccDomains = this.extractDomains(headers['cc'] || '');
      const bccDomains = this.extractDomains(headers['bcc'] || '');

      // Only include messages with at least one domain
      if (fromDomains.length === 0 && toDomains.length === 0) {
        return null;
      }

      // Create fallback hash
      const fallbackStr = `${headers['from'] || ''}${headers['to'] || ''}${dateStr || ''}${subject || ''}`;
      const fallbackHash = crypto.createHash('sha1').update(fallbackStr).digest('hex');

      return {
        message_id: messageId,
        fallback_hash: fallbackHash,
        from_domains: fromDomains,
        to_domains: toDomains,
        cc_domains: ccDomains,
        bcc_domains: bccDomains,
        date_ts: dateTs,
        subject,
      };
    } catch (error) {
      console.error('Error parsing message block:', error);
      return null;
    }
  }

  private parseHeaders(headerText: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = headerText.split(/\r?\n/);
    let currentHeader = '';
    let currentValue = '';

    for (const line of lines) {
      if (line.match(/^\s/) && currentHeader) {
        // Continuation of previous header
        currentValue += ' ' + line.trim();
      } else if (line.includes(':')) {
        // New header
        if (currentHeader) {
          headers[currentHeader.toLowerCase()] = currentValue.trim();
        }
        const [key, ...valueParts] = line.split(':');
        currentHeader = key.trim();
        currentValue = valueParts.join(':').trim();
      }
    }

    if (currentHeader) {
      headers[currentHeader.toLowerCase()] = currentValue.trim();
    }

    return headers;
  }

  private extractDomains(addressStr: string): string[] {
    if (!addressStr) return [];

    const domains = new Set<string>();
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+/g;

    let match;
    while ((match = emailRegex.exec(addressStr)) !== null) {
      const email = match[0].toLowerCase();
      if (email.includes('@')) {
        const domain = email.split('@')[1].replace(/[>'"()]/g, '').trim();
        if (domain && domain.length > 0) {
          domains.add(domain);
        }
      }
    }

    return Array.from(domains).sort();
  }

  private baseDomain(domain: string): string {
    if (!domain) return '';

    const d = domain.toLowerCase().trim();
    if (!d.includes('.')) return d;

    const parts = d.split('.').filter(p => p);
    if (parts.length <= 2) return d;

    const last2 = parts.slice(-2).join('.');
    const last3 = parts.slice(-3).join('.');

    if (this.MULTI_SUFFIXES.has(last2) && parts.length >= 3) {
      return parts.slice(-3).join('.');
    }
    if (this.MULTI_SUFFIXES.has(last3) && parts.length >= 4) {
      return parts.slice(-4).join('.');
    }

    return parts.slice(-2).join('.');
  }

  expandAndNormalize(messages: EmailMessage[]): ExpandedMessage[] {
    const expanded: ExpandedMessage[] = [];

    for (const msg of messages) {
      // Use From domains as primary source, fallback to To domains
      const domainsToProcess = msg.from_domains.length > 0 ? msg.from_domains : msg.to_domains;
      
      for (const domain of domainsToProcess) {
        const base = this.baseDomain(domain);
        // Filter out internal/localhost domains
        if (base && base !== 'enron.com' && !base.includes('localhost') && base.length > 0) {
          expanded.push({
            ...msg,
            from_domain: domain,
            base_domain: base,
          });
        }
      }
    }

    return expanded;
  }
}

