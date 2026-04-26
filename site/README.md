# Project Force — projectforce.in

Static, zero-dependency rebuild of projectforce.in.

## Stack

- HTML5, CSS3, vanilla JavaScript (ES6+)
- Inter via Google Fonts (`font-display: swap`)
- No Bootstrap, no jQuery, no frameworks, no build step

## Structure

```
site/
├── index.html
├── about.html
├── services.html
├── clients.html
├── contact.html
├── gallery.html
├── privacy-policy.html
├── terms.html
├── locate.html           (legacy -> 301 to /contact.html#map)
├── css/styles.css
├── js/main.js
├── js/contact-form.js
├── img/                  (logo, hero, gallery, clients)
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── .htaccess             (Apache: caching, gzip, 301 redirect)
```

## Local development

From the `site/` directory:

```bash
python3 -m http.server 7777
```

Open http://localhost:7777/

## Deployment

Upload everything in `site/` to your web root. On Apache, `.htaccess`
handles the `/locate.html` 301 redirect and cache headers automatically.
On Nginx, translate the redirect to:

```
location = /locate.html { return 301 /contact.html#map; }
```

## Quality gates

- WCAG AAA contrast for body text
- LocalBusiness JSON-LD on `/` and `/contact.html`
- Sitemap + robots.txt
- Open Graph tags on every page
- Lazy-loaded below-fold images
- Inline SVG icons (no icon fonts)
