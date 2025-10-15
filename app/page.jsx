"use client";

import React, { useMemo, useState, useEffect } from "react";

/**
 * GLOBAL REAL‑ESTATE REFERRAL — LEAD‑GEN + LISTINGS + MEDIA
 * Single‑file React component ready for Next.js.
 */

const CONFIG = {
  SITE_NAME: "Skyline Houses",
  BRAND_TAGLINE: "Trusted agents. Anywhere in the world.",
  BROKERAGE_NAME: "Your Brokerage, LLC",
  BROKERAGE_REFERRAL_EMAIL: "referrals@yourbrokerage.com",
  BROKER_PHONE: "+1 (555) 555‑5555",
  SERVICE_REGIONS_HINT:
    "United States, Canada, Europe, APAC, and more — we match you with a vetted local agent.",
  BROKER_PORTAL_URL:
    "https://www.erelocation.net/2.0.0.0/b2breferral5/referral.aspx?brokerid=769&brokerunid=1a6e38a3&t=0&tpid=",
  WEBHOOK_URL: "https://hooks.zapier.com/hooks/catch/25000078/u5xcx0c/",
  PRIVACY_URL: "#privacy",
  TERMS_URL: "#terms",
  LOGO_TEXT: "SRN",
  BRAND_COLOR: "#111827",
};

