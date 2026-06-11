const slider = document.getElementById('store-slider');
let isDown = false;
let startX;
let scrollLeft;

let isAutoScrolling = true;
let scrollDirection = 1;
const scrollSpeed = 0.5;

function autoScroll() {
    if (isAutoScrolling && !isDown) {
        slider.scrollLeft += (scrollDirection * scrollSpeed);

        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1) {
            scrollDirection = -1;
        }
        else if (slider.scrollLeft <= 0) {
            scrollDirection = 1;
        }
    }
    requestAnimationFrame(autoScroll);
}

autoScroll();

// Pause on Hover/Touch
slider.addEventListener('mouseenter', () => isAutoScrolling = false);
slider.addEventListener('mouseleave', () => {
    isDown = false;
    if (document.getElementById('modal-container').classList.contains('hidden')) {
        isAutoScrolling = true;
    }
});

slider.addEventListener('touchstart', () => isAutoScrolling = false);
slider.addEventListener('touchend', () => {
    if (document.getElementById('modal-container').classList.contains('hidden')) {
        isAutoScrolling = true;
    }
});

// Drag to scroll
slider.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    isDown = true;
    isAutoScrolling = false;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    if (document.getElementById('modal-container').classList.contains('hidden')) {
        isAutoScrolling = true;
    }
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
});

// --- MODAL LOGIC ---
const modalContainer = document.getElementById('modal-container');

window.openModal = function (modalId) {
    isAutoScrolling = false;
    document.querySelectorAll('.modal-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('scale-100', 'opacity-100');
        el.classList.add('scale-95');
    });

    modalContainer.classList.remove('hidden');

    setTimeout(() => {
        modalContainer.classList.remove('opacity-0');
        modalContainer.classList.add('opacity-100');

        const targetModal = document.getElementById(modalId);
        targetModal.classList.remove('hidden');
        setTimeout(() => {
            targetModal.classList.remove('scale-95');
            targetModal.classList.add('scale-100', 'opacity-100');
        }, 10);
    }, 10);
}

window.closeModal = function () {
    modalContainer.classList.remove('opacity-100');
    modalContainer.classList.add('opacity-0');

    document.querySelectorAll('.modal-content').forEach(el => {
        el.classList.remove('scale-100');
        el.classList.add('scale-95');
    });

    setTimeout(() => {
        modalContainer.classList.add('hidden');
        document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
        isAutoScrolling = true;
    }, 300);
}

// Close primary modal when clicking background
modalContainer.addEventListener('click', function (e) {
    if (e.target === this && document.getElementById('image-zoom-modal').classList.contains('hidden')) {
        closeModal();
    }
});

// --- IMAGE ZOOM LOGIC ---
const imageZoomModal = document.getElementById('image-zoom-modal');
const zoomedImage = document.getElementById('zoomed-image');

window.openImageZoom = function (imgSrc) {
    zoomedImage.src = imgSrc;
    imageZoomModal.classList.remove('hidden');

    setTimeout(() => {
        imageZoomModal.classList.remove('opacity-0');
        imageZoomModal.classList.add('opacity-100');
        zoomedImage.classList.remove('scale-95');
        zoomedImage.classList.add('scale-100');
    }, 10);
}

window.closeImageZoom = function () {
    imageZoomModal.classList.remove('opacity-100');
    imageZoomModal.classList.add('opacity-0');
    zoomedImage.classList.remove('scale-100');
    zoomedImage.classList.add('scale-95');

    setTimeout(() => {
        imageZoomModal.classList.add('hidden');
        zoomedImage.src = '';
    }, 300);
}

// Close on Escape Key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        if (!imageZoomModal.classList.contains('hidden')) {
            closeImageZoom();
        } else if (!modalContainer.classList.contains('hidden')) {
            closeModal();
        }
    }
});

// --- WHATSAPP FORM SUBMISSION LOGIC ---
document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('trialForm');

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            // Stop the standard browser form submission loop immediately
            event.preventDefault();

            // 1. Get input fields
            const name = document.getElementById('parentName').value;
            const email = document.getElementById('parentEmail').value;
            const phone = document.getElementById('parentPhone').value;
            const grade = document.getElementById('childGrade').value;
            const course = document.getElementById('selectedCourse').value;

            // 2. Set business line destination
            const whatsappNumber = "918826821126";

            // 3. Format message layout
            const message = `🤖 *New Trial Class Booking* 🤖\n\n` +
                `👤 *Parent's Name:* ${name}\n` +
                `📧 *Email:* ${email}\n` +
                `📞 *Phone Number:* ${phone}\n` +
                `🎓 *Child's Grade:* ${grade}\n` +
                `💻 *Selected Course:* ${course}`;

            // 4. Safely package data structure for URLs
            const encodedMessage = encodeURIComponent(message);

            // 5. Detect if the user device is iOS (iPhone/iPad)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            if (isIOS) {
                // iOS friendly deep-link protocol that native apps intercept immediately
                const iosWhatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;

                // Changing the window location directly bypasses Safari's pop-up blocker
                window.location.href = iosWhatsappUrl;

                // Fallback redirect to the web portal if they do not have the native application installed
                setTimeout(() => {
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                }, 500);
            } else {
                // Desktop and Android handle standard web links in a fresh tab beautifully
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }
});

