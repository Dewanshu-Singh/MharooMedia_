import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scrolling
const lenis = new Lenis({
  autoRaf: true,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect & Mobile Menu ---
  const header = document.getElementById('header');
  const navCta = document.getElementById('nav-cta');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Initially show CTA if desktop
  if (window.innerWidth > 768) {
    navCta.style.display = 'inline-flex';
  }
  // --- Consultation Modal Logic ---
  const consultationModal = document.getElementById('consultation-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const consultationForm = document.getElementById('consultation-form');
  
  // Find all links that point to #contact
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      consultationModal.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      consultationModal.classList.remove('active');
    });
  }

  // Close modal when clicking outside
  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) {
        consultationModal.classList.remove('active');
      }
    });
  }

  // --- Consultation Form Submission ---
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(consultationForm);
      const data = Object.fromEntries(formData.entries());

      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
      formStatus.style.display = 'block';
      formStatus.innerText = '';

      try {
        const response = await fetch('http://localhost:3000/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          formStatus.style.color = '#22c55e'; // Green
          formStatus.innerText = 'Request sent successfully! We will contact you soon.';
          consultationForm.reset();
          setTimeout(() => {
            consultationModal.classList.remove('active');
            formStatus.style.display = 'none';
          }, 3000);
        } else {
          formStatus.style.color = '#ef4444'; // Red
          formStatus.innerText = result.error || 'Failed to send request. Please try again.';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        formStatus.style.color = '#ef4444'; // Red
        formStatus.innerText = 'A network error occurred. Please try again later.';
      } finally {
        submitBtn.innerText = 'Submit Request';
        submitBtn.disabled = false;
      }
    });
  }
  // --- YT Carousel Logic ---
  const ytSlides = document.querySelectorAll('.yt-slide');
  if (ytSlides.length > 0) {
    const nextBtns = document.querySelectorAll('.yt-nav-btn.next');
    const prevBtns = document.querySelectorAll('.yt-nav-btn.prev');
    let currentSlide = 0;

    const showSlide = (index) => {
      ytSlides.forEach(s => s.classList.remove('active'));
      ytSlides[index].classList.add('active');
    };

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % ytSlides.length;
        showSlide(currentSlide);
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + ytSlides.length) % ytSlides.length;
        showSlide(currentSlide);
      });
    });

    // Swipe support for YT Carousel
    const ytCarousel = document.getElementById('yt-carousel');
    if (ytCarousel) {
      let touchStartX = 0;
      let touchEndX = 0;
      ytCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      ytCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) { // swipe left (next)
          currentSlide = (currentSlide + 1) % ytSlides.length;
          showSlide(currentSlide);
        } else if (touchEndX - touchStartX > 50) { // swipe right (prev)
          currentSlide = (currentSlide - 1 + ytSlides.length) % ytSlides.length;
          showSlide(currentSlide);
        }
      }, { passive: true });
    }
  }

  // --- Reel 3D Carousel Logic ---
  const reelItems = document.querySelectorAll('.reel-item');
  if (reelItems.length > 0) {
    const nextReelBtn = document.querySelector('.reel-next');
    const prevReelBtn = document.querySelector('.reel-prev');
    let activeReel = 2; // Start with the middle one

    const updateReelCarousel = () => {
      reelItems.forEach((item, index) => {
        item.className = 'reel-item'; // Reset classes
        if (index === activeReel) {
          item.classList.add('active');
        } else if (index === activeReel - 1 || (activeReel === 0 && index === reelItems.length - 1)) {
          item.classList.add('prev-1');
        } else if (index === activeReel + 1 || (activeReel === reelItems.length - 1 && index === 0)) {
          item.classList.add('next-1');
        } else if (index === activeReel - 2 || (activeReel === 0 && index === reelItems.length - 2) || (activeReel === 1 && index === reelItems.length - 1)) {
          item.classList.add('prev-2');
        } else if (index === activeReel + 2 || (activeReel === reelItems.length - 1 && index === 1) || (activeReel === reelItems.length - 2 && index === 0)) {
          item.classList.add('next-2');
        }
      });
    };

    updateReelCarousel();

    if (nextReelBtn) {
      nextReelBtn.addEventListener('click', () => {
        activeReel = (activeReel + 1) % reelItems.length;
        updateReelCarousel();
      });
    }

    if (prevReelBtn) {
      prevReelBtn.addEventListener('click', () => {
        activeReel = (activeReel - 1 + reelItems.length) % reelItems.length;
        updateReelCarousel();
      });
    }
    
    // Allow clicking on a reel to make it active
    reelItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (index !== activeReel) {
          activeReel = index;
          updateReelCarousel();
        }
      });
    });

    // Swipe support for Reels Carousel
    const reelsCarousel = document.querySelector('.reels-track') || document.querySelector('.reels-grid') || document.querySelector('#reels');
    if (reelsCarousel) {
      let rTouchStartX = 0;
      let rTouchEndX = 0;
      reelsCarousel.addEventListener('touchstart', e => {
        rTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      reelsCarousel.addEventListener('touchend', e => {
        rTouchEndX = e.changedTouches[0].screenX;
        if (rTouchStartX - rTouchEndX > 50) { // swipe left (next)
          activeReel = (activeReel + 1) % reelItems.length;
          updateReelCarousel();
        } else if (rTouchEndX - rTouchStartX > 50) { // swipe right (prev)
          activeReel = (activeReel - 1 + reelItems.length) % reelItems.length;
          updateReelCarousel();
        }
      }, { passive: true });
    }
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Initial Page Load Animations (Hero) ---
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  heroTimeline.fromTo('.hero-bg', 
    { scale: 1.05 }, 
    { scale: 1, duration: 2 }, 
    0
  );
  
  heroTimeline.from('.gsap-hero', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.2
  }, 0.5);

  heroTimeline.from('.gsap-stat', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1
  }, 1.2);

  // --- ScrollTrigger: Stats Counters ---
  const stats = document.querySelectorAll('.gsap-stat h3, .scs-metrics h3');
  stats.forEach(stat => {
    const valSpan = stat.hasAttribute('data-val') ? stat : stat.querySelector('span[data-val]');
    if (!valSpan) return;
    
    const finalVal = parseFloat(valSpan.getAttribute('data-val'));
    const isDecimal = finalVal % 1 !== 0;
    
    gsap.to(valSpan, {
      scrollTrigger: {
        trigger: stat,
        start: 'top 90%',
      },
      innerHTML: finalVal,
      duration: 2.5,
      snap: { innerHTML: isDecimal ? 0.1 : 1 },
      ease: 'power2.out',
      onUpdate: function() {
        if(isDecimal) {
            valSpan.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
        }
      }
    });
  });

  // --- ScrollTrigger: Fade Up Elements ---
  gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // --- ScrollTrigger: Parallax Images ---
  gsap.utils.toArray('.gsap-parallax').forEach(element => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: 150,
      ease: 'none'
    });
  });

  // --- Signature Animation: Growth Journey ---
  const journeySection = document.querySelector('.growth-journey');
  const nodes = document.querySelectorAll('.gsap-node');
  const progressLine = document.getElementById('journey-progress');

  if (journeySection && nodes.length > 0) {
    // First node active by default if scrolled past
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: journeySection,
        start: 'top 70%',
        end: 'center 40%',
        scrub: 0.2
      }
    });

    nodes.forEach((node, index) => {
      // Ignore first node for progress calculation to avoid jumping
      if(index === 0) {
          node.classList.add('active');
          return;
      }
      const percentage = (index / (nodes.length - 1)) * 100;
      
      // Animate line width
      tl.to(progressLine, {
        width: `${percentage}%`,
        ease: 'none'
      }, index);
      
      // Toggle class when reaching the node
      tl.to(node, {
        opacity: 1,
        onStart: () => node.classList.add('active'),
        onReverseComplete: () => node.classList.remove('active')
      }, index);
    });
  }

  // --- Growth Graph Animation ---
  const graphWrapper = document.querySelector('.growth-graph-wrapper');
  if (graphWrapper) {
    ScrollTrigger.create({
      trigger: graphWrapper,
      start: 'top 75%',
      onEnter: () => graphWrapper.classList.add('is-visible')
    });

    const graphStats = document.querySelectorAll('.gsap-graph-stat');
    graphStats.forEach(stat => {
      const finalVal = parseFloat(stat.getAttribute('data-val'));
      gsap.to(stat, {
        scrollTrigger: {
          trigger: graphWrapper,
          start: 'top 75%',
        },
        innerHTML: finalVal,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power2.out'
      });
    });
  }

  // --- Contact Dropdown Logic ---
  const contactToggle = document.getElementById('contact-toggle');
  const contactDropdown = document.getElementById('contact-dropdown');

  if (contactToggle && contactDropdown) {
    contactToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      contactDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!contactToggle.contains(e.target) && !contactDropdown.contains(e.target)) {
        contactDropdown.classList.remove('active');
      }
    });
  }
});
