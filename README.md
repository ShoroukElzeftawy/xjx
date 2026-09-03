# XJEWELRYX React Website

Responsive multi-page jewelry website prototype built with React and Next.js.

## Local preview

Use Node 22, install the packages, and run the development script.

## Netlify

This repository includes `netlify.toml` and is ready to import from GitHub,
GitLab, or Bitbucket. Netlify uses Node 22 and its official Next.js runtime.

The site reads the live catalog from `xjewelryx-2.myshopify.com` and sends
checkout through the Storefront Cart API.

Admin email and password are **not** stored in this repo. Use them only to
sign in at [admin.shopify.com](https://admin.shopify.com), then:

1. Settings → Apps and sales channels → Develop apps → Create an app
2. Configure Storefront API scopes: products, collections, cart
3. Install the app and copy the **Storefront API access token**
4. Put it in `.env.local` as `SHOPIFY_STOREFRONT_TOKEN` (see `.env.example`)
5. Restart the Next.js server

The storefront password page (“Opening soon”) is separate. It does not replace
the Storefront token. Without a token, product pages still deep-link to Shopify.
