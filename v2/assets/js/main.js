// main.js — interactions for LV Beach Camp site
(function(){
  // Elements
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const messenger = document.getElementById('messenger-bubble');
  const yearEl = document.getElementById('year');

  // Set current year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle (mobile)
  if(navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close when a nav link is clicked (mobile)
    navMenu.addEventListener('click', (e) => {
      if(e.target && e.target.matches('a.nav-link')){
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for anchor nav
  document.querySelectorAll('a.nav-link, a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 72,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Theme toggle: persists to localStorage
  const THEME_KEY = 'lv-theme';
  function applyTheme(t){
    if(t === 'dark'){ document.body.classList.add('dark'); themeToggle.textContent = '☀️'; themeToggle.setAttribute('aria-pressed','true'); }
    else { document.body.classList.remove('dark'); themeToggle.textContent = '🌙'; themeToggle.setAttribute('aria-pressed','false'); }
  }

  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // On load, apply saved theme or prefer-color-scheme
  const saved = localStorage.getItem(THEME_KEY);
  if(saved) applyTheme(saved);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  else applyTheme('light');

  // Messenger bubble tooltip (keyboard accessible)
  if(messenger){
    messenger.addEventListener('keydown', (e)=> {
      if(e.key === 'Enter' || e.key === ' ') messenger.click();
    });
    // for extra polish: subtle pulse animation on first load
    setTimeout(()=> messenger.classList.add('pulse'), 900);
  }

  // Accessibility: focus outline visible on keyboard only
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('show-focus');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // Simple preloader fade-in for content sections
  window.addEventListener('load', ()=> {
    document.body.classList.add('page-loaded');
  });

})();
