(function () {
  var books = {
    revit: { n: 11, label: "Revit & CAD", pdf: "/Revit-CAD-Portfolio.pdf" },
    viz: { n: 12, label: "3D Visualization", pdf: "/Visualization-Portfolio.pdf" }
  };
  var flip = document.getElementById("flip");
  if (!flip || !window.St) return;
  var stage = document.getElementById("flipstage");
  var count = document.getElementById("flipcount");
  var prev = document.getElementById("flipprev");
  var next = document.getElementById("flipnext");
  var fs = document.getElementById("flipfs");
  var dl = document.getElementById("flipdl");
  var tabs = document.querySelectorAll("[data-book]");
  var holderEl = null, curW = 0, key = "revit", pf = null, idx = 0, lastTracked = -1, RATIO = 9 / 16, timer = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function track(name, data) {
    try { if (window.umami && window.umami.track) window.umami.track(name, data); } catch (e) {}
  }
  function src(k, i) { return "/img/pf/" + k + "-" + (i < 10 ? "0" : "") + i + ".jpg"; }

  function measure() {
    var cs = getComputedStyle(flip);
    var padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    var W = flip.clientWidth - padX;
    var full = !!document.fullscreenElement;
    if (!full && W > 1400) W = 1400;
    var spread = W >= 900;
    var H = spread ? (W * RATIO) / 2 : W * RATIO;
    if (full) {
      var availH = window.innerHeight - 130;
      if (H > availH) { H = availH; W = spread ? (H * 2) / RATIO : H / RATIO; }
    }
    return { W: Math.floor(W), H: Math.floor(H), spread: spread };
  }

  function build(k, startIdx) {
    if (pf) { try { pf.destroy(); } catch (e) {} pf = null; }
    stage.innerHTML = "";
    key = k;
    var n = books[k].n, m = measure();
    stage.style.width = m.W + "px";
    stage.style.height = m.H + "px";
    var holder = document.createElement("div");
    stage.appendChild(holder);
    var els = [];
    for (var i = 1; i <= n; i++) {
      var d = document.createElement("div");
      d.className = "page";
      var im = document.createElement("img");
      im.alt = books[k].label + " portfolio, page " + i + " of " + n;
      im.draggable = false;
      im.decoding = "async";
      if (i <= 4) im.src = src(k, i); else im.setAttribute("data-src", src(k, i));
      d.appendChild(im);
      holder.appendChild(d);
      els.push(d);
    }
    holderEl = holder; curW = m.W;
    holder.style.transition = "transform .6s ease";
    holder.style.width = m.W + "px";
    holder.style.height = m.H + "px";
    var half = Math.floor(m.W / 2);
    pf = new St.PageFlip(holder, {
      width: 1600, height: 900, size: "stretch",
      minWidth: m.spread ? 120 : half + 2, maxWidth: 4000, minHeight: 60, maxHeight: 4000,
      showCover: true, maxShadowOpacity: 0.55, drawShadow: true,
      flippingTime: reduce ? 1 : (location.search.indexOf("slow") > -1 ? 9000 : 900), usePortrait: true, startPage: startIdx || 0,
      mobileScrollSupport: false, swipeDistance: 25, showPageCorners: true, autoSize: true
    });
    pf.loadFromHTML(els);
    idx = startIdx || 0;
    pf.on("flip", function (e) {
      idx = e.data; update();
      if (idx !== lastTracked) { lastTracked = idx; track("portfolio-flip", { book: key, page: idx + 1 }); }
    });
    pf.on("changeOrientation", update);
    dl.href = books[k].pdf;
    dl.textContent = "Download " + books[k].label + " PDF";
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-book") === k;
      t.classList.toggle("on", on); t.setAttribute("aria-selected", on ? "true" : "false");
    });
    update();
    loadRest(els);
  }

  function loadRest(els) {
    var j = 0;
    (function step() {
      for (; j < els.length; j++) {
        var im = els[j].firstChild;
        if (im && !im.src && im.getAttribute("data-src")) { im.src = im.getAttribute("data-src"); j++; break; }
      }
      if (j < els.length) setTimeout(step, 350);
    })();
  }

  function update() {
    if (!pf) return;
    var n = books[key].n;
    var land = pf.getOrientation() === "landscape";
    var label;
    if (land && idx > 0 && idx + 1 < n) label = (idx + 1) + "–" + (idx + 2);
    else label = String(idx + 1);
    count.textContent = label + " / " + n;
    var shift = 0;
    if (land) { if (idx === 0) shift = -curW / 4; else if (n % 2 === 0 && idx >= n - 1) shift = curW / 4; }
    if (holderEl) holderEl.style.transform = "translateX(" + shift + "px)";
    var last = land ? (n % 2 === 0 ? n - 1 : n - 2) : n - 1;
    prev.disabled = idx <= 0; next.disabled = idx >= last;
  }

  prev.addEventListener("click", function () { if (pf) pf.flipPrev("top"); });
  next.addEventListener("click", function () { if (pf) pf.flipNext("top"); });
  flip.addEventListener("keydown", function (e) {
    if (!pf) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { pf.flipNext("top"); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { pf.flipPrev("top"); e.preventDefault(); }
  });
  fs.addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (flip.requestFullscreen) flip.requestFullscreen();
  });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      var k = t.getAttribute("data-book");
      if (k !== key) { lastTracked = -1; build(k, 0); track("portfolio-tab", { book: k }); }
    });
  });
  function relayout() {
    clearTimeout(timer);
    timer = setTimeout(function () { build(key, idx); }, 220);
  }
  window.addEventListener("resize", relayout);
  document.addEventListener("fullscreenchange", relayout);
  var q = (location.hash || "").replace("#", "");
  build(books[q] ? q : "revit", 0);
})();
