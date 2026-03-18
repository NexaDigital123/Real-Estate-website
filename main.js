// ============================================================
//  Luxury Estates — main.js
//  Works standalone (static) OR with server.js backend
// ============================================================

const API = 'http://localhost:3000/api';

/* ── Static fallback data (used when server isn't running) ── */
const STATIC_PROPERTIES = [
    { id: 1, title: 'Oceanfront Cliff Villa', address: '123 Ocean Drive, Malibu, CA', price: 2450000, beds: 4, baths: 3, sqft: 3200, status: 'For Sale', type: 'Villa', image: 'villa-exterior.png' },
    { id: 2, title: 'Manhattan Luxury Penthouse', address: '500 Fifth Avenue, New York, NY', price: 3850000, beds: 3, baths: 3.5, sqft: 2800, status: 'For Sale', type: 'Penthouse', image: 'property2.jpg' },
    { id: 3, title: 'Waterfront Modern Estate', address: '45 Lake Shore Drive, Miami, FL', price: 5200000, beds: 5, baths: 4.5, sqft: 4500, status: 'For Sale', type: 'Estate', image: 'property3.jpg' },
    { id: 4, title: 'Historic Back Bay Mansion', address: '77 Commonwealth Ave, Boston, MA', price: 4500000, beds: 6, baths: 5, sqft: 5800, status: 'For Sale', type: 'Mansion', image: 'property4.jpg' },
    { id: 5, title: 'Mountain Cliff Retreat', address: '789 Summit Ridge, Aspen, CO', price: 1850000, beds: 4, baths: 3, sqft: 2900, status: 'For Sale', type: 'Retreat', image: 'property5.jpg' },
    { id: 6, title: 'Sunset Oceanfront Villa', address: '321 Beachfront Ave, Malibu, CA', price: 6800000, beds: 5, baths: 5, sqft: 5200, status: 'For Sale', type: 'Villa', image: 'property6.jpg' }
];

