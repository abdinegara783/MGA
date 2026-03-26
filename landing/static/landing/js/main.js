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
  var payCards = document.querySelectorAll(".vf-pay-card");
  var payPanelBank = document.getElementById("payPanelBank");
  var payPanelVa = document.getElementById("payPanelVa");
  var payPanelQris = document.getElementById("payPanelQris");
  var payPanelDp = document.getElementById("payPanelDp");
  var copyButtons = document.querySelectorAll(".vf-copy-btn");
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
    if (rateValueEl) {
      rateValueEl.textContent = "Rp " + rate.toLocaleString("id-ID");
      rateValueEl.classList.add("vf-flash");
      setTimeout(function(){ rateValueEl.classList.remove("vf-flash"); }, 360);
    }
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
    paxBadgeEl.classList.remove("vf-badge-blue", "vf-badge-gold");
    if (pax === 1) {
      paxBadgeEl.classList.add("vf-badge-blue");
      paxBadgeEl.textContent = "Perorangan";
    } else if (pax >= 2 && pax <= 9) {
      paxBadgeEl.classList.add("vf-badge-blue");
      paxBadgeEl.textContent = "Grup kecil";
    } else {
      paxBadgeEl.classList.add("vf-badge-gold");
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
      paxBadgeEl2.classList.remove("vf-badge-blue", "vf-badge-gold");
      if (pax === 1) {
        paxBadgeEl2.classList.add("vf-badge-blue");
        paxBadgeEl2.textContent = "Perorangan";
      } else if (pax >= 2 && pax <= 9) {
        paxBadgeEl2.classList.add("vf-badge-blue");
        paxBadgeEl2.textContent = "Grup kecil";
      } else {
        paxBadgeEl2.classList.add("vf-badge-gold");
        paxBadgeEl2.textContent = "Grup";
      }
    }
  };
  var updateCalcOrig = updateCalc;
  updateCalc = function () {
    updateCalcOrig();
    var pax = parseInt((paxCountEl && paxCountEl.textContent) || "1", 10) || 1;
    if (paxCountEl2) paxCountEl2.textContent = pax.toLocaleString("id-ID");
    if (paxCountEl) {
      paxCountEl.classList.add("vf-bump");
      setTimeout(function(){ paxCountEl.classList.remove("vf-bump"); }, 340);
    }
    if (paxCountEl2) {
      paxCountEl2.classList.add("vf-bump");
      setTimeout(function(){ paxCountEl2.classList.remove("vf-bump"); }, 340);
    }
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
        var err = wrap ? wrap.querySelector(".vf-error") : null;
        var val = el ? el.value.trim() : "";
        var valid = val.length > 0;
        if (f.type === "email" && valid) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
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
  var submitBtn = document.getElementById("submitOrder");
  var successBox = document.getElementById("successBox");
  var sNama = document.getElementById("sNama");
  var sVisaPax = document.getElementById("sVisaPax");
  var sTotal = document.getElementById("sTotal");
  var sMethod = document.getElementById("sMethod");
  var sWa = document.getElementById("sWa");
  var sRef = document.getElementById("sRef");
  var orderAgain = document.getElementById("orderAgain");
  var orderChat = document.getElementById("orderChat");
  var confettiWrap = document.getElementById("confetti");
  var payError = document.getElementById("payError");
  var getActiveMethod = function () {
    var active = document.querySelector(".vf-pay-card.active");
    return active ? active.getAttribute("data-method") : null;
  };
  var methodLabel = function (m) {
    if (m === "bank") return "Transfer Bank";
    if (m === "va") return "Virtual Account";
    if (m === "qris") return "QRIS";
    if (m === "dp") return "DP 50% — Cicilan";
    return "-";
  };
  var spawnConfetti = function () {
    if (!confettiWrap) return;
    var colors = ["#C9A84C", "#F5EFE0", "#ffffff"];
    for (var i = 0; i < 30; i++) {
      var piece = document.createElement("span");
      piece.className = "vf-confetti-piece";
      var left = Math.floor(Math.random() * 100);
      piece.style.left = left + "vw";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = (Math.random() * 0.6) + "s";
      document.body.appendChild(piece);
      setTimeout(function (p) { if (p && p.parentNode) p.parentNode.removeChild(p); }, 3200, piece);
    }
  };
  var scrollToEl = function (el) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  var resetForm = function () {
    var fields = ["nama_pemesan", "wa_pemesan", "email_pemesan", "tgl_berangkat", "jenis_visa", "catatan"];
    fields.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (el.tagName === "SELECT") el.selectedIndex = 0;
        else el.value = "";
        el.removeAttribute("aria-invalid");
        var err = el.parentElement && el.parentElement.querySelector(".error-message");
        if (err) err.textContent = "";
      }
    });
    if (payError) payError.textContent = "";
    var defaultCard = document.querySelector('.vf-pay-card[data-method="bank"]');
    if (defaultCard) {
      document.querySelectorAll(".vf-pay-card").forEach(function (c) { c.classList.remove("active"); });
      defaultCard.classList.add("active");
      showPanel("bank");
    }
    if (filePassport) filePassport.value = "";
    if (fileFoto) fileFoto.value = "";
    if (fileKtp) fileKtp.value = "";
    if (namePassport) namePassport.textContent = "";
    if (nameFoto) nameFoto.textContent = "";
    if (nameKtp) nameKtp.textContent = "";
    if (paxCountEl) {
      paxCountEl.textContent = "35";
      updateCalc();
    }
    if (paxCountEl2) paxCountEl2.textContent = "35";
    if (paxBadgeEl) paxBadgeEl.textContent = "Grup";
    if (paxBadgeEl2) paxBadgeEl2.textContent = "Grup";
    if (successBox) {
      successBox.classList.remove("show");
      successBox.style.display = "none";
    }
  };
  var validateBeforeSubmit = function () {
    var firstErrorEl = null;
    var setErr = function (id, valid, msg) {
      var el = document.getElementById(id);
        var err = el && el.parentElement ? el.parentElement.querySelector(".vf-error") : null;
      if (!el) return;
      if (!valid) {
        el.setAttribute("aria-invalid", "true");
        if (err) err.textContent = msg;
        if (!firstErrorEl) firstErrorEl = el;
      } else {
        el.removeAttribute("aria-invalid");
        if (err) err.textContent = "";
      }
    };
    var nama = document.getElementById("nama_pemesan");
    var wa = document.getElementById("wa_pemesan");
    var email = document.getElementById("email_pemesan");
    var tgl = document.getElementById("tgl_berangkat");
    var jenis = document.getElementById("jenis_visa");
    var waVal = wa ? wa.value.trim() : "";
    var emailVal = email ? email.value.trim() : "";
    var tglVal = tgl ? tgl.value : "";
    var today = new Date(); today.setHours(0,0,0,0);
    var tglDate = tglVal ? new Date(tglVal) : null;
    setErr("nama_pemesan", !!(nama && nama.value.trim().length), "Wajib diisi");
    setErr("wa_pemesan", /^08\d{8,}$/.test(waVal), "Format WA harus diawali 08 dan minimal 10 digit");
    setErr("email_pemesan", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal), "Email tidak valid");
    setErr("tgl_berangkat", !!(tglDate && tglDate.getTime() >= today.getTime()), "Tanggal tidak boleh masa lalu");
    setErr("jenis_visa", !!(jenis && jenis.value.trim().length), "Pilih jenis visa");
    var method = getActiveMethod();
    if (!method) {
      if (payError) payError.textContent = "Pilih metode pembayaran";
      if (!firstErrorEl) firstErrorEl = document.querySelector(".vf-pay-grid");
    } else {
      if (payError) payError.textContent = "";
    }
    return firstErrorEl;
  };
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      var firstErrorEl = validateBeforeSubmit();
      if (firstErrorEl) {
        submitBtn.classList.add("shake");
        setTimeout(function () { submitBtn.classList.remove("shake"); }, 420);
        scrollToEl(firstErrorEl);
        return;
      }
      submitBtn.classList.add("loading");
      var label = submitBtn.querySelector(".btn-label");
      if (label) label.textContent = "Memproses...";
      submitBtn.setAttribute("disabled", "true");
      setTimeout(function () {
        submitBtn.classList.remove("loading");
        if (label) label.textContent = "Kirim Pesanan Sekarang →";
        submitBtn.removeAttribute("disabled");
        var nama = document.getElementById("nama_pemesan").value.trim();
        var wa = document.getElementById("wa_pemesan").value.trim();
        var jenis = document.getElementById("jenis_visa").value.trim();
        var pax = parseInt((paxCountEl && paxCountEl.textContent) || "1", 10) || 1;
        var method = methodLabel(getActiveMethod());
        var refDate = new Date();
        var y = refDate.getFullYear();
        var m = String(refDate.getMonth() + 1).padStart(2, "0");
        var d = String(refDate.getDate()).padStart(2, "0");
        var rand = Math.floor(1000 + Math.random() * 9000);
        var ref = "REF-" + y + m + d + "-" + rand;
        if (sNama) sNama.textContent = nama;
        if (sVisaPax) sVisaPax.textContent = jenis + " — " + pax.toLocaleString("id-ID") + " pax";
        if (sTotal) sTotal.textContent = "Rp " + (lastTotalIdrNum || 0).toLocaleString("id-ID");
        if (sMethod) sMethod.textContent = method;
        if (sWa) sWa.textContent = wa;
        if (sRef) sRef.textContent = ref;
        if (successBox) {
          successBox.style.display = "block";
          successBox.classList.add("show");
          scrollToEl(successBox);
        }
        var msg = encodeURIComponent("Halo Madinah Group Amanah, saya ingin konfirmasi pesanan dengan nomor referensi " + ref + ".");
        if (orderChat) orderChat.setAttribute("href", "https://wa.me/6281200000000?text=" + msg);
        spawnConfetti();
      }, 1200);
    });
  }
  if (orderAgain) {
    orderAgain.addEventListener("click", function () {
      resetForm();
      scrollToEl(document.querySelector(".vf-header"));
    });
  }
});
