import { useState, useEffect } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const GA_KEY  = 'G-3F73D31SGZ';
const GTM_KEY = 'GTM-W6QS7F94';
const GSC_KEY = '5j9yeKVLbS4yrUq1ey-Uq18nC4ipWSoWjWEIu133Utc';
const GA_PROPERTY_KEY = '538907198';
const GOOGLE_ACCESS_TOKEN_KEY = 'sj_google_access_token';
const GTM_ACCOUNT_KEY = 'sj_gtm_account_id';
const GTM_CONTAINER_API_KEY = 'sj_gtm_container_api_id';

export default function AdminAnalytics() {
  const [gaId,    setGaId]    = useState('');
  const [gtmId,   setGtmId]   = useState('');
  const [gscMeta, setGscMeta] = useState('');
  const [gaPropertyId, setGaPropertyId] = useState('');
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [gtmAccountId, setGtmAccountId] = useState('');
  const [gtmContainerApiId, setGtmContainerApiId] = useState('');
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    setGaId(localStorage.getItem(GA_KEY)  ?? '');
    setGtmId(localStorage.getItem(GTM_KEY) ?? '');
    setGscMeta(localStorage.getItem(GSC_KEY) ?? '');
    setGaPropertyId(localStorage.getItem(GA_PROPERTY_KEY) ?? '');
    setGoogleAccessToken(localStorage.getItem(GOOGLE_ACCESS_TOKEN_KEY) ?? '');
    setGtmAccountId(localStorage.getItem(GTM_ACCOUNT_KEY) ?? '');
    setGtmContainerApiId(localStorage.getItem(GTM_CONTAINER_API_KEY) ?? '');
  }, []);

  const handleSave = () => {
    if (gaId.trim())    localStorage.setItem(GA_KEY,  gaId.trim());
    else                localStorage.removeItem(GA_KEY);
    if (gtmId.trim())   localStorage.setItem(GTM_KEY, gtmId.trim());
    else                localStorage.removeItem(GTM_KEY);
    if (gscMeta.trim()) localStorage.setItem(GSC_KEY, gscMeta.trim());
    else                localStorage.removeItem(GSC_KEY);
    if (gaPropertyId.trim()) localStorage.setItem(GA_PROPERTY_KEY, gaPropertyId.trim());
    else                     localStorage.removeItem(GA_PROPERTY_KEY);
    if (googleAccessToken.trim()) localStorage.setItem(GOOGLE_ACCESS_TOKEN_KEY, googleAccessToken.trim());
    else                          localStorage.removeItem(GOOGLE_ACCESS_TOKEN_KEY);
    if (gtmAccountId.trim()) localStorage.setItem(GTM_ACCOUNT_KEY, gtmAccountId.trim());
    else                     localStorage.removeItem(GTM_ACCOUNT_KEY);
    if (gtmContainerApiId.trim()) localStorage.setItem(GTM_CONTAINER_API_KEY, gtmContainerApiId.trim());
    else                          localStorage.removeItem(GTM_CONTAINER_API_KEY);
    setSaved(true);
    toast.success('Analytics settings saved. Reload the site to activate scripts.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <Toaster position="top-center" richColors />
      <div className="mb-8">
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
          Analytics &amp; Tracking
        </h1>
        <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
          Connect Google Analytics, GTM, and Search Console. IDs are saved in your browser's localStorage and injected automatically on page load.
        </p>
      </div>

      <div className="space-y-8">

        {/* GA4 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-5">
            <div>
              <p className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 500 }}>Google Analytics 4</p>
              <p className="text-xs text-gray-400">
                Paste your Measurement ID (format: <code className="bg-gray-100 px-1 rounded">G-XXXXXXXXXX</code>).
                The gtag.js script will be injected automatically.
              </p>
            </div>
          </div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Measurement ID</label>
          <input
            value={gaId}
            onChange={e => setGaId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
          />
          {gaId && (
            <a
              href={`https://analytics.google.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              Open Google Analytics →
            </a>
          )}
        </div>

        {/* GTM */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-5">
            <p className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 500 }}>Google Tag Manager</p>
            <p className="text-xs text-gray-400">
              Paste your Container ID (format: <code className="bg-gray-100 px-1 rounded">GTM-XXXXXXX</code>).
              Both the head and body GTM snippets will be injected.
            </p>
          </div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Container ID</label>
          <input
            value={gtmId}
            onChange={e => setGtmId(e.target.value)}
            placeholder="GTM-XXXXXXX"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
          />
          {gtmId && (
            <a
              href={`https://tagmanager.google.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              Open Tag Manager →
            </a>
          )}
        </div>

        {/* Search Console */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-5">
            <p className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 500 }}>Google Search Console</p>
            <p className="text-xs text-gray-400">
              For HTML-tag verification, paste the full <code className="bg-gray-100 px-1 rounded">content</code> attribute value from your verification meta tag.
              A meta tag will be injected into the page head.
            </p>
          </div>
          <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-100 rounded-lg mb-4">
            <Info size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              After saving, verify ownership in Search Console using the "HTML tag" method. Note: SPAs sometimes need a static HTML file for reliable GSC verification. If the meta tag method fails, use the DNS TXT record method instead.
            </p>
          </div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Verification Content Value</label>
          <input
            value={gscMeta}
            onChange={e => setGscMeta(e.target.value)}
            placeholder="abc123xyz..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
          />
          <p className="text-xs text-gray-400 mt-2">
            Example: if the tag is{' '}
            <code className="bg-gray-100 px-1 rounded">{'<meta name="google-site-verification" content="abc123" />'}</code>,
            paste only <code className="bg-gray-100 px-1 rounded">abc123</code>.
          </p>
          {gscMeta && (
            <a
              href="https://search.google.com/search-console/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              Open Search Console →
            </a>
          )}
        </div>

        {/* Google reporting API */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-5">
            <p className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 500 }}>Google API Data Sync</p>
            <p className="text-xs text-gray-400">
              Used by the dashboard to fetch GA4 report data and verify GTM container access. Store only temporary OAuth access tokens here.
            </p>
          </div>
          <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-100 rounded-lg mb-4">
            <Info size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              A static frontend cannot safely store service-account JSON or long-lived secrets. Use a short-lived OAuth access token with Analytics Data API and Tag Manager API access.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">GA4 Property ID</label>
              <input
                value={gaPropertyId}
                onChange={e => setGaPropertyId(e.target.value)}
                placeholder="123456789"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Google OAuth Access Token</label>
              <input
                value={googleAccessToken}
                onChange={e => setGoogleAccessToken(e.target.value)}
                placeholder="ya29..."
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">GTM Account ID</label>
                <input
                  value={gtmAccountId}
                  onChange={e => setGtmAccountId(e.target.value)}
                  placeholder="1234567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">GTM API Container ID</label>
                <input
                  value={gtmContainerApiId}
                  onChange={e => setGtmContainerApiId(e.target.value)}
                  placeholder="7654321"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gray-950 text-white rounded-xl px-6 py-3 text-sm hover:bg-gray-800 transition-colors"
        >
          {saved ? <CheckCircle size={14} /> : null}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
