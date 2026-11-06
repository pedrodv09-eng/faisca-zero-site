(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== REVEAL ON SCROLL ===================== */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ===================== HERO PARTICLES ===================== */
  function setupParticles() {
    var container = document.getElementById("heroParticles");
    if (!container || prefersReducedMotion) return;

    var count = window.innerWidth < 600 ? 14 : 24;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      var left = Math.random() * 100;
      var duration = 6 + Math.random() * 8;
      var delay = Math.random() * 8;
      var size = 2 + Math.random() * 4;
      var bottom = Math.random() * 40;

      span.style.left = left + "%";
      span.style.bottom = bottom + "%";
      span.style.width = size + "px";
      span.style.height = size + "px";
      span.style.animationDuration = duration + "s";
      span.style.animationDelay = delay + "s";
      container.appendChild(span);
    }
  }

  /* ===================== INIT ===================== */
  document.addEventListener("DOMContentLoaded", function () {
    setupReveal();
    setupParticles();
  });
})();
