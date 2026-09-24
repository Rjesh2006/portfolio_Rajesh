/* =========================================================
   Rajesh — Portfolio
   Theme, navigation, scroll behaviour, reveal, contact form
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     EmailJS
     Public key is safe client-side by design.
     --------------------------------------------------------- */
  var EMAILJS_PUBLIC_KEY = "M6NV6DLKpRKb9yWHS";
  var EMAILJS_SERVICE_ID = "service_x9mk6ob";
  var EMAILJS_TEMPLATE_ID = "template_glnlybi";

  if (window.emailjs && typeof window.emailjs.init === "function") {
    try {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.warn("EmailJS failed to initialise:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.documentElement;

    /* -------------------------------------------------------
       1. Theme toggle (persisted, falls back to OS preference)
       ------------------------------------------------------- */
    var themeToggle = document.getElementById("theme-toggle");
    var themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

    function readStoredTheme() {
      try {
        return localStorage.getItem("theme");
      } catch (err) {
        return null;
      }
    }

    function applyTheme(mode) {
      root.setAttribute("data-theme", mode);
      if (themeIcon) {
        themeIcon.className = mode === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
      if (themeToggle) {
        themeToggle.setAttribute(
          "aria-label",
          mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );
      }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", mode === "dark" ? "#0b1220" : "#f6f8fb");
    }

    var prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(readStoredTheme() || (prefersDark ? "dark" : "light"));

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem("theme", next);
        } catch (err) {
          /* private mode — theme simply will not persist */
        }
      });
    }

    /* -------------------------------------------------------
       2. Mobile navigation
       ------------------------------------------------------- */
    var nav = document.getElementById("nav");
    var navToggle = document.getElementById("nav-toggle");

    function closeNav() {
      if (!nav || !navToggle) return;
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      var icon = navToggle.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    }

    if (nav && navToggle) {
      navToggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        var icon = navToggle.querySelector("i");
        if (icon) icon.className = isOpen ? "fas fa-xmark" : "fas fa-bars";
      });

      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeNav();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeNav();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 860) closeNav();
      });
    }

    /* -------------------------------------------------------
       3. Footer year
       ------------------------------------------------------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* -------------------------------------------------------
       4. Scroll: progress bar, active nav link, back-to-top
          All three share one rAF-throttled handler.
       ------------------------------------------------------- */
    var progress = document.getElementById("scroll-progress");
    var toTop = document.getElementById("to-top");
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main section[id]")
    );
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll('#nav a[href^="#"]')
    );
    var ticking = false;

    function onScroll() {
      var y = window.pageYOffset || root.scrollTop;

      if (progress) {
        var max = document.body.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }

      if (toTop) toTop.classList.toggle("show", y > 500);

      var current = "";
      for (var i = 0; i < sections.length; i++) {
        if (y >= sections[i].offsetTop - 140) current = sections[i].id;
      }
      for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.toggle(
          "active",
          navLinks[j].getAttribute("href") === "#" + current
        );
      }

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* -------------------------------------------------------
       5. Reveal on scroll (IntersectionObserver, with fallback)
       ------------------------------------------------------- */
    var revealTargets = document.querySelectorAll(
      ".skill-card, .project-card, .education-item, .timeline-item, .repo-chip, .about-facts, .blog-panel, .contact-form"
    );

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );

      Array.prototype.forEach.call(revealTargets, function (el, i) {
        el.classList.add("reveal");
        el.style.transitionDelay = (i % 3) * 70 + "ms";
        observer.observe(el);
      });
    }

    /* -------------------------------------------------------
       6. Contact form
       ------------------------------------------------------- */
    var form = document.getElementById("contact-form");
    if (!form) return;

    var note = form.querySelector(".form-note");
    var submitBtn = form.querySelector('button[type="submit"]');

    function setNote(message, kind) {
      if (!note) return;
      note.textContent = message;
      note.className = "form-note" + (kind ? " " + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!window.emailjs) {
        setNote(
          "Message service is unavailable. Please email rk2998858@gmail.com directly.",
          "err"
        );
        return;
      }

      var originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
      setNote("");

      window.emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(function () {
          submitBtn.innerHTML =
            '<i class="fas fa-check" aria-hidden="true"></i> Sent';
          setNote("Thanks — your message is on its way. I will reply shortly.", "ok");
          form.reset();
          setTimeout(function () {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
          }, 2200);
        })
        .catch(function (error) {
          console.error("EmailJS error:", error);
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          setNote(
            "That did not go through. Please email rk2998858@gmail.com directly.",
            "err"
          );
        });
    });
  });
})();
