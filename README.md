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
- **Security Optimized** - Comprehensive security audit and best practices

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/francois-claude/wedding-website.git
cd wedding-website

# Install dependencies
npm install

# Build the project (compiles SASS and minifies JS)
npm run build

# For development with file watching
npm run watch

# Run security audit
npm run security

# Open index.html in your browser or serve locally
python3 -m http.server 8080
# Then visit http://localhost:8080
```

## 🏗 Production Deployment

### Manual Deployment

```bash
# Build for production
npm run build

# Copy files to web server
sudo cp -r * /var/www/wedding-website/
sudo chown -R www-data:www-data /var/www/wedding-website
```

### Systemd Service Deployment

1. **Copy files to production directory:**
```bash
sudo mkdir -p /var/www/wedding-website
sudo cp -r * /var/www/wedding-website/
sudo chown -R www-data:www-data /var/www/wedding-website
```

2. **Install systemd service:**
```bash
sudo cp wedding-website.service /etc/systemd/system/
sudo systemctl daemon-reload
```

3. **Enable and start the service:**
```bash
sudo systemctl enable wedding-website
sudo systemctl start wedding-website
```

4. **Check service status:**
```bash
sudo systemctl status wedding-website
```

5. **View logs:**
```bash
sudo journalctl -u wedding-website -f
```

### Nginx Configuration (Optional)

Create `/etc/nginx/sites-available/wedding-website`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/wedding-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🛠 Development

### Build Commands
```bash
# Build CSS and JS
npm run build

# Build only CSS
gulp sass

# Watch for changes
npm run watch

# Run security audit
npm run security

# Clean build artifacts
npm run clean
```

### File Structure
```
wedding-website/
├── css/                    # Compiled CSS files (generated)
├── js/                     # JavaScript files
│   ├── scripts.js         # Main application logic
│   └── scripts.min.js     # Minified production version (generated)
├── sass/                   # SASS source files
│   ├── partials/          # SASS partials
│   └── styles.scss        # Main SASS file
├── img/                    # Images and assets
├── fonts/                  # Web fonts
├── index.html             # Main HTML file
├── gulpfile.js            # Build system configuration
├── security-audit.js      # Security scanning script
├── wedding-website.service # Systemd service file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 📱 Mobile Optimizations

- Enhanced viewport configuration for notched devices
- PWA capabilities with app-like experience
- Optimized touch targets and form inputs
- Improved performance with scroll-based backgrounds
- iOS-specific optimizations
- 16px input font size to prevent iOS zoom
- Reduced section padding for mobile screens

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
- FAQ content

### Images
Replace images in the `img/` directory:
- `hero-min.jpg` - Main banner background
- `four-seasons-vail.jpg` - Hotel section background
- Engagement photos in `img/eng_pics/`

### Google Maps API
1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps JavaScript API
3. Restrict the API key to your domain
4. Update the API key in `index.html`

## 📈 Enhancement History

### Major Enhancements (2024-2025)

#### **v2.0 - Complete Website Redesign**
- **Color Theme Overhaul**: Changed from yellow to cool blueish-green (#4a9b9b) accent color
- **Navigation Improvements**: Updated to complementary dark blue color with fixed scroll positioning
- **Content Restructuring**: 
  - Removed "How we met" section
  - Replaced Instagram section with Hotel Information (Four Seasons Vail)
  - Added Registry section with placeholder links
  - Added comprehensive FAQ section
  - Moved RSVP section to bottom of page

#### **Mobile & Performance Optimizations**
- **Enhanced Viewport**: Added `viewport-fit=cover` for notched devices
- **PWA Capabilities**: Mobile web app meta tags and optimizations
- **Touch Optimization**: Improved button sizes and touch targets
- **Performance**: Background attachment scroll for better mobile performance
- **iOS Specific**: Prevented zoom on input focus, status bar optimization

#### **Security & Build System**
- **Security Audit System**: Comprehensive security scanning script
- **Build Optimization**: Updated to modern dependencies (Gulp 5.0.1, Sass 1.93.2, jQuery 3.7.1)
- **Git Workflow**: Proper .gitignore with build artifact exclusion
- **Navigation Fix**: Added scroll-padding-top for proper anchor positioning

#### **Content & Localization**
- **Wedding Details**: Updated for Francois & Laurel, August 7-8 2026, Tavernetta Vail
- **Localization**: Changed event names to English alternatives
- **Contact Information**: Updated with generic US contact details
- **RSVP Improvements**: Enhanced wording and user experience

#### **Infrastructure & Deployment**
- **Dependency Updates**: Modern package versions for 2025
- **Systemd Integration**: Production-ready service configuration
- **Security Headers**: Content Security Policy and security best practices

## 📋 TODO

- [ ] Add actual registry links (Amazon, Target, Crate & Barrel)
- [ ] Configure Google Maps API key
- [ ] Set up RSVP form backend integration
- [ ] Add real hotel booking link
- [ ] Implement SSL/HTTPS configuration
- [ ] Add analytics tracking
- [ ] Optimize images with WebP format
- [ ] Add loading animations

## 🔒 Security

The website includes comprehensive security measures:
- Content Security Policy headers
- Input validation and sanitization
- No exposed API keys in repository
- Secure navigation anchor handling
- Security audit script with vulnerability scanning
- Build artifact exclusion from version control

## 🚀 Performance

- Minified CSS and JavaScript
- Optimized images and assets
- Mobile-first responsive design
- Lazy loading capabilities
- Efficient build system with Gulp
- PWA optimizations for app-like experience

## 📄 License

This project is licensed under the GPL-3.0 License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run security audit: `npm run security`
5. Test on multiple devices
6. Submit a pull request

---

**Built with ❤️ for Francois & Laurel's special day**
