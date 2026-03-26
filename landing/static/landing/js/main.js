document.addEventListener("DOMContentLoaded", function () {
  var nav = document.getElementById("navbar");
  var onScroll = function () {
    if (window.scrollY > 8) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  var heroes = document.querySelectorAll(".hero-content .animate-in");
  heroes.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      var d = parseInt(window.getComputedStyle(el).animationDelay) || 0;
      el.style.animationDelay = d + "ms";
    }
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("inview");
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal, .reveal-left").forEach(function (el) {
    observer.observe(el);
  });
  var statObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        if (el.dataset.counted === "1") return;
        el.dataset.counted = "1";
        var target = parseInt(el.dataset.target, 10) || 0;
        var suffix = el.dataset.suffix || "";
        var duration = 1200;
        var start = 0;
        var startTime = null;
        var step = function (ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var current = Math.floor(progress * (target - start) + start);
          el.textContent = current.toLocaleString("id-ID") + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString("id-ID") + suffix;
          }
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".count[data-target]").forEach(function (num) {
    statObserver.observe(num);
  });
  var faqHeaders = document.querySelectorAll(".faq-header");
  faqHeaders.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var body = item.querySelector(".faq-body");
      var icon = btn.querySelector(".icon");
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        item.classList.remove("open");
        body.style.height = body.scrollHeight + "px";
        requestAnimationFrame(function () {
          body.style.height = "0px";
        });
        icon.textContent = "+";
      } else {
        btn.setAttribute("aria-expanded", "true");
        item.classList.add("open");
        body.style.height = "auto";
        var full = body.scrollHeight;
        body.style.height = "0px";
        requestAnimationFrame(function () {
          body.style.height = full + "px";
        });
        icon.textContent = "−";
      }
    });
  });
});