const SAMPLE_LISTINGS = [
  { id: "det-001", title: "3bd Craftsman in Royal Oak", city: "Royal Oak, MI", price: 389000, beds: 3, baths: 2, sqft: 1580, img: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1200&auto=format&fit=crop", url: "#", tags: ["Detroit Area", "New Listing"] },
  { id: "phx-101", title: "Scottsdale Modern w/ Pool", city: "Scottssdale, AZ", price: 975000, beds: 4, baths: 3, sqft: 2600, img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop", url: "#", tags: ["Phoenix Area", "Pool"] },
  { id: "gr-021", title: "Downtown Grand Rapids Loft", city: "Grand Rapids, MI", price: 325000, beds: 2, baths: 2, sqft: 1200, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop", url: "#", tags: ["Grand Rapids", "Condo"] },
  { id: "tky-888", title: "Tokyo Minato-ku Tower Flat", city: "Tokyo, Japan", price: 185000000, beds: 2, baths: 1, sqft: 820, img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop", url: "#", tags: ["International", "High-Rise"] },
];

const SAMPLE_MEDIA = [
  { id: "m1", title: "Detroit Waterfront Homes — Photo Tour", cover: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop", excerpt: "Drone highlights, sunrise shots, and tips for buying near the water.", tags: ["Detroit", "Waterfront", "Photography"], url: "#" },
  { id: "m2", title: "Phoenix New Construction: What $700k Gets You", cover: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop", excerpt: "We toured 4 developments around Scottsdale and Chandler.", tags: ["Phoenix", "New Build"], url: "#" },
  { id: "m3", title: "Tokyo Rentals 101 — Key Money & Guarantors Explained", cover: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=1200&auto=format&fit=crop", excerpt: "Moving to Japan? Here’s what to know before you hunt.", tags: ["Tokyo", "Renting Abroad"], url: "#" },
];

const PRICE_OPTIONS = [
  { label: "Under $250k", value: "under_250k" },
  { label: "$250k–$400k", value: "250_400" },
  { label: "$400k–$700k", value: "400_700" },
  { label: "$700k–$1M", value: "700_1000" },
  { label: "$1M+", value: "1m_plus" },
  { label: "Unsure / Just looking", value: "unsure" },
];

const TIMELINE_OPTIONS = [
  { label: "ASAP (0–30 days)", value: "0_30" },
  { label: "1–3 months", value: "1_3" },
  { label: "3–6 months", value: "3_6" },
  { label: "6–12+ months", value: "6_12" },
  { label: "Just browsing", value: "browsing" },
];

const INTENT_OPTIONS = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Rent / Lease", value: "rent" },
  { label: "Invest", value: "invest" },
  { label: "Other / Advice", value: "other" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("match");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("All Markets");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United States",
    city: "",
    stateRegion: "",
    postalCode: "",
    priceRange: "",
    timeline: "",
    intent: "buy",
    notes: "",
    marketingConsent: true,
  });

  const allValid = useMemo(() => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      /.+@.+\..+/.test(form.email) &&
      form.phone.trim() &&
      form.country.trim() &&
      form.city.trim() &&
      form.priceRange &&
      form.timeline &&
      form.intent
    );
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!allValid) {
      setError("Please complete all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        _meta: {
          site: CONFIG.SITE_NAME,
          submittedAt: new Date().toISOString(),
          source: typeof window !== "undefined" ? window.location.href : "local",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      };

      if (CONFIG.WEBHOOK_URL && CONFIG.WEBHOOK_URL.startsWith("http")) {
        try {
          await fetch(CONFIG.WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch {}
      }

      backgroundSubmitToBrokerPortal(payload);

      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setError("We couldn’t submit your request. Please try again.");
    }
  }

  function backgroundSubmitToBrokerPortal(data) {
    try {
      const iframe = document.createElement("iframe");
      iframe.name = "broker_submit_target";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const f = document.createElement("form");
      f.method = "POST";
      f.action = CONFIG.BROKER_PORTAL_URL;
      f.target = "broker_submit_target";
      f.style.display = "none";

      const add = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value ?? "";
        f.appendChild(input);
      };

      add("FirstName", data.firstName);
      add("LastName", data.lastName);
      add("Email", data.email);
      add("Phone", data.phone);
      add("Country", data.country);
      add("City", data.city);
      add("State", data.stateRegion);
      add("PostalCode", data.postalCode);
      add("PriceRange", data.priceRange);
      add("Timeline", data.timeline);
      add("Intent", data.intent);
      add("Comments", data.notes);
      add("SourceUrl", data._meta?.source || "");
      add("UserAgent", data._meta?.userAgent || "");

      document.body.appendChild(f);
      f.submit();

      setTimeout(() => {
        try { f.remove(); iframe.remove(); } catch {}
      }, 4000);
    } catch (e) {
      console.warn("Broker portal background submit failed", e);
    }
  }

  const markets = ["All Markets", "Detroit Area", "Grand Rapids", "Phoenix Area", "International"];
  const listings = useMemo(() => {
    return SAMPLE_LISTINGS.filter((l) => {
      const inMarket = market === "All Markets" || l.tags.includes(market);
      const inQuery = !query || (l.title + " " + l.city).toLowerCase().includes(query.toLowerCase());
      return inMarket && inQuery;
    });
  }, [query, market]);

  const mediaItems = SAMPLE_MEDIA;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: CONFIG.BRAND_COLOR }}>{CONFIG.LOGO_TEXT}</div>
            <div>
              <div className="text-base font-semibold text-gray-900">{CONFIG.SITE_NAME}</div>
              <div className="text-sm text-gray-500 -mt-0.5">{CONFIG.BRAND_TAGLINE}</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => setActiveTab("match")} className={`hover:text-gray-900 ${activeTab==='match' ? 'font-semibold text-gray-900' : ''}`}>Match</button>
            <button onClick={() => setActiveTab("listings")} className={`hover:text-gray-900 ${activeTab==='listings' ? 'font-semibold text-gray-900' : ''}`}>Listings</button>
            <button onClick={() => setActiveTab("media")} className={`hover:text-gray-900 ${activeTab==='media' ? 'font-semibold text-gray-900' : ''}`}>Media</button>
            <a href="#get-started" className="px-3 py-1.5 rounded-lg bg-gray-900 text-white">Get started</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Find a trusted local agent — <span className="text-gray-600">anywhere</span>.
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Tell us where you’re buying, selling, renting, or investing. We’ll match you with a vetted agent and
              coordinate an introduction through {CONFIG.BROKERAGE_NAME}. No obligations.
            </p>
            <ul className="mt-6 space-y-2 text-gray-700 text-sm">
              <li>• Free concierge match, worldwide</li>
              <li>• Browse listings or explore market media to get inspired</li>
              <li>• Fast introductions — usually within 1 business day</li>
            </ul>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
              <span>Questions? Call {CONFIG.BROKER_PHONE}</span>
            </div>

            <div className="mt-6 md:hidden flex gap-2">
              {[
                {k:"match", label:"Match"},
                {k:"listings", label:"Listings"},
                {k:"media", label:"Media"},
              ].map(t => (
                <button key={t.k} onClick={() => setActiveTab(t.k)} className={`px-3 py-1.5 rounded-lg border ${activeTab===t.k? 'bg-gray-900 text-white border-gray-900':'border-gray-300 text-gray-700'}`}>{t.label}</button>
              ))}
            </div>
          </div>

          <div id="get-started" className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            {activeTab !== "match" ? (
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-gray-900 mb-2">Lead Match</div>
                Switch to <button onClick={() => setActiveTab("match")} className="underline">Match</button> to submit your details.
              </div>
            ) : success ? (
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">You’re all set ✅</div>
                <p className="mt-2 text-gray-600">
                  We received your request. A placement specialist will email you shortly with your local agent introduction.
                </p>
                <p className="mt-4 text-gray-500 text-sm">Need to add details? Reply to our confirmation email anytime.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">First name *</label>
                    <input name="firstName" value={form.firstName} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Last name *</label>
                    <input name="lastName" value={form.lastName} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text sm text-gray-700">Phone *</label>
                    <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="+1 555 555 5555" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Country *</label>
                    <input name="country" value={form.country} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="United States" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">City *</label>
                    <input name="city" value={form.city} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Detroit" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">State / Region</label>
                    <input name="stateRegion" value={form.stateRegion} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="MI / Kanto / NSW" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">ZIP / Postal</label>
                    <input name="postalCode" value={form.postalCode} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="48083 / 106‑0032" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Intent *</label>
                    <select name="intent" value={form.intent} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900">
                      {INTENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Price range *</label>
                    <select name="priceRange" value={form.priceRange} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900">
                      <option value="">Select…</option>
                      {PRICE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Timeline *</label>
                    <select name="timeline" value={form.timeline} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900">
                      <option value="">Select…</option>
                      {TIMELINE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Notes (neighborhood, features, questions)</label>
                  <textarea name="notes" rows={3} value={form.notes} onChange={onChange} className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="e.g., 3bd near good schools; condo with gym; selling before buying; pre‑approved?" />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <input type="checkbox" name="marketingConsent" checked={form.marketingConsent} onChange={onChange} className="mt-1" />
                  <span>
                    I agree to be contacted by {CONFIG.SITE_NAME} and {CONFIG.BROKERAGE_NAME}. We respect your privacy.{" "}
                    <button type="button" className="underline" onClick={() => setConsentOpen(true)}>Learn more</button>.
                  </span>
                </div>

                <button type="submit" disabled={submitting} className="w-full mt-1 bg-gray-900 text-white rounded-xl py-3 font-semibold hover:opacity-95 disabled:opacity-60">
                  {submitting ? "Submitting…" : "Get my local agent match"}
                </button>
                <p className="text-[11px] text-gray-500 text-center">
                  By submitting, you agree to our <a className="underline" href={CONFIG.TERMS_URL}>Terms</a> and <a className="underline" href={CONFIG.PRIVACY_URL}>Privacy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className={`${activeTab==='listings' ? '' : 'hidden'} py-10 border-t border-gray-200 bg-white`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Listings</h2>
              <p className="text-gray-600 mt-1 text-sm">Demo data shown. Replace with your IDX embed or API feed.</p>
            </div>
            <div className="flex gap-2">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search city or title" className="rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900" />
              <select value={market} onChange={(e)=>setMarket(e.target.value)} className="rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900">
                {["All Markets", "Detroit Area", "Grand Rapids", "Phoenix Area", "International"].map(m=> <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
            <div className="font-semibold text-gray-900 mb-1">IDX Integration</div>
            <p>
              Paste your IDX provider embed here (Showcase IDX / iHomefinder / IDX Broker / Sierra, etc.). Remove the sample grid below if you use the widget.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((h) => (
              <a key={h.id} href={h.url} className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img src={h.img} alt={h.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500">{h.city}</div>
                  <div className="font-semibold text-gray-900">{h.title}</div>
                  <div className="mt-1 text-gray-700 text-sm">${" "}{h.price.toLocaleString()}</div>
                  <div className="mt-1 text-gray-500 text-xs">{h.beds} bd • {h.baths} ba • {h.sqft.toLocaleString()} sqft</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {h.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">{t}</span>)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MEDIA */}
      <section className={`${activeTab==='media' ? '' : 'hidden'} py-10 border-t border-gray-200 bg-white`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Market Media</h2>
              <p className="text-gray-600 mt-1 text-sm">Nationwide photos, reels, and guides to drive SEO and referrals.</p>
            </div>
            <a href="#get-started" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-gray-900 text-white">Get matched</a>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((m) => (
              <a key={m.id} href={m.url} className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow">
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img src={m.cover} alt={m.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900">{m.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{m.excerpt}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">{t}</span>)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} {CONFIG.SITE_NAME}. All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a href={CONFIG.PRIVACY_URL} className="underline">Privacy</a>
            <a href={CONFIG.TERMS_URL} className="underline">Terms</a>
            <button onClick={()=>setActiveTab('listings')} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white">Browse Listings</button>
          </div>
        </div>
      </footer>

      {consentOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900">Privacy & Consent</div>
              <button onClick={() => setConsentOpen(false)} className="text-gray-500">✕</button>
            </div>
            <div className="mt-3 text-sm text-gray-600 space-y-3">
              <p>
                We collect your contact information and search criteria to provide agent matching and concierge services.
                We may share your details with selected real‑estate professionals for the purpose of an introduction.
              </p>
              <p>
                You can opt out of marketing communications anytime by replying STOP or using the unsubscribe link.
              </p>
              <p>
                For data requests or deletion, email <a className="underline" href={`mailto:${CONFIG.BROKERAGE_REFERRAL_EMAIL}`}>{CONFIG.BROKERAGE_REFERRAL_EMAIL}</a>.
              </p>
            </div>
            <div className="mt-5 text-right">
              <button onClick={() => setConsentOpen(false)} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
