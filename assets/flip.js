(function () {
  var books = {
    revit: { n: 11, label: "Revit & CAD", pdf: "/Revit-CAD-Portfolio.pdf" },
    viz: { n: 12, label: "3D Visualization", pdf: "/Visualization-Portfolio.pdf" }
  };
  var flip = document.getElementById("flip");
  if (!flip) return;
  var stage = document.getElementById("flipstage");
  var count = document.getElementById("flipcount");
  var prev = document.getElementById("flipprev");
  var next = document.getElementById("flipnext");
  var fs = document.getElementById("flipfs");
  var dl = document.getElementById("flipdl");
  var tabs = document.querySelectorAll("[data-book]");
  var key = "revit", pages = [], idx = 0, busy = false, DUR = 850;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) DUR = 1;

  function track(name, data) {
    try { if (window.umami && window.umami.track) window.umami.track(name, data); } catch (e) {}
  }
  function src(i) { return "/img/pf/" + key + "-" + (i < 10 ? "0" : "") + i + ".jpg"; }
  function z(i) { return i < idx ? i : books[key].n - i + 1; }

  function build(k, startAt) {
    key = k; idx = 0; busy = false;
    stage.innerHTML = ""; pages = [];
    var n = books[k].n;
    for (var i = 1; i <= n; i++) {
      var d = document.createElement("div");
      d.className = "pg";
      var im = document.createElement("img");
      im.alt = books[k].label + " portfolio, page " + i + " of " + n;
      im.decoding = "async";
      if (i <= 2) im.src = src(i); else im.setAttribute("data-src", src(i));
      im.draggable = false;
      d.appendChild(im);
      d.style.zIndex = n - i + 1;
      stage.appendChild(d); pages.push(d);
    }
    dl.href = books[k].pdf;
    dl.textContent = "Download " + books[k].label + " PDF";
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-book") === k;
      t.classList.toggle("on", on); t.setAttribute("aria-selected", on ? "true" : "false");
    });
    update();
  }

  function load(i) {
    for (var j = i; j <= i + 2 && j < pages.length; j++) {
      var im = pages[j].firstChild;
      if (im && !im.src && im.getAttribute("data-src")) im.src = im.getAttribute("data-src");
    }
  }
  function update() {
    count.textContent = (idx + 1) + " / " + books[key].n;
    prev.disabled = idx === 0; next.disabled = idx === books[key].n - 1;
    load(idx);
  }
  function go(dir) {
    if (busy) return;
    var n = books[key].n;
    if (dir > 0 && idx < n - 1) {
      var p = pages[idx]; busy = true;
      p.style.zIndex = 1000; p.classList.add("turned"); idx++; update();
      setTimeout(function () { p.style.zIndex = idx > 0 ? idx : 1; fixZ(); busy = false; }, DUR);
      track("portfolio-flip", { book: key, page: idx + 1 });
    } else if (dir < 0 && idx > 0) {
      var q = pages[idx - 1]; busy = true;
      q.style.zIndex = 1000; q.classList.remove("turned"); idx--; update();
      setTimeout(function () { fixZ(); busy = false; }, DUR);
    }
  }
  function fixZ() {
    var n = books[key].n;
    pages.forEach(function (p, i) { p.style.zIndex = i < idx ? i + 1 : n - i + 1; });
  }

  prev.addEventListener("click", function () { go(-1); });
  next.addEventListener("click", function () { go(1); });
  stage.addEventListener("click", function (e) {
    var r = stage.getBoundingClientRect();
    go(e.clientX - r.left > r.width / 2 ? 1 : -1);
  });
  flip.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") { go(1); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { go(-1); e.preventDefault(); }
  });
  var sx = null;
  stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); e.preventDefault(); }
  });
  fs.addEventListener("click", function () {
    var el = flip;
    if (document.fullscreenElement) { document.exitFullscreen(); }
    else if (el.requestFullscreen) { el.requestFullscreen(); }
  });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      var k = t.getAttribute("data-book");
      if (k !== key) { build(k); track("portfolio-tab", { book: k }); }
    });
  });
  var q = (location.hash || "").replace("#", "");
  build(books[q] ? q : "revit");
})();
