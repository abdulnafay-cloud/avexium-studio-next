import type { NextConfig } from 'next';
const config: NextConfig = {
 async redirects(){return [
  {source:'/contact',destination:'/start',permanent:false},
  ...['studio','industries','journal','hero-options'].map(section=>({source:`/${section}`,destination:'/',permanent:false})),
  ...Object.entries({'digital-marketing':'seo-digital-marketing','seo-content':'seo-digital-marketing','brand-design':'brand-identity','ui-ux-design':'ui-ux-product-design','mobile-development':'app-development','ecommerce':'e-commerce','automation-ai':'ai-automation','cloud-devops':'custom-software','3d-motion':'motion-3d'}).map(([oldSlug,slug])=>({source:`/services/${oldSlug}`,destination:`/services/${slug}`,permanent:false})),
  ...['industries','journal'].map(section=>({source:`/${section}/:slug`,destination:'/',permanent:false})),
 ];},
};
export default config;
