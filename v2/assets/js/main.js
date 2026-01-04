// v2/assets/js/main.js
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav (optional)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navMenu.addEventListener("click", (e) => {
      if (e.target && e.target.matches("a.nav-link")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll only for # links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: "smooth",
      });
    });
  });

  // Theme toggle (optional)
  const themeToggle = document.getElementById("theme-toggle");
  const THEME_KEY = "lv-theme";
  function applyTheme(t) {
    if (!themeToggle) return;
    if (t === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      document.body.classList.remove("dark");
      themeToggle.textContent = "🌙";
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)').matches) applyTheme("dark");
    else applyTheme("light");
  }

  // Messenger tip (optional)
  const tip = document.getElementById("msgtip");
  if (tip) {
    setTimeout(() => {
      tip.style.display = "block";
      tip.style.opacity = "0";
      tip.style.transition = "opacity .35s";
      requestAnimationFrame(() => (tip.style.opacity = "1"));
    }, 1200);

    setTimeout(() => {
      tip.style.opacity = "0";
      setTimeout(() => (tip.style.display = "none"), 400);
    }, 9000);
  }

  // Payment proof submit handler (only on payment page)
  const paymentForm = document.getElementById("paymentForm");
  const thank = document.getElementById("thank");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = paymentForm.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Submitting..."; }

      try {
        const fd = new FormData(paymentForm);
        const res = await fetch(paymentForm.action, { method: "POST", body: fd, mode: "cors" });

        let ok = false;
        try { await res.json(); ok = true; }
        catch { const t = await res.text(); ok = res.ok && !!t; }

        if (!ok) throw new Error("Bad response");
        paymentForm.style.display = "none";
        if (thank) thank.style.display = "block";
      } catch {
        alert("Submission failed — try again or message us on Facebook.");
        if (btn) { btn.disabled = false; btn.textContent = original || "Submit Payment Proof"; }
      }
    });
  }
})();
