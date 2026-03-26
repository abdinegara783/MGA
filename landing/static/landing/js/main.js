document.addEventListener("DOMContentLoaded", function () {
  var loading = document.getElementById("loading");
  setTimeout(function () {
    if (loading) loading.classList.add("hidden");
  }, 1500);
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
  document.querySelectorAll(".section .container").forEach(function (el) {
    el.classList.add("reveal");
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
  var sections = document.querySelectorAll("section[id]");
  var linkMap = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    linkMap[a.getAttribute("href").replace('#','')] = a;
  });
  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.id;
      var link = linkMap[id];
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 });
  sections.forEach(function (sec) { activeObserver.observe(sec); });
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
  var popup = document.querySelector(".popup-overlay");
  var popupClose = document.querySelector(".popup-close");
  var popupClaim = document.querySelector(".popup-claim");
  if (popup) {
    var shown = localStorage.getItem("mga_popup_shown");
    if (!shown) {
      setTimeout(function () {
        popup.classList.add("open");
        localStorage.setItem("mga_popup_shown", "1");
      }, 5000);
    }
    if (popupClose) {
      popupClose.addEventListener("click", function () {
        popup.classList.remove("open");
      });
    }
    if (popupClaim) {
      popupClaim.addEventListener("click", function () {
        popup.classList.remove("open");
      });
    }
  }
});
