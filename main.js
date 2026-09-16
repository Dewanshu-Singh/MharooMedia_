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

  // Form submission (prevent default and close for now)
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would normally send the data via fetch/ajax
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Request Sent!';
      submitBtn.style.backgroundColor = 'green';
      
      setTimeout(() => {
        consultationModal.classList.remove('active');
        submitBtn.innerText = originalText;
        submitBtn.style.backgroundColor = '';
        consultationForm.reset();
      }, 2000);
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
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 0.5
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

});
