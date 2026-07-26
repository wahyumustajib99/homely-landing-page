const properties = [
    {
        id: 1,
        title: "Modern Family Home",
        location: "San Diego, CA",
        type: "House",
        price: "$450,000",
        beds: 4,
        baths: 3,
        sqft: "2500 sq ft",
        tag: "FOR SALE",
        tagColor: "bg-emerald-500",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
        desc: "Spacious modern home featuring energy-efficient appliances, open-plan living room, and a beautifully landscaped private backyard."
    },
    {
        id: 2,
        title: "Luxury Villa",
        location: "Beverly Hills, CA",
        type: "Villa",
        price: "$1,250,000",
        beds: 5,
        baths: 6,
        sqft: "4200 sq ft",
        tag: "FEATURED",
        tagColor: "bg-primary",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
        desc: "Exclusive Beverly Hills residence complete with an infinity pool, smart home automation system, and panoramic city views."
    },
    {
        id: 3,
        title: "Comfortable Apartment",
        location: "San Francisco, CA",
        type: "Apartment",
        price: "$320,000",
        beds: 3,
        baths: 2,
        sqft: "1800 sq ft",
        tag: "FOR SALE",
        tagColor: "bg-emerald-500",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        desc: "Charming downtown apartment located within walking distance of public transport, cafes, and local shopping centers."
    }
];