/* ── Helper: fetch with static fallback ─────────────────────── */
async function apiFetch(endpoint, opts = {}) {
    try {
        const res = await fetch(API + endpoint, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch {
        return null;   // caller handles null = fallback
    }
}

/* ── Toast notification ─────────────────────────────────────── */
function showToast(msg, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Build property card HTML ───────────────────────────────── */
function buildCard(p, detailPath = 'property-details.html') {
    const price = '$' + Number(p.price).toLocaleString();
    const baths = Number(p.baths) % 1 !== 0 ? p.baths : p.baths;
    return `
  <div class="property-card reveal" data-id="${p.id}">
    <div class="property-image">
      <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='Card-1.jpg'">
      <span class="property-tag">${p.status || 'For Sale'}</span>
      <button class="property-wishlist" aria-label="Save property" onclick="toggleWishlist(this, ${p.id})">
        <i class="far fa-heart"></i>
      </button>
    </div>
    <div class="property-details">
      <h3>${price}</h3>
      <p class="property-address"><i class="fas fa-map-marker-alt"></i> ${p.address}</p>
      <div class="property-specs">
        <span><i class="fas fa-bed"></i> ${p.beds} Beds</span>
        <span><i class="fas fa-bath"></i> ${baths} Baths</span>
        <span><i class="fas fa-vector-square"></i> ${Number(p.sqft).toLocaleString()} sqft</span>
      </div>
      <a href="${detailPath}?id=${p.id}" class="btn-outline">View Details</a>
    </div>
  </div>`;
}

/* ── Build skeleton loaders ─────────────────────────────────── */
function buildSkeletons(count = 6) {
    return Array(count).fill(0).map(() => `
  <div class="skeleton">
    <div class="skeleton-img"></div>
    <div class="skeleton-body">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
    </div>
  </div>`).join('');
}

/* ── Wishlist ───────────────────────────────────────────────── */
function toggleWishlist(btn, id) {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const i = list.indexOf(id);
    if (i === -1) { list.push(id); btn.classList.add('active'); btn.innerHTML = '<i class="fas fa-heart"></i>'; showToast('Saved to wishlist'); }
    else { list.splice(i, 1); btn.classList.remove('active'); btn.innerHTML = '<i class="far fa-heart"></i>'; showToast('Removed from wishlist', 'error'); }
    localStorage.setItem('wishlist', JSON.stringify(list));
}

// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ── Page Loader ────────────────────────────────────────── //
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hide'), 1400);
        });
    }

    // ── Progress bar ───────────────────────────────────────── //
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
            progressBar.style.width = pct + '%';
        }, { passive: true });
    }

    // ── Sticky nav + back-to-top ───────────────────────────── //
    const nav = document.querySelector('nav');
    const backTop = document.getElementById('back-top');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
        if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Mobile nav toggle ──────────────────────────────────── //
    const toggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('show');
            toggle.innerHTML = open ? '✕' : '☰';
            toggle.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', e => {
            if (!nav.contains(e.target) && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                toggle.innerHTML = '☰';
            }
        });
    }

    // ── Active nav link ────────────────────────────────────── //
    const page = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-menu a').forEach(a => {
        if (a.getAttribute('href') === page) a.classList.add('active');
    });

    // ── Smooth scroll ──────────────────────────────────────── //
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = (nav ? nav.offsetHeight : 70) + 8;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    });

    // ── Scroll Reveal (IntersectionObserver) ──────────────── //
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function observeReveal() {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObs.observe(el));
    }
    observeReveal();

    // ── Counter animation ──────────────────────────────────── //
    function countUp(el, target, duration = 2000) {
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const suf = el.dataset.suffix || '';
            const pre = el.dataset.prefix || '';
            const val = Math.round(ease * target);
            el.textContent = pre + (target >= 1000 ? (val / 1000).toFixed(1) + 'K' : val) + suf;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            en.target.querySelectorAll('[data-count]').forEach(el => {
                countUp(el, Number(el.dataset.count));
            });
            counterObs.unobserve(en.target);
        });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stats, .about-stats, .hero-stats-strip').forEach(el => counterObs.observe(el));

    // ── GSAP Animations ────────────────────────────────────── //
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Stagger property cards on scroll
        gsap.utils.toArray('.property-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                y: 40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out'
            });
        });

        // Steps entrance
        gsap.utils.toArray('.step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: { trigger: step, start: 'top 85%', once: true },
                y: 30, opacity: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out'
            });
        });

        // Section headings
        gsap.utils.toArray('.section-title h2').forEach(h => {
            gsap.from(h, {
                scrollTrigger: { trigger: h, start: 'top 88%', once: true },
                y: 20, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        });

        // Button hover micro-interaction
        document.querySelectorAll('.btn, .btn-outline').forEach(btn => {
            btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'back.out(2)' }));
            btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2 }));
        });
    }

    // ── Testimonials Slider ────────────────────────────────── //
    const trackEl = document.getElementById('testi-track');
    const dotsEl = document.getElementById('testi-dots');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');

    if (trackEl) {
        const slides = trackEl.querySelectorAll('.testimonial');
        let cur = 0, timer;

        if (dotsEl) {
            slides.forEach((_, i) => {
                const d = document.createElement('div');
                d.className = 'sdot' + (i === 0 ? ' on' : '');
                d.onclick = () => goSlide(i);
                dotsEl.appendChild(d);
            });
        }

        function getW() { return slides[0].offsetWidth + 24; }
        function goSlide(n) {
            cur = ((n % slides.length) + slides.length) % slides.length;
            trackEl.style.transform = `translateX(-${cur * getW()}px)`;
            if (dotsEl) dotsEl.querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('on', i === cur));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { goSlide(cur - 1); resetTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goSlide(cur + 1); resetTimer(); });

        let tsX = 0;
        trackEl.addEventListener('touchstart', e => tsX = e.touches[0].clientX, { passive: true });
        trackEl.addEventListener('touchend', e => { if (Math.abs(tsX - e.changedTouches[0].clientX) > 50) goSlide(tsX > e.changedTouches[0].clientX ? cur + 1 : cur - 1); }, { passive: true });
        window.addEventListener('resize', () => goSlide(cur), { passive: true });
        function resetTimer() { clearInterval(timer); timer = setInterval(() => goSlide(cur + 1), 5500); }
        resetTimer();
    }

    // ── Newsletter form ────────────────────────────────────── //
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterMsg = document.getElementById('newsletter-msg');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            if (!email) return;
            const btn = this.querySelector('.btn');
            btn.textContent = 'Subscribing…'; btn.disabled = true;

            const res = await apiFetch('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
            btn.textContent = 'Subscribe'; btn.disabled = false;

            const msg = res ? res.message : 'Subscribed! We\'ll keep you updated.';
            if (newsletterMsg) { newsletterMsg.textContent = msg; }
            else showToast(msg);
            this.reset();
        });
    }

    // ── Contact form ───────────────────────────────────────── //
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const data = {
                firstName: document.getElementById('firstName')?.value.trim(),
                lastName: document.getElementById('lastName')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                phone: document.getElementById('phone')?.value.trim(),
                inquiryType: document.getElementById('inquiryType')?.value,
                message: document.getElementById('message')?.value.trim()
            };

            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                if (formStatus) { formStatus.style.color = '#e74c3c'; formStatus.textContent = '⚠ Please fill in all required fields.'; } return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                if (formStatus) { formStatus.style.color = '#e74c3c'; formStatus.textContent = '⚠ Please enter a valid email address.'; } return;
            }

            const btn = contactForm.querySelector('.btn');
            btn.textContent = 'Sending…'; btn.disabled = true;

            const res = await apiFetch('/contact', { method: 'POST', body: JSON.stringify(data) });
            btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>'; btn.disabled = false;

            const msg = res ? res.message : `Thank you ${data.firstName}! We'll respond within 24 hours.`;
            if (formStatus) { formStatus.style.color = '#27ae60'; formStatus.textContent = '✓ ' + msg; }
            showToast(msg);
            contactForm.reset();
        });
    }

    // ── Mortgage Calculator ────────────────────────────────── //
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calcMortgage);
        ['loanAmount', 'interestRate', 'loanTerm', 'downPayment'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calcMortgage);
        });
    }
    function calcMortgage() {
        const loan = parseFloat(document.getElementById('loanAmount')?.value) || 0;
        const rate = parseFloat(document.getElementById('interestRate')?.value) || 0;
        const term = parseFloat(document.getElementById('loanTerm')?.value) || 0;
        const down = parseFloat(document.getElementById('downPayment')?.value) || 0;
        const result = document.getElementById('calcResult');
        if (!result) return;
        const principal = loan - down;
        if (principal <= 0 || rate <= 0 || term <= 0) { result.innerHTML = 'Enter valid values above.'; return; }
        const mr = rate / 100 / 12;
        const np = term * 12;
        const mp = principal * mr * Math.pow(1 + mr, np) / (Math.pow(1 + mr, np) - 1);
        if (isFinite(mp)) result.innerHTML = `Monthly Payment: <span>$${mp.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>`;
    }

    // ── Gallery thumbnails (property details) ─────────────── //
    const mainImg = document.getElementById('mainImage');
    const thumbImgs = document.querySelectorAll('.pd-gallery .thumb-img img');
    if (mainImg && thumbImgs.length) {
        thumbImgs.forEach(t => {
            t.addEventListener('click', function () {
                if (typeof gsap !== 'undefined') {
                    gsap.to(mainImg, {
                        opacity: 0, duration: .2, onComplete: () => {
                            mainImg.src = this.src;
                            gsap.to(mainImg, { opacity: 1, duration: .3 });
                        }
                    });
                } else { mainImg.src = this.src; }
                document.querySelectorAll('.pd-gallery .thumb-img').forEach(el => el.classList.remove('active'));
                this.closest('.thumb-img').classList.add('active');
            });
        });
    }

    // ── Cookie Banner ──────────────────────────────────────── //
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    if (cookieBanner && !localStorage.getItem('cookie-consent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2500);
    }
    if (cookieAccept) cookieAccept.addEventListener('click', () => { localStorage.setItem('cookie-consent', 'accepted'); cookieBanner.classList.remove('show'); });
    if (cookieDecline) cookieDecline.addEventListener('click', () => { localStorage.setItem('cookie-consent', 'declined'); cookieBanner.classList.remove('show'); });

    // ── Load Featured Properties (homepage) ───────────────── //
    const featuredGrid = document.querySelector('.properties-grid');
    if (featuredGrid) {
        (async () => {
            featuredGrid.innerHTML = buildSkeletons(3);
            const data = await apiFetch('/properties');
            const props = data ? data.data.slice(0, 3) : STATIC_PROPERTIES.slice(0, 3);
            featuredGrid.innerHTML = props.map(p => buildCard(p)).join('');
            observeReveal();
        })();
    }

    // ── Load All Listings ──────────────────────────────────── //
    const listingsGrid = document.querySelector('.listings-grid');
    const listingsH = document.querySelector('.listings-header h2');
    if (listingsGrid) {
        let allProps = [];

        async function loadListings(params = {}) {
            listingsGrid.innerHTML = buildSkeletons(6);
            const qs = new URLSearchParams(params).toString();
            const data = await apiFetch('/properties' + (qs ? '?' + qs : ''));
            allProps = data ? data.data : STATIC_PROPERTIES;

            if (listingsH) listingsH.innerHTML = `<span>${allProps.length}</span> Properties Found`;
            listingsGrid.innerHTML = allProps.length
                ? allProps.map(p => buildCard(p)).join('')
                : '<div id="no-results" style="display:block;grid-column:1/-1;text-align:center;padding:4rem;color:#999"><i class="fas fa-home" style="font-size:3rem;color:#ddd;display:block;margin-bottom:1rem"></i>No properties match your filters.</div>';
            observeReveal();
        }

        loadListings();

        // Filter apply
        const applyBtn = document.querySelector('.apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const params = {};
                const loc = document.querySelector('.filters input[type="text"]')?.value.trim();
                const type = document.querySelector('.filter-group select')?.value;
                const minP = document.querySelector('.price-range input:first-child')?.value;
                const maxP = document.querySelector('.price-range input:last-child')?.value;
                const beds = document.querySelectorAll('.filter-group select')[3]?.value;
                if (loc && loc !== '') params.search = loc;
                if (type && type !== 'Any') params.type = type;
                if (minP) params.minPrice = minP;
                if (maxP) params.maxPrice = maxP;
                if (beds && beds !== 'Any') params.beds = beds.replace('+', '');
                loadListings(params);
            });
        }

        // Sort
        const sortSel = document.querySelector('.listings-header select');
        if (sortSel) {
            sortSel.addEventListener('change', function () {
                const map = { 'Price: Low to High': 'price-asc', 'Price: High to Low': 'price-desc', 'Newest': 'newest' };
                loadListings({ sort: map[this.value] || '' });
            });
        }

        // Search form
        const searchForm = document.querySelector('.property-search');
        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const q = this.querySelector('input[type="text"]')?.value.trim();
                if (q) loadListings({ search: q });
            });
        }
    }

    // ── Load Property Details ──────────────────────────────── //
    const pdPage = document.querySelector('.property-details-page');
    if (pdPage) {
        const id = new URLSearchParams(window.location.search).get('id') || '1';
        loadPropertyDetails(id);
    }

    async function loadPropertyDetails(id) {
        const data = await apiFetch('/properties/' + id);
        const p = data ? data.data : { ...STATIC_PROPERTIES.find(x => x.id === Number(id)) || STATIC_PROPERTIES[0], agent: { name: 'John Smith', title: 'Senior Luxury Agent', phone: '(310) 555-0199', email: 'john@luxuryestates.com', photo: 'wmremove-transformed.jpeg' } };

        const pdGallery = document.getElementById('pd-gallery');
        const pdTitle = document.getElementById('pd-title');
        const pdPrice = document.getElementById('pd-price');
        const pdMeta = document.getElementById('pd-meta');
        const pdDesc = document.getElementById('pd-desc');
        const pdFeatures = document.getElementById('pd-features');
        const agentPhoto = document.getElementById('agent-photo');
        const agentName = document.getElementById('agent-name');
        const agentTitle = document.getElementById('agent-title');
        const agentPhone = document.getElementById('agent-phone');
        const agentEmail = document.getElementById('agent-email');
        const mainImage = document.getElementById('mainImage');
        const loanAmount = document.getElementById('loanAmount');

        if (pdTitle) pdTitle.textContent = p.title || p.address;
        if (pdPrice) pdPrice.textContent = '$' + Number(p.price).toLocaleString();
        if (mainImage) mainImage.src = p.image || p.images?.[0] || 'villa-exterior.png';
        if (loanAmount) loanAmount.value = Math.round(p.price * 0.8);

        if (pdMeta) pdMeta.innerHTML = `
      <span><i class="fas fa-bed"></i> ${p.beds} Beds</span>
      <span><i class="fas fa-bath"></i> ${p.baths} Baths</span>
      <span><i class="fas fa-vector-square"></i> ${Number(p.sqft).toLocaleString()} sqft</span>
      <span><i class="fas fa-calendar"></i> Built: ${p.built || '2020'}</span>
      <span><i class="fas fa-tag"></i> ${p.status || 'For Sale'}</span>`;

        if (pdDesc && p.description) pdDesc.innerHTML = `<p>${p.description}</p>`;

        if (pdFeatures && p.features) {
            pdFeatures.innerHTML = p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
        }

        const agent = p.agent || {};
        if (agentPhoto) agentPhoto.src = agent.photo || 'wmremove-transformed.jpeg';
        if (agentName) agentName.textContent = agent.name || 'John Smith';
        if (agentTitle) agentTitle.textContent = agent.title || 'Luxury Agent';
        if (agentPhone) agentPhone.innerHTML = `<i class="fas fa-phone"></i> ${agent.phone || '(310) 555-0199'}`;
        if (agentEmail) agentEmail.innerHTML = `<i class="fas fa-envelope"></i> ${agent.email || 'agent@luxuryestates.com'}`;

        if (loanAmount) calcMortgage();

        // Update thumbnails
        if (p.images) {
            document.querySelectorAll('.pd-gallery .thumb-img img').forEach((img, i) => {
                if (p.images[i + 1]) img.src = p.images[i + 1];
            });
        }

        // Update page title
        document.title = `${p.title || p.address} | Luxury Estates`;
    }

}); // end DOMContentLoaded
