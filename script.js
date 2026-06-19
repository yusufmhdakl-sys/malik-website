document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav ul li a');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Simple transition effect for hamburger spans
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  // --- Sticky Header on Scroll ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Active Nav Link on Scroll (Scroll Spy) ---
  const sections = document.querySelectorAll('section, .hero');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for sticky nav

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  });

  // --- Services Category Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const servicePanels = document.querySelectorAll('.services-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-tab');

      // Update active button styling
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update active service panel visibility
      servicePanels.forEach(panel => {
        if (panel.id === targetCategory) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --- Booking Form Submission (WhatsApp Integration) ---
  const bookingForm = document.getElementById('bookingForm');
  const alertModal = document.getElementById('alertModal');
  const modalClose = document.getElementById('modalClose');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form inputs
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const date = document.getElementById('bookingDate').value;
      const service = document.getElementById('bookingService').value;

      if (!name || !phone || !date || !service) {
        alert('Lütfen tüm alanları doldurunuz.');
        return;
      }

      // Format Date for better readability in Turkish
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Format WhatsApp Message
      const message = `Merhaba Malik Bey, Moül Salon'dan randevu almak istiyorum.
👤 Ad Soyad: ${name}
📞 Telefon: ${phone}
📅 Tarih ve Saat: ${formattedDate}
✂️ Hizmet: ${service}`;

      // Encode message text
      const encodedText = encodeURIComponent(message);
      
      // Target Phone: Malik Kharrat (+90 535 280 24 78)
      const waNumber = '905352802478';
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`;

      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');

      // Show Custom Gold Alert modal in UI
      alertModal.classList.add('active');

      // Reset Form
      bookingForm.reset();
    });
  }

  // Close Custom Modal
  if (modalClose && alertModal) {
    modalClose.addEventListener('click', () => {
      alertModal.classList.remove('active');
    });

    // Close on clicking outside modal content
    alertModal.addEventListener('click', (e) => {
      if (e.target === alertModal) {
        alertModal.classList.remove('active');
      }
    });
  }

  // --- Scroll Reveal Animation Observer ---
  const revealElements = document.querySelectorAll('.about-image, .about-content, .service-item, .booking-form-card, .contact-info-item');
  
  // Set initial opacity and translation styling via JS if css does not cover,
  // but to keep styles clean we set it through a viewport class
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
