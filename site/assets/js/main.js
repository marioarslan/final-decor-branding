/* Final Decor — interaction layer
   i18n (EN/AR + RTL) · mobile nav · lightbox · scroll reveal */
(function () {
  "use strict";

  /* ---------------- Language ---------------- */
  var STORE = "fd-lang";
  var root = document.documentElement;

  function applyLang(lang) {
    lang = lang === "ar" ? "ar" : "en";
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // text content
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if (val !== null) el.innerHTML = val;
    });
    // placeholders
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang + "-ph");
      if (val !== null) el.setAttribute("placeholder", val);
    });
    // aria-labels
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang + "-aria");
      if (val !== null) el.setAttribute("aria-label", val);
    });

    // toggle button state
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      var en = btn.querySelector("[data-code=en]");
      var ar = btn.querySelector("[data-code=ar]");
      if (en) en.style.fontWeight = lang === "en" ? "600" : "400";
      if (en) en.style.color = lang === "en" ? "var(--ink)" : "var(--graphite)";
      if (ar) ar.style.fontWeight = lang === "ar" ? "600" : "400";
      if (ar) ar.style.color = lang === "ar" ? "var(--ink)" : "var(--graphite)";
      btn.setAttribute("aria-label", lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية");
    });

    try { localStorage.setItem(STORE, lang); } catch (e) {}
    document.title = root.getAttribute("data-title-" + lang) || document.title;
  }

  var saved = "en";
  try { saved = localStorage.getItem(STORE) || "en"; } catch (e) {}
  applyLang(saved);

  document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(root.getAttribute("lang") === "en" ? "ar" : "en");
    });
  });
  document.querySelectorAll("[data-set-lang]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      applyLang(el.getAttribute("data-set-lang"));
    });
  });

  /* ---------------- Mobile nav ---------------- */
  var burger = document.querySelector(".nav__burger");
  if (burger) {
    burger.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".nav__link").forEach(function (l) {
      l.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- Lightbox ---------------- */
  var lbEls = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (lbEls.length) {
    var lb = document.createElement("div");
    lb.className = "lb";
    lb.innerHTML =
      '<a class="lb__close" href="#" aria-label="Close">Close</a>' +
      '<span class="lb__nav lb__prev" role="button" aria-label="Previous">&#8249;</span>' +
      '<img alt="">' +
      '<span class="lb__nav lb__next" role="button" aria-label="Next">&#8250;</span>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var idx = 0;
    function show(i) {
      idx = (i + lbEls.length) % lbEls.length;
      var src = lbEls[idx].getAttribute("data-lightbox") || lbEls[idx].getAttribute("src");
      lbImg.setAttribute("src", src);
    }
    function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    lbEls.forEach(function (el, i) {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    lb.querySelector(".lb__close").addEventListener("click", function (e) { e.preventDefault(); close(); });
    lb.querySelector(".lb__next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb__prev").addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------------- Project filter ---------------- */
  var filterBar = document.querySelector("[data-filterbar]");
  if (filterBar) {
    var items = document.querySelectorAll("[data-cat]");
    filterBar.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filterBar.querySelectorAll("[data-filter]").forEach(function (b) { b.removeAttribute("aria-current"); });
        btn.setAttribute("aria-current", "true");
        items.forEach(function (it) {
          var show = cat === "all" || it.getAttribute("data-cat") === cat;
          it.classList.toggle("hide", !show);
        });
      });
    });
  }

  /* ---------------- Contact form (static → WhatsApp / email) ---------------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var WA = form.getAttribute("data-whatsapp") || "";       // digits only
    var MAIL = form.getAttribute("data-email") || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isAr = root.getAttribute("lang") === "ar";
      var f = form.elements;
      var name = (f.name && f.name.value || "").trim();
      var phone = (f.phone && f.phone.value || "").trim();
      var msg = (f.message && f.message.value || "").trim();
      var L = isAr
        ? { subj: "طلب استشارة — فاينل ديكور", n: "الاسم", p: "الهاتف", m: "الرسالة", ok: "يتم فتح واتساب…" }
        : { subj: "Project enquiry — Final Decor", n: "Name", p: "Phone", m: "Message", ok: "Opening WhatsApp…" };
      var body =
        L.n + ": " + name + "\n" +
        L.p + ": " + phone + "\n" +
        L.m + ": " + msg;
      var note = form.querySelector("[data-form-note]");
      var choice = form.getAttribute("data-method") || "whatsapp";
      if (choice === "whatsapp" && WA) {
        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(L.subj + "\n\n" + body), "_blank");
      } else {
        window.location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(L.subj) + "&body=" + encodeURIComponent(body);
      }
      if (note) { note.textContent = L.ok; note.style.display = "block"; }
    });
    // Method switch buttons
    form.querySelectorAll("[data-set-method]").forEach(function (b) {
      b.addEventListener("click", function () {
        form.setAttribute("data-method", b.getAttribute("data-set-method"));
        form.querySelectorAll("[data-set-method]").forEach(function (x) { x.removeAttribute("aria-current"); });
        b.setAttribute("aria-current", "true");
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
