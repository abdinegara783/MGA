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
  var rateValueEl = document.getElementById("rateValue");
  var rateTimeEl = document.getElementById("rateTime");
  var rateRefreshEl = document.getElementById("rateRefresh");
  var paxMinusEl = document.getElementById("paxMinus");
  var paxPlusEl = document.getElementById("paxPlus");
  var paxCountEl = document.getElementById("paxCount");
  var paxBadgeEl = document.getElementById("paxBadge");
  var paxMinusEl2 = document.getElementById("paxMinus2");
  var paxPlusEl2 = document.getElementById("paxPlus2");
  var paxCountEl2 = document.getElementById("paxCount2");
  var paxBadgeEl2 = document.getElementById("paxBadge2");
  var metricPaxEl = document.getElementById("metricPax");
  var metricUsdEl = document.getElementById("metricUsd");
  var totalUsdLineEl = document.getElementById("totalUsdLine");
  var totalIdrEl = document.getElementById("totalIdr");
  var dpNowEl = document.getElementById("dpNow");
  var dpLaterEl = document.getElementById("dpLater");
  var payCards = document.querySelectorAll(".pay-card");
  var payPanelBank = document.getElementById("payPanelBank");
  var payPanelVa = document.getElementById("payPanelVa");
  var payPanelQris = document.getElementById("payPanelQris");
  var payPanelDp = document.getElementById("payPanelDp");
  var copyButtons = document.querySelectorAll(".copy-btn");
  var RATE_FALLBACK = 16400;
  var PRICE = 135;
  var rate = RATE_FALLBACK;
  var lastTotalUsdNum = 0;
  var lastTotalIdrNum = 0;
  var updateTime = function () {
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, "0");
    var mm = String(d.getMinutes()).padStart(2, "0");
    if (rateTimeEl) rateTimeEl.textContent = hh + ":" + mm;
  };
  var renderRate = function () {
    if (rateValueEl) rateValueEl.textContent = "Rp " + rate.toLocaleString("id-ID");
    updateTime();
  };
  var fetchRate = function () {
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.usd && typeof data.usd.idr === "number") {
          rate = Math.round(data.usd.idr);
        } else {
          rate = RATE_FALLBACK;
        }
        renderRate();
        updateCalc();
      })
      .catch(function () {
        rate = RATE_FALLBACK;
        renderRate();
        updateCalc();
      });
  };
  var updateBadge = function (pax) {
    if (!paxBadgeEl) return;
    paxBadgeEl.classList.remove("badge-blue", "badge-gold");
    if (pax === 1) {
      paxBadgeEl.classList.add("badge-blue");
      paxBadgeEl.textContent = "Perorangan";
    } else if (pax >= 2 && pax <= 9) {
      paxBadgeEl.classList.add("badge-blue");
      paxBadgeEl.textContent = "Grup kecil";
    } else {
      paxBadgeEl.classList.add("badge-gold");
      paxBadgeEl.textContent = "Grup";
    }
  };
  var updateCalc = function () {
    if (!paxCountEl) return;
    var pax = parseInt(paxCountEl.textContent, 10) || 1;
    var totalUsd = pax * PRICE;
    updateBadge(pax);
    if (metricPaxEl) metricPaxEl.textContent = pax.toLocaleString("id-ID");
    if (metricUsdEl) metricUsdEl.textContent = "$" + totalUsd.toLocaleString("id-ID");
    if (totalUsdLineEl) totalUsdLineEl.textContent = "$" + totalUsd.toLocaleString("id-ID") + " × Rp " + rate.toLocaleString("id-ID");
    lastTotalUsdNum = totalUsd;
    lastTotalIdrNum = totalUsd * rate;
    if (totalIdrEl) totalIdrEl.textContent = "Rp " + lastTotalIdrNum.toLocaleString("id-ID");
    if (dpNowEl && dpLaterEl) {
      var now = Math.round(lastTotalIdrNum * 0.5);
      var later = lastTotalIdrNum - now;
      dpNowEl.textContent = "Rp " + now.toLocaleString("id-ID");
      dpLaterEl.textContent = "Rp " + later.toLocaleString("id-ID");
    }
  };
  if (paxMinusEl && paxPlusEl && paxCountEl) {
    paxMinusEl.addEventListener("click", function () {
      var pax = parseInt(paxCountEl.textContent, 10) || 1;
      pax = Math.max(1, pax - 1);
      paxCountEl.textContent = pax.toLocaleString("id-ID");
      updateCalc();
    });
    paxPlusEl.addEventListener("click", function () {
      var pax = parseInt(paxCountEl.textContent, 10) || 1;
      pax = pax + 1;
      paxCountEl.textContent = pax.toLocaleString("id-ID");
      updateCalc();
    });
  }
  if (rateRefreshEl) {
    rateRefreshEl.addEventListener("click", fetchRate);
  }
  if (rateValueEl) {
    renderRate();
    updateCalc();
    fetchRate();
  }
  var showPanel = function (method) {
    [payPanelBank, payPanelVa, payPanelQris, payPanelDp].forEach(function (p) {
      if (!p) return;
      p.classList.remove("show");
    });
    if (method === "bank" && payPanelBank) payPanelBank.classList.add("show");
    if (method === "va" && payPanelVa) payPanelVa.classList.add("show");
    if (method === "qris" && payPanelQris) payPanelQris.classList.add("show");
    if (method === "dp" && payPanelDp) payPanelDp.classList.add("show");
  };
  if (payCards.length) {
    payCards.forEach(function (card) {
      card.addEventListener("click", function () {
        payCards.forEach(function (c) { c.classList.remove("active"); });
        card.classList.add("active");
        var method = card.getAttribute("data-method");
        showPanel(method);
      });
    });
  }
  if (copyButtons.length) {
    copyButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy") || "";
        if (text) {
          navigator.clipboard.writeText(text).then(function () {
            var original = btn.textContent;
            btn.textContent = "✓ Disalin!";
            setTimeout(function () { btn.textContent = original; }, 1500);
          });
        }
      });
    });
  }
  var updateBadge2 = function (pax) {
    if (paxBadgeEl2) {
      paxBadgeEl2.classList.remove("badge-blue", "badge-gold");
      if (pax === 1) {
        paxBadgeEl2.classList.add("badge-blue");
        paxBadgeEl2.textContent = "Perorangan";
      } else if (pax >= 2 && pax <= 9) {
        paxBadgeEl2.classList.add("badge-blue");
        paxBadgeEl2.textContent = "Grup kecil";
      } else {
        paxBadgeEl2.classList.add("badge-gold");
        paxBadgeEl2.textContent = "Grup";
      }
    }
  };
  var updateCalcOrig = updateCalc;
  updateCalc = function () {
    updateCalcOrig();
    var pax = parseInt((paxCountEl && paxCountEl.textContent) || "1", 10) || 1;
    if (paxCountEl2) paxCountEl2.textContent = pax.toLocaleString("id-ID");
    updateBadge2(pax);
  };
  if (paxMinusEl2 && paxPlusEl2 && paxCountEl) {
    paxMinusEl2.addEventListener("click", function () {
      var pax = parseInt(paxCountEl.textContent, 10) || 1;
      pax = Math.max(1, pax - 1);
      paxCountEl.textContent = pax.toLocaleString("id-ID");
      updateCalc();
    });
    paxPlusEl2.addEventListener("click", function () {
      var pax = parseInt(paxCountEl.textContent, 10) || 1;
      pax = pax + 1;
      paxCountEl.textContent = pax.toLocaleString("id-ID");
      updateCalc();
    });
  }
  var form = document.getElementById("formPemesan");
  if (form) {
    form.addEventListener("submit", function (e) {
      var fields = [
        { id: "nama_pemesan", message: "Wajib diisi" },
        { id: "wa_pemesan", message: "Wajib diisi" },
        { id: "email_pemesan", message: "Email tidak valid", type: "email" },
        { id: "tgl_berangkat", message: "Wajib diisi" },
        { id: "jenis_visa", message: "Pilih jenis visa" }
      ];
      var hasError = false;
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        var wrap = el ? el.parentElement : null;
        var err = wrap ? wrap.querySelector(".error-message") : null;
        var val = el ? el.value.trim() : "";
        var valid = val.length > 0;
        if (f.type === "email" && valid) {
          valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(val);
        }
        if (!valid) {
          hasError = true;
          if (err) err.textContent = f.message;
          if (el) el.setAttribute("aria-invalid", "true");
        } else {
          if (err) err.textContent = "";
          if (el) el.removeAttribute("aria-invalid");
        }
      });
      if (hasError) {
        e.preventDefault();
      }
    });
  }
  var filePassport = document.getElementById("file_passport");
  var fileFoto = document.getElementById("file_foto");
  var fileKtp = document.getElementById("file_ktp");
  var namePassport = document.getElementById("name_passport");
  var nameFoto = document.getElementById("name_foto");
  var nameKtp = document.getElementById("name_ktp");
  var bindFile = function (input, label) {
    if (!input || !label) return;
    input.addEventListener("change", function () {
      var f = input.files && input.files[0];
      label.textContent = f ? f.name : "";
    });
  };
  bindFile(filePassport, namePassport);
  bindFile(fileFoto, nameFoto);
  bindFile(fileKtp, nameKtp);
});
