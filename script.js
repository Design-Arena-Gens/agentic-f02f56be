// Slide navigation functionality
let currentSlide = 1;
const totalSlides = 12;

const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');

// Initialize
updateSlideDisplay();

// Event Listeners
prevBtn.addEventListener('click', () => navigateSlide(-1));
nextBtn.addEventListener('click', () => navigateSlide(1));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        navigateSlide(-1);
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        navigateSlide(1);
    } else if (e.key === 'Home') {
        goToSlide(1);
    } else if (e.key === 'End') {
        goToSlide(totalSlides);
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.presentation').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.presentation').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            navigateSlide(1);
        } else {
            // Swipe right - previous slide
            navigateSlide(-1);
        }
    }
}

function navigateSlide(direction) {
    const newSlide = currentSlide + direction;

    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

function goToSlide(slideNumber) {
    // Remove active class from current slide
    slides[currentSlide - 1].classList.remove('active');

    // Add prev class if going forward
    if (slideNumber > currentSlide) {
        slides[currentSlide - 1].classList.add('prev');
    } else {
        slides[currentSlide - 1].classList.remove('prev');
    }

    // Update current slide
    currentSlide = slideNumber;

    // Add active class to new slide
    slides[currentSlide - 1].classList.add('active');
    slides[currentSlide - 1].classList.remove('prev');

    // Update display
    updateSlideDisplay();

    // Reset scroll position
    slides[currentSlide - 1].scrollTop = 0;
}

function updateSlideDisplay() {
    // Update counter
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

    // Update progress bar
    const progress = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;

    // Update button states
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// Add animation on load
window.addEventListener('load', () => {
    document.querySelector('.slide.active').style.opacity = '1';
});

// Presentation mode (F11 or fullscreen)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add slide number indicator on hover
slides.forEach((slide, index) => {
    slide.setAttribute('data-slide-number', index + 1);
});

// Smooth scroll for slide content
document.querySelectorAll('.slide').forEach(slide => {
    slide.style.scrollBehavior = 'smooth';
});

// Add print support
window.addEventListener('beforeprint', () => {
    // Show all slides for printing
    slides.forEach(slide => {
        slide.style.position = 'relative';
        slide.style.opacity = '1';
        slide.style.transform = 'none';
        slide.style.pageBreakAfter = 'always';
    });
});

window.addEventListener('afterprint', () => {
    // Restore normal view
    slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        if (index === currentSlide - 1) {
            slide.style.opacity = '1';
            slide.style.transform = 'translateX(0)';
        } else {
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        }
    });
});

// Auto-save current slide position
window.addEventListener('beforeunload', () => {
    localStorage.setItem('presentationCurrentSlide', currentSlide);
});

// Restore slide position on load
window.addEventListener('load', () => {
    const savedSlide = localStorage.getItem('presentationCurrentSlide');
    if (savedSlide) {
        const slideNum = parseInt(savedSlide);
        if (slideNum >= 1 && slideNum <= totalSlides) {
            goToSlide(slideNum);
        }
    }
});

// Add visual feedback for button clicks
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});
