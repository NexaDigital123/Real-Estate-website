// ===== LUXURY REAL ESTATE WEBSITE - MASTER JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function () {

    // ---------- 1. MOBILE NAVIGATION TOGGLE ----------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('show');
            this.innerHTML = navMenu.classList.contains('show') ? '✕' : '☰';
        });
    }

    // ---------- 2. STICKY NAVIGATION (add shadow on scroll) ----------
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });

    // ---------- 3. ACTIVE LINK HIGHLIGHTING ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });

    // ---------- 4. SMOOTH SCROLLING FOR ANCHOR LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== "#") {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ---------- 5. PROPERTY SEARCH FORM (listings page) ----------
    const searchForm = document.querySelector('.property-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Search functionality would connect to property database. This is a demo.');
            // In a real app, you might redirect to listings page with query params
            // window.location.href = 'listings.html?' + new URLSearchParams(new FormData(this)).toString();
        });
    }

    // ---------- 6. FILTER BUTTON (listings page sidebar) ----------
    const applyFilters = document.querySelector('.apply-filters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function () {
            alert('Filtering properties... (This is a demo. In a real app, filters would update the listings.)');
        });
    }

    // ---------- 7. MORTGAGE CALCULATOR (property details page) ----------
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function () {
            const loanAmount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
            const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 0;
            const loanTerm = parseFloat(document.getElementById('loanTerm')?.value) || 0;
            const downPayment = parseFloat(document.getElementById('downPayment')?.value) || 0;

            const principal = loanAmount - downPayment;
            const resultDiv = document.getElementById('calcResult');

            if (principal <= 0 || interestRate <= 0 || loanTerm <= 0) {
                resultDiv.innerHTML = 'Please enter valid positive numbers.';
                return;
            }

            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

            if (isFinite(monthlyPayment)) {
                resultDiv.innerHTML = `Monthly Payment: <span>$${monthlyPayment.toFixed(2)}</span>`;
            } else {
                resultDiv.innerHTML = 'Calculation error. Please check your inputs.';
            }
        });
    }

    // ---------- 8. CONTACT FORM VALIDATION (contact page) ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName')?.value.trim();
            const lastName = document.getElementById('lastName')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            const status = document.getElementById('formStatus');

            if (!firstName || !lastName || !email || !message) {
                status.style.color = '#d9534f';
                status.textContent = 'Please fill in all required fields.';
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                status.style.color = '#d9534f';
                status.textContent = 'Please enter a valid email address.';
                return;
            }

            // Simulate successful submission
            status.style.color = '#5cb85c';
            status.textContent = 'Thank you! Your message has been sent. We will respond shortly.';
            contactForm.reset();
        });
    }

    // ---------- 9. PROPERTY IMAGE GALLERY (property details page) ----------
    // Allows clicking thumbnail images to change the main image
    const galleryThumbs = document.querySelectorAll('.gallery img:not(.main-image img)');
    const mainImage = document.getElementById('mainImage');
    if (galleryThumbs.length > 0 && mainImage) {
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', function () {
                mainImage.src = this.src;
            });
        });
    }

    // ---------- 10. NEWSLETTER FORM (homepage) ----------
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                alert(`Thank you for subscribing with: ${emailInput.value}`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // ---------- 11. LAZY LOADING IMAGES (performance) ----------
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

}); // end DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:5000/api/properties');
        const properties = await response.json();
        
        const grid = document.querySelector('.listings-grid');
        grid.innerHTML = ''; // clear static examples
        
        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="property-image">
                    <img src="${prop.images[0] || 'images/default.jpg'}" alt="${prop.title}">
                    <span class="property-tag">${prop.status}</span>
                </div>
                <div class="property-details">
                    <h3>$${prop.price.toLocaleString()}</h3>
                    <p class="property-address"><i class="fas fa-map-marker-alt"></i> ${prop.address}</p>
                    <div class="property-specs">
                        <span><i class="fas fa-bed"></i> ${prop.bedrooms} Beds</span>
                        <span><i class="fas fa-bath"></i> ${prop.bathrooms} Baths</span>
                        <span><i class="fas fa-vector-square"></i> ${prop.sqft.toLocaleString()} sqft</span>
                    </div>
                    <a href="property-details.html?id=${prop._id}" class="btn-outline">View Details</a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading properties:', error);
    }
});









document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. PAGE ENTRANCE TRANSITION ---
    // Fades in the hero content and slides it up slightly
    gsap.from(".hero-content", {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5
    });

    // --- 2. PROPERTY CARD STAGGER (JS Animation) ---
    // Instead of all cards appearing at once, they pop in one by one
    const animateCards = () => {
        gsap.from(".property-card", {
            scrollTrigger: {
                trigger: ".listings-grid",
                start: "top 80%", // Starts when the grid is 80% from top of viewport
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2, // 0.2s delay between each card
            ease: "power2.out"
        });
    };

    // --- 3. MICRO-INTERACTIONS (Button Hover) ---
    const buttons = document.querySelectorAll('.btn, .btn-outline');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "back.out(2)" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.inOut" });
        });
    });

    // --- 4. SVG ANIMATION (Example: Loading or Icon) ---
    // If you have an SVG logo with a class 'logo-svg'
    gsap.to(".logo h2:after", {
        color: "#fff",
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut"
    });

    // --- 5. LOTTIE INTEGRATION ---
    // Place a <div id="lottie-container"></div> where you want an animation
    const lottieContainer = document.getElementById('lottie-container');
    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer, 
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'path/to/your/animation.json' // Path to your luxury Lottie file
        });
    }

    // Wrap your existing fetch function to trigger the animation after cards load
    const originalFetch = fetchProperties;
    fetchProperties = async (container) => {
        await originalFetch(container);
        animateCards(); // Trigger GSAP stagger after properties are added to DOM
    };
});