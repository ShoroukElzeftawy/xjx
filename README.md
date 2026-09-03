# XJEWELRYX React Website

Responsive multi-page jewelry website prototype built with React and Next.js.

## Local preview

Use Node 22, install the packages, and run the development script.

## Netlify

This repository includes `netlify.toml` and is ready to import from GitHub,
GitLab, or Bitbucket. Netlify uses Node 22 and its official Next.js runtime.

The site reads the live catalog from `xjewelryx-2.myshopify.com` and sends
checkout through the Storefront Cart API. Add `SHOPIFY_STORE_DOMAIN` and
`SHOPIFY_STOREFRONT_TOKEN` in `.env` or Netlify. Copy the names from
`.env.example`; do not commit the real token. Without a token, product pages
still deep-link to the Shopify store.
