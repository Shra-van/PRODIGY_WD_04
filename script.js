const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactForm = document.querySelector(".contact-form");
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

function closeNavigation() {
  document.body.classList.remove("nav-open");
  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  document.body.classList.toggle("nav-open", !isOpen);
  siteNav.classList.toggle("is-open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

// Close nav when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-nav') && !e.target.closest('.nav-toggle')) {
    closeNavigation();
  }
});

// Active nav highlighting using IntersectionObserver
const sections = document.querySelectorAll('main > section[id], main > section');
const navMap = Array.from(navLinks).reduce((acc, a) => {
  const href = a.getAttribute('href');
  if (href && href.startsWith('#')) acc[href.slice(1)] = a;
  return acc;
}, {});

const observerOptions = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = navMap[id];
    if (link) {
      if (entry.isIntersecting) link.classList.add('active');
      else link.classList.remove('active');
    }
  });
}, observerOptions);

sections.forEach(sec => {
  if (sec.id) sectionObserver.observe(sec);
});

// Simple toast helper
function showToast(message, duration = 2500){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(()=> t.classList.add('visible'), 50);
  setTimeout(()=> { t.classList.remove('visible'); t.remove(); }, duration);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    if (!name || !email || !message) {
      if (formStatus) formStatus.textContent = 'Please fill in the required fields.';
      showToast('Please fill in all required fields.');
      return;
    }

    const body = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      const prevText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';

      // Announce status for screen readers
      if (formStatus) formStatus.textContent = 'Preparing message. Redirecting to WhatsApp.';

      // Small delay to show feedback
      setTimeout(() => {
        window.location.href = `https://wa.me/916364500684?text=${encodeURIComponent(body)}`;
        // reset (in case redirect blocked)
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = prevText;
      }, 900);
    } else {
      window.location.href = `https://wa.me/916364500684?text=${encodeURIComponent(body)}`;
    }
  } catch (err) {
    console.error(err);
    if (formStatus) formStatus.textContent = 'Error sending message. Please try again.';
    showToast('Error sending message. Please try again.');
    if (submitBtn) submitBtn.disabled = false;
  }
});
