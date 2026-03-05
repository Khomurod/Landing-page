# SafeHaul Landing Page

A sales-focused, enterprise-grade static landing page for SafeHaul.

## Technologies Used
- **HTML5:** Semantic architecture for layout, SEO, and accessibility.
- **CSS3:** Custom CSS with CSS variables, Flexbox/Grid layouts, without heavy frameworks to ensure optimal performance. Includes minimal scroll animations and hover effects.
- **Vanilla JavaScript:** Handles the sticky navigation, mobile menu toggle, FAQ accordions, and Short-Form Modal logic. No heavy dependencies.

## Key Features & Files
- `index.html`: The main markup file containing the sections: Hero, Features, Compare, Pricing, Testimonials, FAQ, Footer, and Modal.
- `assets/css/styles.css`: The global styles. All branding colors are set as CSS root variables (`:root`) for easy theming.
- `assets/js/main.js`: Interaction script.

## Handoff & Maintenance Instructions

### 1. Updating Text & Content
All text (headlines, FAQs, features) is hardcoded in `index.html`. Open the file and search for the specific text. Update paragraphs directly within the `<p>` and `<h3>`/`<h2>` tags.

### 2. Updating App Screenshots
The landing page relies on screenshots from the real platform (located in `assets/images/`).
To replace them:
1. Export your latest app screenshot.
2. Name it identically (e.g., `hero-dashboard.png` or `feature-tracking.png`).
3. Overwrite the file in the `assets/images/` folder.
*Alternatively, you can add new images to the folder and update the `<img src="...">` paths in `index.html`.*

### 3. Plans & Pricing Adjustments
In `index.html`, locate the `<section id="pricing">`.
Prices and tier features can be adjusted simply by modifying the HTML content inside the `.price-card` divs.

### 4. Wiring up the Lead Generation Form
The site uses a unified completely custom Short-Form modal linked to every "Get Started" and "Schedule Demo" button (via the `.js-open-lead-modal` class).
- Logic is managed inside `assets/js/main.js`.
- Search for the `Handle Form Submit` section inside `main.js`.
- It currently mimics a network submission delay and shows a success view.
- **To wire to your CRM/Backend:** Replace `setTimeout` with a standard `fetch(...)` POST request pointing to your API or CRM webhook url, passing the `FormData`.

### 5. Deployment
The site is purely static (HTML/CSS/JS). It can be deployed immediately with zero build-steps to hosting platforms like:
- Netlify (Drag and drop the folder)
- Vercel
- Firebase Hosting (run `firebase init hosting`, then `firebase deploy`)
- AWS S3 or Cloudflare Pages
