import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Seungjo Han';
const SITE_URL = 'https://seungjohan.github.io';
const DEFAULT_DESCRIPTION =
  'Product manager and builder in Seoul, sharing selected work, startup lessons, and writing on product, design, and technology.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

type SEOProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
};

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
