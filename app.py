from flask import Flask, render_template, request, redirect, url_for, send_file, jsonify
import csv
import io
import re
from collections import defaultdict

app = Flask(__name__)


KNOWN_PROVIDERS = [
    "paypal", "chase", "bankofamerica", "bofa", "wellsfargo", "citibank",
    "amazon", "netflix", "spotify", "apple", "google", "paypal",
    "venmo", "stripe", "uber", "lyft", "verizon", "comcast", "att",
    "xero", "quickbooks", "intuit"
]

KEYWORDS_SUBS = ["subscription", "subscribe", "renewal", "membership", "receipt"]
KEYWORDS_FIN = ["invoice", "payment", "billing", "statement", "charge"]


def parse_csv(file_stream):
    # Accept either a bytes stream or text stream
    raw = file_stream.read()
    if isinstance(raw, bytes):
        text = raw.decode("utf-8", errors="ignore")
    else:
        text = str(raw)
    reader = csv.DictReader(io.StringIO(text))
    rows = [r for r in reader]
    return rows


def canonical_email(addr):
    if not addr:
        return ""
    addr = addr.strip().lower()
    # extract the email if it's in the form: Name <email@domain>
    m = re.search(r"([\w\.-]+@[\w\.-]+)", addr)
    if m:
        return m.group(1)
    return addr


def domain_of(addr):
    e = canonical_email(addr)
    parts = e.split("@")
    return parts[1] if len(parts) == 2 else ""


def detect_accounts(rows):
    # Process all rows from the single inbox; extract senders and detect potential accounts
    senders = set()

    for r in rows:
        frm = canonical_email(r.get("From") or r.get("from") or "")
        subj = (r.get("Subject") or r.get("subject") or "").lower()
        domain = domain_of(frm)

        if frm:
            senders.add((frm, domain, subj))

    # Heuristics: map senders/domains to potential account identifiers
    candidates = set()
    for frm, domain, subj in senders:
        # known providers
        matched = False
        for p in KNOWN_PROVIDERS:
            if p in frm or p in domain or p in subj:
                candidates.add(f"{p} <{domain}>")
                matched = True
        # subject keywords
        for k in KEYWORDS_SUBS + KEYWORDS_FIN:
            if k in subj:
                candidates.add(f"{frm} <{domain}>")
                matched = True

        # common patterns
        if any(x in frm for x in ["billing@", "invoice@", "receipt@", "noreply@", "no-reply@"]):
            candidates.add(f"{frm} <{domain}>")
            matched = True

        # fallback: if domain looks like a company domain, include it
        if not matched and domain:
            candidates.add(f"{frm} <{domain}>")

    # Return sorted list
    out = sorted(candidates)
    return {"accounts": out}


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    use_sample = request.form.get("use_sample")
    try:
        if use_sample:
            with open("data/sample_emails.csv", "rb") as f:
                rows = parse_csv(f)
        else:
            file = request.files.get("file")
            if not file:
                return redirect(url_for("index"))
            rows = parse_csv(file.stream)
    except Exception as e:
        # Avoid exposing internals; print to server log and show friendly message
        print("Error parsing CSV:", e)
        return render_template("results.html", error="Failed to parse CSV (check file encoding/headers).", results={"owner": None, "accounts": []})

    results = detect_accounts(rows)
    return render_template("results.html", results=results)


@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    # Accept uploaded CSV file, return JSON of findings
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "no file provided"}), 400
    rows = parse_csv(file.stream)
    results = detect_categories(rows)
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
