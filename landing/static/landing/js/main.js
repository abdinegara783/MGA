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
});
