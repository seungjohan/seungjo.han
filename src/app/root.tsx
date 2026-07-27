import { type ReactNode, useEffect } from 'react';
import { Links, Meta, Outlet, Scripts } from 'react-router';
import '../styles/index.css';

const GA_ID = 'G-3F73D31SGZ';
const GTM_ID = 'GTM-W6QS7F94';

// Analytics is injected client-side after hydration (see AnalyticsScripts).
// Rendering these <script> tags into the server <head> makes React reconcile
// them against the JSON-LD script emitted by <Meta />, which fails hydration
// ("Prop `type` did not match") and forces a full client re-render — that in
// turn breaks whileInView reveals. Loading them post-mount avoids all of that;
// gtag/GTM load async anyway, so there's no tracking loss that matters.
function injectScript(attrs: Partial<HTMLScriptElement>, inline?: string) {
  const el = document.createElement('script');
  Object.assign(el, attrs);
  if (inline) el.text = inline;
  document.head.appendChild(el);
}

function AnalyticsScripts() {
  useEffect(() => {
    if (document.getElementById('ga-gtag')) return; // guard against double-inject

    injectScript({ id: 'ga-gtag', async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` });
    injectScript(
      {},
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
    );
    injectScript(
      {},
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
    );
  }, []);

  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Raster, not the traced SVG. The source artwork is 17k paths / 9.4MB and
            was downloaded on every page view to render at 32px. Original kept at
            src/imports/brand/favicon-source.svg. */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="google-site-verification" content="5j9yeKVLbS4yrUq1ey-Uq18nC4ipWSoWjWEIu133Utc" />
        <Meta />
        <Links />
        <style>{`html, body { height: 100%; margin: 0; }`}</style>
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <AnalyticsScripts />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
