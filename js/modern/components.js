/**
 * Web Components for Wedding Website
 * 
 * Reusable, encapsulated UI components using modern Web Components API
 */

// Wedding Countdown Component
class WeddingCountdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.weddingDate = new Date('2026-08-07T16:00:00');
    }

    connectedCallback() {
        this.render();
        this.startCountdown();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: var(--font-family-primary, serif);
                }
                
                .countdown {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    text-align: center;
                }
                
                .time-unit {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1.5rem 1rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                
                .number {
                    display: block;
                    font-size: 2.5rem;
                    font-weight: bold;
                    line-height: 1;
                }
                
                .label {
                    display: block;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-top: 0.5rem;
                    opacity: 0.9;
                }
                
                @media (max-width: 768px) {
                    .countdown {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .number {
                        font-size: 2rem;
                    }
                }
            </style>
            
            <div class="countdown">
                <div class="time-unit">
                    <span class="number" id="days">0</span>
                    <span class="label">Days</span>
                </div>
                <div class="time-unit">
                    <span class="number" id="hours">0</span>
                    <span class="label">Hours</span>
                </div>
                <div class="time-unit">
                    <span class="number" id="minutes">0</span>
                    <span class="label">Minutes</span>
                </div>
                <div class="time-unit">
                    <span class="number" id="seconds">0</span>
                    <span class="label">Seconds</span>
                </div>
            </div>
        `;
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.weddingDate.getTime() - now;

            if (distance < 0) {
                this.shadowRoot.innerHTML = '<p>The wedding has begun! 🎉</p>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            this.shadowRoot.getElementById('days').textContent = days;
            this.shadowRoot.getElementById('hours').textContent = hours;
            this.shadowRoot.getElementById('minutes').textContent = minutes;
            this.shadowRoot.getElementById('seconds').textContent = seconds;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Photo Gallery Component
class PhotoGallery extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupLightbox();
    }

    render() {
        const photos = JSON.parse(this.getAttribute('photos') || '[]');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
                
                .photo {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .photo:hover {
                    transform: scale(1.05);
                }
                
                .photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .lightbox.active {
                    display: flex;
                }
                
                .lightbox img {
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                }
                
                .close {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                }
            </style>
            
            <div class="gallery">
                ${photos.map((photo, index) => `
                    <div class="photo" data-index="${index}">
                        <img src="${photo.thumbnail}" alt="${photo.alt}" loading="lazy">
                    </div>
                `).join('')}
            </div>
            
            <div class="lightbox">
                <span class="close">&times;</span>
                <img id="lightbox-img" src="" alt="">
            </div>
        `;
    }

    setupLightbox() {
        const photos = JSON.parse(this.getAttribute('photos') || '[]');
        const lightbox = this.shadowRoot.querySelector('.lightbox');
        const lightboxImg = this.shadowRoot.getElementById('lightbox-img');
        const close = this.shadowRoot.querySelector('.close');

        this.shadowRoot.querySelectorAll('.photo').forEach(photo => {
            photo.addEventListener('click', () => {
                const index = parseInt(photo.dataset.index);
                lightboxImg.src = photos[index].full;
                lightboxImg.alt = photos[index].alt;
                lightbox.classList.add('active');
            });
        });

        close.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
}

// RSVP Form Component
class RSVPForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupForm();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .form {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333;
                }
                
                input, select, textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e1e5e9;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }
                
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    width: 100%;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .message {
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-top: 1rem;
                    text-align: center;
                }
                
                .message.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .message.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
            </style>
            
            <form class="form">
                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="attendance">Will you be attending? *</label>
                    <select id="attendance" name="attendance" required>
                        <option value="">Please select</option>
                        <option value="yes">Yes, I'll be there!</option>
                        <option value="no">Sorry, can't make it</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="guests">Number of guests (including yourself)</label>
                    <select id="guests" name="guests">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="dietary">Dietary restrictions or special requests</label>
                    <textarea id="dietary" name="dietary" rows="3" placeholder="Please let us know about any allergies or dietary preferences..."></textarea>
                </div>
                
                <button type="submit" class="btn">Send RSVP</button>
            </form>
        `;
    }

    setupForm() {
        const form = this.shadowRoot.querySelector('.form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                this.setLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.showMessage('Thank you! Your RSVP has been received.', 'success');
                form.reset();
            } catch (error) {
                this.showMessage('Sorry, there was an error sending your RSVP. Please try again.', 'error');
            } finally {
                this.setLoading(false);
            }
        });
    }

    setLoading(loading) {
        const btn = this.shadowRoot.querySelector('.btn');
        btn.disabled = loading;
        btn.textContent = loading ? 'Sending...' : 'Send RSVP';
    }

    showMessage(text, type) {
        const existingMessage = this.shadowRoot.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        this.shadowRoot.querySelector('.form').appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
}

// Register components
customElements.define('wedding-countdown', WeddingCountdown);
customElements.define('photo-gallery', PhotoGallery);
customElements.define('rsvp-form', RSVPForm);
