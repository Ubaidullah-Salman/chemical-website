(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".product-slider").forEach(function (slider) {
    var frame = slider.querySelector(".slider-images");
    if (!frame) return;
    var imgs = Array.prototype.slice.call(frame.querySelectorAll("img"));
    var nav = slider.querySelector(".slider-nav");
    var prev = slider.querySelector(".slider-arrow.prev");
    var next = slider.querySelector(".slider-arrow.next");
    var timer = null;

    if (imgs.length <= 1) {
      if (nav) nav.hidden = true;
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      if (imgs.length === 1) imgs[0].classList.add("active");
      return;
    }

    var index = 0;
    var sliderFrame = slider.querySelector(".slider-frame");
    var badge = slider.querySelector(".slider-counter");
    if (!badge && sliderFrame) {
      badge = document.createElement("span");
      badge.className = "slider-counter";
      badge.setAttribute("aria-hidden", "true");
      sliderFrame.appendChild(badge);
    }

    function show(n) {
      index = (n + imgs.length) % imgs.length;
      frame.style.transform = "translateX(" + (-index * 100) + "%)";
      imgs.forEach(function (img, i) {
        var on = i === index;
        img.classList.toggle("active", on);
        if (on) img.removeAttribute("aria-hidden");
        else img.setAttribute("aria-hidden", "true");
      });
      if (nav) {
        Array.prototype.forEach.call(nav.children, function (dot, i) {
          var on = i === index;
          dot.classList.toggle("active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
        });
      }
      if (badge) badge.textContent = (index + 1) + " / " + imgs.length;
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function start() {
      if (reduce) return;
      stop();
      timer = setInterval(function () { show(index + 1); }, 3500);
    }

    if (nav) {
      nav.innerHTML = "";
      imgs.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + imgs.length);
        dot.addEventListener("click", function (e) {
          e.stopPropagation();
          show(i);
          start();
        });
        nav.appendChild(dot);
      });
      nav.hidden = false;
    }

    if (prev) {
      prev.hidden = false;
      prev.addEventListener("click", function (e) {
        e.stopPropagation();
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.hidden = false;
      next.addEventListener("click", function (e) {
        e.stopPropagation();
        show(index + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    var touchX = null;
    slider.addEventListener("touchstart", function (event) {
      touchX = event.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    slider.addEventListener("touchend", function (event) {
      if (touchX == null) return;
      var dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 35) show(index + (dx < 0 ? 1 : -1));
      start();
    }, { passive: true });

    show(index);
    start();
  });
})();
