// Initialize AOS animations
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Particle Trail Cursor - Replace your existing cursor code with this
const cursor = document.querySelector('.cursor');
const particles = [];
const particleCount = 12;
let mouseX = 0;
let mouseY = 0;

// Create particles
for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    document.body.appendChild(particle);
    particles.push({
        element: particle,
        x: 0,
        y: 0,
        delay: (i / particleCount) * 0.3,
        size: Math.random() * 4 + 3
    });
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Animate particles
function animateParticles() {
    particles.forEach((particle, index) => {
        const delay = particle.delay * 1000;
        const size = particle.size;

        setTimeout(() => {
            particle.x += (mouseX - particle.x) * 0.2;
            particle.y += (mouseY - particle.y) * 0.2;

            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.width = size + 'px';
            particle.element.style.height = size + 'px';
            particle.element.style.opacity = 1 - (index / particleCount);
            particle.element.style.transform = `translate(-50%, -50%) scale(${1 - (index / particleCount)})`;
            particle.element.style.background = `rgba(59, 130, 246, ${1 - (index / particleCount)})`;
        }, delay);
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Interactive elements effect
const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .dev-showcase-card, .hover-effect'
);

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
        el.classList.add('glow-on-hover');
    });

    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
        el.classList.remove('glow-on-hover');
    });
});

// Country phone number configurations
const countryPhoneConfigs = {
    'US': { code: '+1', length: 10, pattern: /^\d{10}$/ },
    'IN': { code: '+91', length: 10, pattern: /^\d{10}$/ },
    'GB': { code: '+44', length: 10, pattern: /^\d{10}$/ },
    'CA': { code: '+1', length: 10, pattern: /^\d{10}$/ },
    'AU': { code: '+61', length: 9, pattern: /^\d{9}$/ },
    'JP': { code: '+81', length: 10, pattern: /^\d{10}$/ },
    'DE': { code: '+49', length: 10, pattern: /^\d{10}$/ },
    'FR': { code: '+33', length: 9, pattern: /^\d{9}$/ }
};

// Country select change handler
document.getElementById('country').addEventListener('change', function () {
    const country = this.value;
    const countryCodeElement = document.getElementById('countryCode');

    if (country && countryPhoneConfigs[country]) {
        countryCodeElement.textContent = countryPhoneConfigs[country].code;
    } else {
        countryCodeElement.textContent = '+__';
    }
});

// Form validation and submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll('[id$="Error"]').forEach(el => el.classList.add('hidden'));
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const country = document.getElementById('country').value;
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Validate name
    if (!name) {
        document.getElementById('nameError').classList.remove('hidden');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('emailError').classList.remove('hidden');
        isValid = false;
    }

    // Validate country
    if (!country) {
        alert('Please select your country');
        isValid = false;
    }

    // Validate phone
    if (country && countryPhoneConfigs[country]) {
        const config = countryPhoneConfigs[country];
        const phoneRegex = config.pattern;

        if (!phone || !phoneRegex.test(phone)) {
            document.getElementById('phoneError').textContent = `Please enter a valid ${config.length}-digit phone number`;
            document.getElementById('phoneError').classList.remove('hidden');
            isValid = false;
        }
    } else if (!phone) {
        document.getElementById('phoneError').textContent = 'Please enter your phone number';
        document.getElementById('phoneError').classList.remove('hidden');
        isValid = false;
    }

    // Validate message
    if (!message) {
        document.getElementById('messageError').classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {

        const templateParams = {
            name: name,
            message: message,
            email: email,
            phone: document.getElementById('countryCode').textContent + ' ' + phone
        };

        // Send email using EmailJS
        emailjs.send('service_ar1b87a', 'template_pmgm11o', templateParams, 'PKZE3SgKtS5MFrqO9')
            .then(function (response) {
                // Show success message
                const successMsg = document.getElementById('successMessage');
                successMsg.classList.remove('hidden');

                // Hide success message after 4 seconds
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 4000);

                // Reset form
                document.getElementById('contactForm').reset();
                document.getElementById('countryCode').textContent = '+__';
            }, function (error) {
                // Show error message
                const errorMsg = document.getElementById('errorMessage');
                errorMsg.classList.remove('hidden');

                // Hide error message after 4 seconds
                setTimeout(() => {
                    errorMsg.classList.add('hidden');
                }, 4000);
            });
    }
});

// Initialize EmailJS
(function () {
    emailjs.init('PKZE3SgKtS5MFrqO9');
})();
