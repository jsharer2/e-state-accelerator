import { ExpandedMessage } from './mboxParser';

export interface SignalFlags {
  auth_security: boolean;
  billing_finance: boolean;
  subscription: boolean;
  loyalty_rewards: boolean;
  domains_hosting_cloud: boolean;
}

export interface MessageWithSignals extends ExpandedMessage {
  signals: SignalFlags;
  signal_score: number;
}

export interface AggregatedResult {
  base_domain: string;
  messages: number;
  total_score: number;
  last_seen: string | null;
  first_seen: string | null;
  any_auth: boolean;
  any_billing: boolean;
  any_subscription: boolean;
  any_rewards: boolean;
  any_cloud_domain: boolean;
  example_subjects: string[];
  brand: string;
}

export class SignalDetector {
  private signals = {
    auth_security: /\b(verify|verification|confirm|activate|welcome|password\s*reset|reset\s*your\s*password|one[-\s]?time\s*pass|otp\b|2[-\s]?step|two[-\s]?factor|mfa\b|security\s*alert|new\s*sign[-\s]?in|login\s*attempt|suspicious)\b/i,
    billing_finance: /\b(receipt|invoice|statement|payment|charged|billing|bill\b|refund|transaction|purchase|order\s*(confirmed|confirmation)|your\s*order)\b/i,
    subscription: /\b(subscription|renewal|renewed|trial|membership|plan\b|auto[-\s]?renew|recurring|cancel(l)?ed|cancellation)\b/i,
    loyalty_rewards: /\b(points|miles|rewards|loyalty|member\b|status\b|tier\b)\b/i,
    domains_hosting_cloud: /\b(domain|dns|hosting|ssl|certificate|server|cloud|backup|storage|workspace)\b/i,
  };

  private domainBrands: Record<string, string> = {
    'paypal.com': 'PayPal',
    'amazon.com': 'Amazon',
    'netflix.com': 'Netflix',
    'spotify.com': 'Spotify',
    'microsoft.com': 'Microsoft',
    'google.com': 'Google',
    'apple.com': 'Apple',
    'facebook.com': 'Facebook',
    'twitter.com': 'Twitter',
  };

  detectSignals(messages: ExpandedMessage[]): MessageWithSignals[] {
    return messages.map(msg => {
      const subject = (msg.subject || '').toLowerCase();
      
      const signals: SignalFlags = {
        auth_security: this.signals.auth_security.test(subject),
        billing_finance: this.signals.billing_finance.test(subject),
        subscription: this.signals.subscription.test(subject),
        loyalty_rewards: this.signals.loyalty_rewards.test(subject),
        domains_hosting_cloud: this.signals.domains_hosting_cloud.test(subject),
      };

      const signal_score = this.calculateScore(signals);

      return {
        ...msg,
        signals,
        signal_score,
      };
    });
  }

  private calculateScore(signals: SignalFlags): number {
    return (
      (signals.auth_security ? 1 : 0) * 5 +
      (signals.billing_finance ? 1 : 0) * 4 +
      (signals.subscription ? 1 : 0) * 3 +
      (signals.loyalty_rewards ? 1 : 0) * 2 +
      (signals.domains_hosting_cloud ? 1 : 0) * 2
    );
  }

  aggregate(messagesWithSignals: MessageWithSignals[]): AggregatedResult[] {
    const grouped = new Map<string, MessageWithSignals[]>();

    // Group by base domain
    for (const msg of messagesWithSignals) {
      const key = msg.base_domain;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(msg);
    }

    // Aggregate
    const results: AggregatedResult[] = [];

    for (const [domain, msgs] of grouped) {
      const uniqueMessageIds = new Set(msgs.map(m => m.fallback_hash));
      const dates = msgs.map(m => m.date_ts).filter(Boolean) as string[];
      
      const exampleSubjects = Array.from(
        new Set(msgs.map(m => m.subject).filter(Boolean) as string[])
      ).slice(0, 5);

      const result: AggregatedResult = {
        base_domain: domain,
        messages: uniqueMessageIds.size,
        total_score: msgs.reduce((sum, m) => sum + m.signal_score, 0),
        last_seen: dates.length > 0 ? dates.sort().reverse()[0] : null,
        first_seen: dates.length > 0 ? dates.sort()[0] : null,
        any_auth: msgs.some(m => m.signals.auth_security),
        any_billing: msgs.some(m => m.signals.billing_finance),
        any_subscription: msgs.some(m => m.signals.subscription),
        any_rewards: msgs.some(m => m.signals.loyalty_rewards),
        any_cloud_domain: msgs.some(m => m.signals.domains_hosting_cloud),
        example_subjects: exampleSubjects,
        brand: this.domainBrands[domain] || domain,
      };

      results.push(result);
    }

    // Sort by score and message count
    return results.sort((a, b) => {
      if (b.total_score !== a.total_score) {
        return b.total_score - a.total_score;
      }
      return b.messages - a.messages;
    });
  }
}
