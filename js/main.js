const slider = document.getElementById('store-slider');
let isDown = false;
let startX;
let scrollLeft;

let isAutoScrolling = true;
let scrollDirection = 1;
const scrollSpeed = 0.5;

function autoScroll() {
    if (isAutoScrolling && !isDown && slider) {
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

if (slider) {
    autoScroll();

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
}

// --- MODAL LOGIC ---
const modalContainer = document.getElementById('modal-container');

window.openModal = function (modalId) {
    isAutoScrolling = false;
    document.querySelectorAll('.modal-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('scale-100', 'opacity-100');
        el.classList.add('scale-95');
    });

    if (modalContainer) {
        modalContainer.classList.remove('hidden');
        setTimeout(() => {
            modalContainer.classList.remove('opacity-0');
            modalContainer.classList.add('opacity-100');

            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.remove('hidden');
                setTimeout(() => {
                    targetModal.classList.remove('scale-95');
                    targetModal.classList.add('scale-100', 'opacity-100');
                }, 10);
            }
        }, 10);
    }
}

window.closeModal = function () {
    if (modalContainer) {
        modalContainer.classList.remove('opacity-100');
        modalContainer.classList.add('opacity-0');
    }

    document.querySelectorAll('.modal-content').forEach(el => {
        el.classList.remove('scale-100');
        el.classList.add('scale-95');
    });

    setTimeout(() => {
        if (modalContainer) modalContainer.classList.add('hidden');
        document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
        isAutoScrolling = true;
    }, 300);
}

if (modalContainer) {
    modalContainer.addEventListener('click', function (e) {
        const zoomModal = document.getElementById('image-zoom-modal');
        if (e.target === this && (!zoomModal || zoomModal.classList.contains('hidden'))) {
            closeModal();
        }
    });
}

// --- IMAGE ZOOM LOGIC ---
const imageZoomModal = document.getElementById('image-zoom-modal');
const zoomedImage = document.getElementById('zoomed-image');

window.openImageZoom = function (imgSrc) {
    if (zoomedImage && imageZoomModal) {
        zoomedImage.src = imgSrc;
        imageZoomModal.classList.remove('hidden');

        setTimeout(() => {
            imageZoomModal.classList.remove('opacity-0');
            imageZoomModal.classList.add('opacity-100');
            zoomedImage.classList.remove('scale-95');
            zoomedImage.classList.add('scale-100');
        }, 10);
    }
}

window.closeImageZoom = function () {
    if (imageZoomModal && zoomedImage) {
        imageZoomModal.classList.remove('opacity-100');
        imageZoomModal.classList.add('opacity-0');
        zoomedImage.classList.remove('scale-100');
        zoomedImage.classList.add('scale-95');

        setTimeout(() => {
            imageZoomModal.classList.add('hidden');
            zoomedImage.src = '';
        }, 300);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        if (imageZoomModal && !imageZoomModal.classList.contains('hidden')) {
            closeImageZoom();
        } else if (modalContainer && !modalContainer.classList.contains('hidden')) {
            closeModal();
        }
    }
});

// --- WHATSAPP FORM SUBMISSION LOGIC ---
document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('trialForm');

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('parentName').value;
            const email = document.getElementById('parentEmail').value;
            const phone = document.getElementById('parentPhone').value;
            const grade = document.getElementById('childGrade').value;
            const course = document.getElementById('selectedCourse').value;

            const whatsappNumber = "918826821126";

            const message = `🤖 *New Trial Class Booking* 🤖\n\n` +
                `👤 *Parent's Name:* ${name}\n` +
                `📧 *Email:* ${email}\n` +
                `📞 *Phone Number:* ${phone}\n` +
                `🎓 *Child's Grade:* ${grade}\n` +
                `💻 *Selected Course:* ${course}`;

            const encodedMessage = encodeURIComponent(message);
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            if (isIOS) {
                const iosWhatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
                window.location.href = iosWhatsappUrl;
                setTimeout(() => {
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                }, 500);
            } else {
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }
});

// --- WHATSAPP STORE KIT PURCHASE LOGIC ---
window.orderKitOnWhatsApp = function (kitName) {
    const whatsappNumber = "918826821126";

    const message = `🛒 *New Store Order Inquiry* 🛒\n\n` +
        `📦 *Product:* ${kitName}\n` +
        `💬 Hi STEAMX Academy! I am interested in purchasing this kit. Please share the availability, payment options, and delivery timelines with me.`;

    const encodedMessage = encodeURIComponent(message);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
        const iosWhatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
        window.location.href = iosWhatsappUrl;
        setTimeout(() => {
            window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        }, 500);
    } else {
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
}

// --- FESTIVAL BANNER MANAGER ---
const festivalConfig = {
    showBanner: true, 
    text: "Unlock the Future! Book your free 1:1 online live coding slot today.",
    ctaText: "Let's Play!",
    ctaLink: "#booking",
    emojiLeft: "🎉",
    emojiRight: "✨",
    bannerBackground: "bg-brandBlue-600",
    bannerBottomBorder: "border-brandYellow-400",
    bannerTextColor: "text-white",
    ctaButtonBackground: "bg-gray-900", 
    ctaButtonTextColor: "text-brandYellow-400", 
    ctaButtonShadow: "shadow-[0_4px_0_0_#000000]" 
};

function initFestivalBanner() {
    const banner = document.getElementById('festival-banner');
    const heroSection = document.querySelector('section'); 

    if (!banner || !festivalConfig.showBanner) {
        if (banner) banner.classList.add('hidden');
        return;
    }

    const bannerText = document.getElementById('banner-text');
    const bEmojiLeft = document.getElementById('banner-emoji-left');
    const bEmojiRight = document.getElementById('banner-emoji-right');
    const ctaButton = document.getElementById('banner-cta');

    if (bannerText) bannerText.innerHTML = festivalConfig.text;
    if (bEmojiLeft) bEmojiLeft.innerText = festivalConfig.emojiLeft;
    if (bEmojiRight) bEmojiRight.innerText = festivalConfig.emojiRight;

    const bgContainer = document.getElementById('banner-bg');
    if (bgContainer) {
        bgContainer.className = `${festivalConfig.bannerBackground} ${festivalConfig.bannerBottomBorder} shadow-lg py-3.5 px-4 text-center relative flex items-center justify-center min-h-[56px] rounded-b-2xl border-b-4`;
    }

    if (bannerText) {
        bannerText.className = `${festivalConfig.bannerTextColor} drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)] tracking-wide`;
    }

    if (ctaButton) {
        ctaButton.innerHTML = festivalConfig.ctaText;
        ctaButton.className = `${festivalConfig.ctaButtonBackground} ${festivalConfig.ctaButtonTextColor} ${festivalConfig.ctaButtonShadow} inline-block font-black text-xs sm:text-sm px-5 py-2 rounded-full uppercase tracking-wider transform hover:scale-105 transition-all duration-150 whitespace-nowrap ml-2`;
        ctaButton.onclick = () => {
            window.location.href = festivalConfig.ctaLink;
        };
    }

    banner.classList.remove('hidden');
    if (heroSection) {
        heroSection.style.paddingTop = "184px"; 
    }
}

window.closeFestivalBanner = function () {
    const banner = document.getElementById('festival-banner');
    const heroSection = document.querySelector('section');
    if (banner) banner.classList.add('hidden');
    if (heroSection) {
        heroSection.style.paddingTop = ""; 
    }
}

document.addEventListener('DOMContentLoaded', initFestivalBanner);