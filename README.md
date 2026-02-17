Enron Catalog Scanner (local)

This small Flask app parses an emails CSV and detects potential subscriptions, financial accounts, and utilities based only on header metadata (From, To, Subject, Date). It explicitly does NOT read or use email bodies.

Quick start (macOS):

1. Create and activate a venv:

```bash
python3 -m venv .venv
. .venv/bin/activate
```

2. Install requirements:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
export FLASK_APP=app.py
flask run --port 5000
```

4. Open http://127.0.0.1:5000 and either upload your `emails.csv` or click "Analyze Sample" to use the provided small sample.

Notes on usage and troubleshooting:
- The app expects CSV headers such as `From`, `To`, `Date`, `Subject`. It will not read `Body` content.
- The app assumes the input CSV represents a single person's inbox. It auto-detects the most common `To` address and only considers messages addressed to that owner.
- If you see an error, check that the CSV is UTF-8 encoded and that headers are present. The app will show a friendly parse error message rather than an internal server error.

Notes:
- The app expects CSV headers such as `From`, `To`, `Date`, `Subject`. It avoids using any `Body` content for analysis.
- Detection is heuristic-based; improve by adding more provider tokens or rules in `app.py`.

Files created:
- [app.py](app.py)
- [templates/index.html](templates/index.html)
- [templates/results.html](templates/results.html)
- [static/style.css](static/style.css)
- [data/sample_emails.csv](data/sample_emails.csv)
- [requirements.txt](requirements.txt)

If you want, I can:
- Add a drag-and-drop CSV uploader,
- Improve heuristics with fuzzy matching or domain lists,
- Add tests or a Dockerfile.
