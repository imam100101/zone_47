# Gadget Shop Website (Free, No-Backend)

This is a simple, fast online shop for phones and gadgets. It runs on free static hosting (GitHub Pages/Netlify/Vercel) and checks out via WhatsApp chat (cash/transfer).

## How to use
1. Put these files in a new public GitHub repository.
2. Enable GitHub Pages (Deploy from branch → main → root).
3. Your site URL will appear. Share it with customers.

## Customize
- Change the shop name and phone number in `index.html` inside `window.SHOP_CONFIG`.
- Edit products in `products.js`. Each product has: `id`, `name`, `price`, `category`, `img`.

## Convert to Telegram Mini App later
- Host this site.
- In @BotFather: /setdomain → paste your site URL.
- Add a WebApp button pointing to your site. Done.
