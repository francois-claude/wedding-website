# Francois & Laurel Wedding Website

A beautiful, modern wedding website featuring a cool blue-green theme and comprehensive mobile optimization.

## 🎨 Features

- **Modern Design** - Cool blueish-green accent color (#4a9b9b) with complementary dark blue navigation
- **Fully Responsive** - Optimized for all devices with mobile-first design
- **Hotel Information** - Four Seasons Resort Vail room block details
- **Registry Section** - Links to wedding registries
- **FAQ Section** - Common wedding questions and answers
- **RSVP System** - Guest response form with validation
- **Location Details** - Venue information and maps integration
- **Engagement Photos** - Beautiful photo gallery

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Open `index.html` in your browser

## 🛠 Development

```bash
# Build CSS and JS
npm run build

# Watch for changes (if available)
npm run watch

# Run security audit
npm run security
```

## 📱 Mobile Optimizations

- Enhanced viewport configuration for notched devices
- PWA capabilities with app-like experience
- Optimized touch targets and form inputs
- Improved performance with scroll-based backgrounds
- iOS-specific optimizations

## 🎯 Sections

1. **Hero Banner** - Welcome message with RSVP call-to-action
2. **Invitation** - Wedding date and celebration details
3. **Events** - Wedding timeline and dress code
4. **Hotel** - Four Seasons Vail accommodation details
5. **Engagement Photos** - Photo gallery
6. **Location** - Venue video and information
7. **Maps** - Interactive Google Maps integration
8. **Registry** - Gift registry links
9. **FAQ** - Frequently asked questions
10. **RSVP** - Guest response form

## 🔧 Customization

### Colors
Edit `sass/partials/_colors.scss` to change the color scheme:
```scss
$accent-color: #4a9b9b; // Main accent color
$accent-color-hover: #3a8080; // Hover state
```

### Content
Update `index.html` with your wedding details:
- Names and dates
- Venue information
- Hotel details
- Registry links

### Images
Replace images in the `img/` directory:
- `hero-min.jpg` - Main banner background
- `four-seasons-vail.jpg` - Hotel section background
- Engagement photos in `img/eng_pics/`

## 📋 TODO

- [ ] Add actual registry links
- [ ] Configure Google Maps API key
- [ ] Set up RSVP form backend
- [ ] Add real hotel booking link
- [ ] Customize FAQ content

## 🔒 Security

The website includes security best practices:
- Content Security Policy headers
- Input validation and sanitization
- No exposed API keys in repository
- Secure navigation anchor handling

## 📄 License

This project is licensed under the GPL-3.0 License.

---

**Built with ❤️ for Francois & Laurel's special day**
