import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterCard?: string;
  robotsMeta?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Lebens- und Sozialberatung',
  description = 'Professionelle Lebens- und Sozialberatung',
  keywords = '',
  image,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  robotsMeta = 'index, follow',
  canonicalUrl,
  structuredData,
}) => {
  const siteUrl = url || window.location.href;
  const canonical = canonicalUrl || siteUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsMeta} />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