let favorites = [];

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    const isHidden = menu.classList.contains('hidden');

    if (isHidden) {
        menu.classList.remove('hidden');
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.add('hidden');
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

// Counter Animation Function
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 60;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (count < target) {
                counter.innerText = Math.min(count + increment, target);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// Render Property Cards
function renderProperties(data) {
    const container = document.getElementById('property-grid');
    if (data.length === 0) {
        container.innerHTML = `<p class="col-span-3 text-center text-muted py-8 text-sm">Tidak ada properti yang cocok dengan kriteria pencarian.</p>`;
        return;
    }

    container.innerHTML = data.map(item => {
        const isFav = favorites.includes(item.id);
        return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div class="relative overflow-hidden">
                <img src="${item.image}" alt="${item.title}" class="w-full h-52 object-cover group-hover:scale-105 transition duration-500">
                <span class="${item.tagColor} text-white text-[10px] font-bold px-3 py-1 rounded-full absolute top-3 left-3 tracking-wider shadow">
                    ${item.tag}
                </span>
                <button onclick="toggleFavorite(${item.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-500 transition">
                    <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
                </button>
            </div>
            <div class="p-5">
                <h3 class="font-bold text-dark text-base mb-1 group-hover:text-primary transition">${item.title}</h3>
                <p class="text-xs text-muted mb-3 flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-primary"></i> ${item.location}
                </p>
                <p class="text-emerald-600 font-extrabold text-xl mb-4">${item.price}</p>
                
                <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 font-medium mb-4">
                    <span class="flex items-center gap-1"><i data-lucide="bed" class="w-4 h-4 text-gray-400"></i> ${item.beds} Bed</span>
                    <span class="flex items-center gap-1"><i data-lucide="bath" class="w-4 h-4 text-gray-400"></i> ${item.baths} Bath</span>
                    <span class="flex items-center gap-1"><i data-lucide="maximize" class="w-4 h-4 text-gray-400"></i> ${item.sqft}</span>
                </div>

                <button onclick="openModal(${item.id})" class="w-full py-2.5 bg-gray-50 hover:bg-primary hover:text-white text-dark text-xs font-bold rounded-xl transition">
                    View Detail
                </button>
            </div>
        </div>
    `}).join('');
    
    lucide.createIcons();
}

// Mortgage Calculation
function calculateMortgage() {
    const price = parseFloat(document.getElementById('calc-price').value) || 0;
    const down = parseFloat(document.getElementById('calc-down').value) || 0;
    const annualRate = parseFloat(document.getElementById('calc-rate').value) || 0;
    const years = parseInt(document.getElementById('calc-years').value) || 1;

    const principal = price - down;
    const monthlyRate = (annualRate / 100) / 12;
    const totalPayments = years * 12;

    if (principal <= 0 || monthlyRate <= 0) {
        document.getElementById('calc-result').innerHTML = `$0 <span class="text-xs text-muted font-normal">/ month</span>`;
        return;
    }

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    document.getElementById('calc-result').innerHTML = `$${Math.round(monthlyPayment).toLocaleString()} <span class="text-xs text-muted font-normal">/ month</span>`;
}

// Modal Controls
function openModal(id) {
    const item = properties.find(p => p.id === id);
    if (!item) return;

    const modal = document.getElementById('property-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-full h-56 sm:h-64 object-cover">
        <div class="p-6 space-y-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-lg sm:text-xl font-bold text-dark">${item.title}</h3>
                    <p class="text-xs text-muted">${item.location}</p>
                </div>
                <span class="text-emerald-600 font-extrabold text-xl sm:text-2xl">${item.price}</span>
            </div>
            <p class="text-xs text-muted leading-relaxed">${item.desc}</p>
            <button onclick="showToast('Agent has been notified!')" class="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-dark transition shadow-md">
                Contact Agent For Inquiries
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    lucide.createIcons();
}

function closeModal() {
    const modal = document.getElementById('property-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    answer.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.remove('translate-x-full', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}

function switchTab(type) {
    const tabBuy = document.getElementById('tab-buy');
    const tabRent = document.getElementById('tab-rent');
    if (type === 'buy') {
        tabBuy.className = 'active-tab pb-1 transition';
        tabRent.className = 'text-gray-400 hover:text-gray-600 pb-1 transition';
    } else {
        tabRent.className = 'active-tab pb-1 transition';
        tabBuy.className = 'text-gray-400 hover:text-gray-600 pb-1 transition';
    }
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        showToast('Dihapus dari favorit');
    } else {
        favorites.push(id);
        showToast('Ditambahkan ke favorit');
    }
    renderProperties(properties);
}

function handleSearch(event) {
    event.preventDefault();
    const location = document.getElementById('filter-location').value;
    const type = document.getElementById('filter-type').value;

    const filtered = properties.filter(item => {
        const matchLocation = location === 'all' || item.location.includes(location);
        const matchType = type === 'all' || item.type === type;
        return matchLocation && matchType;
    });

    renderProperties(filtered);
}

function handleSubscribe(e) {
    e.preventDefault();
    showToast('Terima kasih telah berlangganan!');
    e.target.reset();
}

// Observer for Counter Animation
let animated = false;
const statsSection = document.getElementById('stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true;
            }
        });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
}

document.addEventListener("DOMContentLoaded", () => {
    renderProperties(properties);
    calculateMortgage();
});

// --- Logic Testimonial Auto-Slide Carousel ---
let currentTestimonial = 0;
const totalTestimonials = 5;
let testimonialInterval;

function updateTestimonialSlider() {
    const track = document.getElementById('testimonial-track');
    if (!track) return;
    
    // Geser track secara horisontal
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    // Update warna titik indikator (dots)
    const dotsContainer = document.getElementById('testimonial-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = Array.from({ length: totalTestimonials }).map((_, i) => `
            <button onclick="goToTestimonial(${i})" class="w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'bg-primary w-6' : 'bg-gray-300'}"></button>
        `).join('');
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialSlider();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialSlider();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialSlider();
}

function startTestimonialAutoSlide() {
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 4000); // Geser otomatis setiap 4 detik
}

function stopTestimonialAutoSlide() {
    clearInterval(testimonialInterval);
}

// Inisialisasi saat Halaman Selesai di-load
document.addEventListener("DOMContentLoaded", () => {
    updateTestimonialSlider();
    startTestimonialAutoSlide();
});
    