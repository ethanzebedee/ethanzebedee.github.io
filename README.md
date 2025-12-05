# Ethan Hammond - Portfolio

Personal portfolio website hosted on GitHub Pages.

## 🚀 Quick Start

This is a static site that requires no build process. Simply open `index.html` in your browser to view locally.

### Local Development

1. Clone the repository
2. Open `index.html` in your browser, or use a local server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```
3. Visit `http://localhost:8000`

### Deployment

GitHub Pages automatically deploys from the `main` branch. Simply push your changes:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Your site will be live at: https://ethanzebedee.github.io

## 📝 Customization

### Update Your Information

1. **index.html**: Update your name, bio, projects, and contact links
2. **styles.css**: Modify colors in the `:root` section to match your brand
3. **script.js**: Add custom interactions if needed

### Color Scheme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --text-light: #6b7280;
}
```

## 📁 Project Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # Styles
├── script.js       # JavaScript interactions
├── README.md       # This file
├── WARP.md         # Warp AI guidance
└── .gitignore      # Git ignore rules
```

## ✨ Features

- Responsive design
- Smooth scrolling navigation
- Animated project cards
- Clean, modern UI
- No build process required

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript
