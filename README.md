# Moonpure — Dry Fruits Store Website

A fully static, multi-page website for **Moonpure**, a small Pakistani dry-fruits and
gift-pack business (Instagram: [@moonpure.pk](https://www.instagram.com/moonpure.pk)).
Built for the Web Technologies Assignment 01 brief: HTML + CSS + JavaScript only,
no backend, no framework.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero banner, highlights, featured product slider, testimonials |
| About | `about.html` | Brand story, values, "how an order comes together" process |
| Products | `products.html` | Full catalog with category filter + live search |
| Gallery | `gallery.html` | Photo grid with a click-to-open lightbox |
| Contact | `contact.html` | Validated contact form, FAQ accordion, map |

## Folder structure

```
moonpure/
├── index.html
├── about.html
├── products.html
├── gallery.html
├── contact.html
├── css/
│   └── style.css        # single stylesheet, CSS variables, Flexbox + Grid, media queries
├── js/
│   ├── nav.js            # hamburger menu, active link, footer year
│   ├── products.js        # product data, render grid, filter, search, slider
│   ├── cart.js             # order-list ("cart") logic, localStorage, WhatsApp handoff
│   ├── gallery.js          # lightbox modal with keyboard navigation
│   └── contact.js          # form validation + FAQ accordion
└── images/                # placeholder — see note below
```

## JavaScript features (interactivity)

1. **Responsive hamburger navigation** — collapses into a slide-down menu under 720px.
2. **Product filter + live search** (`products.html`) — filter by category chips and
   search-as-you-type, both driving the same render function.
3. **Order list ("cart") with localStorage** — add/remove items, adjust quantity,
   running total, persists across page reloads, and builds a pre-filled WhatsApp
   message so a visitor can "check out" without any backend.
4. **Featured product slider** (`index.html`) — horizontal scroll carousel with
   prev/next controls.
5. **Gallery lightbox** — click any photo to view it full-size, with previous/next
   buttons and Escape / Arrow-key keyboard support.
6. **Contact form validation** — required-field, email-format and phone-format
   checks with inline error messages, plus a success confirmation on valid submit.
7. **FAQ accordion** — expand/collapse question panels on the Contact page.

All of the above use real DOM manipulation and event listeners — no libraries.

## About the images

Most product photos are the real ones from the `@moonpure.pk` Instagram — the
logo, almonds, cashews, dates, figs and mixed dry fruit shots in `images/` were
cropped straight from actual posts. A few items Moonpure doesn't have a clean
product shot for yet (walnuts, pumpkin seeds) use free-license Unsplash photos as
placeholders — swap those `src="https://images.unsplash.com/..."` links for your
own photos in `images/` whenever you shoot them, both in the HTML files and in
the `PRODUCTS` array at the top of `js/products.js`.

Two of the homepage promo images (`images/promo-dates-poster.jpg` and
`images/promo-energy-poster.jpg`) are actual Moonpure marketing posters, used
as-is since they already carry the brand's own design and phone number.

## Git / GitHub workflow

This project was initialized as a git repository with feature branches, matching
the assignment's version-control requirement. To push it to your own GitHub:

```bash
# 1. Create an empty repository on GitHub named "moonpure" (no README/license)
# 2. From inside this project folder:
git remote add origin https://github.com/<your-username>/moonpure.git
git branch -M main
git push -u origin main
git push origin --all   # pushes the feature branches too
```

Feature branches included in the history:
- `feature-navbar` — navigation + hamburger menu
- `feature-products` — product catalog, filter/search, cart
- `feature-gallery` — gallery + lightbox
- `feature-contact-form` — contact form validation + FAQ accordion

Each was merged into `main` with its own commit, so `git log --oneline --graph --all`
shows a realistic branching history you can walk through in the viva.

## Notes for the viva

- Colours, fonts and spacing are controlled from CSS custom properties at the top
  of `css/style.css` — change one variable to re-theme the whole site.
- `js/products.js` renders product cards from a single `PRODUCTS` array — the same
  render function powers both the homepage slider and the full catalog grid.
- The order list in `js/cart.js` is intentionally backend-free: it's just
  `localStorage` plus a generated `wa.me` link, which is realistic for a small
  business that takes orders over WhatsApp.
