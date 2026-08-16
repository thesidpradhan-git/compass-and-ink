(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  function addTilt(el, max, lift) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (0.5 - py) * max;
      var ry = (px - 0.5) * max;
      el.style.transition = "none";
      el.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(" + lift + "px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transition = "transform 0.5s ease";
      el.style.transform = "";
      setTimeout(function () {
        el.style.transition = "";
      }, 500);
    });
  }

  document.querySelectorAll(".post-card__link").forEach(function (el) {
    addTilt(el, 7, -4);
  });
  document.querySelectorAll(".author-intro__mark").forEach(function (el) {
    addTilt(el, 16, 0);
  });
})();
