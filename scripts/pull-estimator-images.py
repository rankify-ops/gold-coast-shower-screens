"""
Pull the estimator's option images.

Their instant-estimate form is a Zoho embed. The form definition — option
labels and image references together — is in the page HTML, and the image
filenames are the client's own descriptive names (`FF_Door_Fixed_Return.png`,
`PSF_Splay_Door_Fixed_Return.png`), which is exactly what we want.

Two sources are tried, in order:

  1. Zoho's `/public?event-id=...` endpoint, with a session cookie and the
     form as referer. The endpoint 404s without both.
  2. The client's own WordPress uploads, in case the same artwork was
     published there too — simpler and more stable if it exists.

Run:  python scripts/pull-estimator-images.py
"""
import html as htmllib
import http.cookiejar
import json
import os
import re
import urllib.parse
import urllib.request

SRC = "assets-raw/estimator/_form.html"
OUT = "assets-raw/estimator"
FORM = (
    "https://forms.zohopublic.com.au/queenslandshowerscreens1/form/"
    "WebsiteContactUs/formperma/9rAadoA3uOFHaM5VC17uMGJl0glYTGRMwUX7GSbNg_A"
)
ZOHO = "https://forms.zohopublic.com.au"
WP = "https://www.goldcoastshowerscreens.com.au/wp-content/uploads/"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

os.makedirs(OUT, exist_ok=True)

# One opener carrying a cookie jar, so the form visit's session is reused for
# the image requests.
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [("User-Agent", UA)]


def get(url, referer=None, timeout=40):
    req = urllib.request.Request(url)
    if referer:
        req.add_header("Referer", referer)
    with opener.open(req, timeout=timeout) as r:
        return r.read()


# Warm the session.
try:
    get(FORM)
    print(f"session cookies: {len(jar)}")
except Exception as e:
    print("form fetch failed:", e)

doc = htmllib.unescape(open(SRC, encoding="utf-8", errors="replace").read())

refs = re.findall(r"/public\?event-id=[^\"'\\\s>]+", doc)
seen, items = set(), []
for path in refs:
    dec = urllib.parse.unquote(urllib.parse.unquote(path))
    m = re.search(r"([^/\\]+\.(?:png|jpg|jpeg|webp|svg))", dec, re.I)
    if not m:
        continue
    # Strip Zoho's upload timestamp: 1755391138493_Foo.png -> Foo.png
    name = re.sub(r"^\d{10,}_", "", m.group(1))
    if name in seen:
        continue
    seen.add(name)
    items.append({"file": name, "zoho": ZOHO + path})

print(f"{len(refs)} refs, {len(items)} unique files")

got, failed = [], []
for it in items:
    dest = os.path.join(OUT, it["file"])
    if os.path.exists(dest) and os.path.getsize(dest) > 400:
        got.append(it["file"])
        continue

    data = None
    for label, url, ref in (
        ("zoho", it["zoho"], FORM),
        ("wp", WP + it["file"], None),
    ):
        try:
            d = get(url, referer=ref, timeout=40)
            # Misses come back as an HTML error page, not a 404.
            if d and d[:1] != b"<" and len(d) > 400:
                data = d
                it["via"] = label
                break
        except Exception:
            continue

    if data:
        open(dest, "wb").write(data)
        got.append(it["file"])
    else:
        failed.append(it["file"])

json.dump(
    {"ok": got, "failed": failed},
    open(os.path.join(OUT, "_map.json"), "w"),
    indent=1,
)

print(f"\ndownloaded: {len(got)}   failed: {len(failed)}")
if got:
    print("sample:", ", ".join(sorted(got)[:6]))
if failed:
    print("first failures:", ", ".join(sorted(failed)[:6]))