// --- WHATSAPP STORE KIT PURCHASE LOGIC ---
window.orderKitOnWhatsApp = function (kitName) {
    // 1. Define destination contact parameters
    const whatsappNumber = "918826821126";

    // 2. Format a structured, professional order message layout
    const message = `🛒 *New Store Order Inquiry* 🛒\n\n` +
        `📦 *Product:* ${kitName}\n` +
        `💬 Hi NewGen Robotics! I am interested in purchasing this kit. Please share the availability, payment options, and delivery timelines with me.`;

    // 3. Package data safely for browser standard formats
    const encodedMessage = encodeURIComponent(message);

    // 4. Check device parameters to bypass mobile browser blockades (matching your form logic)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
        // Deep-link protocol to force execution within native application boundaries
        const iosWhatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
        window.location.href = iosWhatsappUrl;

        // Fallback boundary safety in case client app application is unavailable
        setTimeout(() => {
            window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        }, 500);
    } else {
        // Safe, sandboxed multi-tab execution for desktop environments and Android setups
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
}


// --- FULLY CUSTOMIZABLE FESTIVAL BANNER MANAGER ---
const festivalConfig = {
    showBanner: true, // Set to 'false' to instantly hide the banner

    // 1. Text & Content Configuration
    text: "",
    ctaText: "Claim your free demo",
    ctaLink: "#booking",
    emojiLeft: "",
    emojiRight: "",

    // 2. FUTURE COLOR CUSTOMIZATION PANEL (Using any Tailwind Color Classes)
    // For a solid background color, just use one class (e.g., "bg-brandBlue-600")
    // For beautiful gradients, use "bg-gradient-to-r from-[color] via-[color] to-[color]"
    bannerBackground: "bg-brandBlue-600",
    bannerBottomBorder: "border-brandYellow-400",
    bannerTextColor: "text-white",
    ctaButtonBackground: "bg-brandYellow-400",
    ctaButtonTextColor: "text-gray-900",

    // 3. CTA Button Customization Panel
    ctaButtonBackground: "bg-gray-900", // Makes your button contrast brilliantly 
    ctaButtonTextColor: "text-brandYellow-400", // Matches your brand colors perfectly
    ctaButtonShadow: "shadow-[0_4px_0_0_#000000]" // The 3D cartoon arcade button drop shadow color
};

function initFestivalBanner() {
    const banner = document.getElementById('festival-banner');
    const heroSection = document.querySelector('section'); // References your landing hero section

    if (!banner || !festivalConfig.showBanner) {
        if (banner) banner.classList.add('hidden');
        return;
    }

    // Apply Content Texts
    document.getElementById('banner-text').innerHTML = festivalConfig.text;
    document.getElementById('banner-emoji-left').innerText = festivalConfig.emojiLeft;
    document.getElementById('banner-emoji-right').innerText = festivalConfig.emojiRight;

    // Apply Main Banner Text and Background Styles
    const bgContainer = document.getElementById('banner-bg');
    bgContainer.className = `${festivalConfig.bannerBackground} ${festivalConfig.bannerBottomBorder} shadow-lg py-3.5 px-4 text-center relative flex items-center justify-center min-h-[56px] rounded-b-2xl border-b-4`;

    const bannerTextContainer = document.getElementById('banner-text');
    bannerTextContainer.className = `${festivalConfig.bannerTextColor} drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)] tracking-wide`;

    // Apply Button Color Configs
    const ctaButton = document.getElementById('banner-cta');
    ctaButton.innerHTML = festivalConfig.ctaText;
    ctaButton.className = `${festivalConfig.ctaButtonBackground} ${festivalConfig.ctaButtonTextColor} ${festivalConfig.ctaButtonShadow} inline-block font-black text-xs sm:text-sm px-5 py-2 rounded-full uppercase tracking-wider hover:brightness-110 active:translate-y-[2px] active:shadow-none transform hover:scale-105 transition-all duration-150 whitespace-nowrap ml-2`;

    // Handle Redirection Click Flow
    ctaButton.onclick = () => {
        window.location.href = festivalConfig.ctaLink;
    };

    // Render Section layout modifications gracefully
    banner.classList.remove('hidden');
    if (heroSection) {
        heroSection.style.paddingTop = "184px"; // Offsets content alignment safely
    }
}

window.closeFestivalBanner = function () {
    const banner = document.getElementById('festival-banner');
    const heroSection = document.querySelector('section');
    banner.classList.add('hidden');
    if (heroSection) {
        heroSection.style.paddingTop = ""; // Instantly snaps spacing values back to original
    }
}

// Fire sequence calculation on launch
document.addEventListener('DOMContentLoaded', initFestivalBanner);