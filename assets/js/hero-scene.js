(function () {
  var canvas = document.getElementById("hero-scene");
  if (!canvas || typeof THREE === "undefined") return;

  var hero = canvas.closest(".hero");
  if (!hero) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
  camera.position.set(0, 1.5, 11);
  camera.rotation.x = -0.06;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);

  var gateMaterial = new THREE.MeshBasicMaterial({ color: cssVar("--color-travel", "#a8402c") });
  var groundMaterial = new THREE.MeshBasicMaterial({
    color: cssVar("--color-line-strong", "#b19c6c"),
    transparent: true,
    opacity: 0.4,
  });

  function updateColors() {
    gateMaterial.color.set(cssVar("--color-travel", "#a8402c"));
    groundMaterial.color.set(cssVar("--color-line-strong", "#b19c6c"));
    scene.fog.color.set(cssVar("--color-bg", "#ece0c4"));
  }

  scene.fog = new THREE.Fog(cssVar("--color-bg", "#ece0c4"), 7, 24);

  var POST_HALF_H = 1.7;

  function makeGate() {
    var group = new THREE.Group();
    var postGeo = new THREE.BoxGeometry(0.15, POST_HALF_H * 2, 0.15);
    var postL = new THREE.Mesh(postGeo, gateMaterial);
    postL.position.set(-1.1, 0, 0);
    var postR = new THREE.Mesh(postGeo, gateMaterial);
    postR.position.set(1.1, 0, 0);
    var kasagiGeo = new THREE.BoxGeometry(2.7, 0.2, 0.2);
    var kasagi = new THREE.Mesh(kasagiGeo, gateMaterial);
    kasagi.position.set(0, 1.85, 0);
    var nukiGeo = new THREE.BoxGeometry(2.25, 0.13, 0.13);
    var nuki = new THREE.Mesh(nukiGeo, gateMaterial);
    nuki.position.set(0, 1.2, 0);
    group.add(postL, postR, kasagi, nuki);
    return group;
  }

  var count = 16;
  var spacing = 1.4;
  for (var i = 0; i < count; i++) {
    var gate = makeGate();
    gate.position.z = -i * spacing;
    gate.position.x = Math.sin(i * 0.6) * 0.06;
    gate.rotation.y = Math.sin(i * 0.9) * 0.012;
    scene.add(gate);
  }

  var groundGeo = new THREE.PlaneGeometry(5, count * spacing + 12);
  var ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -POST_HALF_H, -((count * spacing) / 2) + 3);
  scene.add(ground);

  var mouseX = 0,
    mouseY = 0,
    targetX = 0,
    targetY = 0;

  function onPointerMove(x, y) {
    mouseX = (x / window.innerWidth) * 2 - 1;
    mouseY = (y / window.innerHeight) * 2 - 1;
  }
  window.addEventListener("mousemove", function (e) {
    onPointerMove(e.clientX, e.clientY);
  });

  function resize() {
    var w = hero.clientWidth;
    var h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTimeout(updateColors, 30);
    });
  }

  var visible = true;
  document.addEventListener("visibilitychange", function () {
    visible = !document.hidden;
    if (visible) requestAnimationFrame(loop);
  });

  function loop() {
    if (!visible) return;
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    camera.position.x = targetX * 0.6;
    camera.rotation.y = -targetX * 0.08;
    camera.position.y = 1.5 - targetY * 0.15;
    renderer.render(scene, camera);
    if (!prefersReducedMotion) requestAnimationFrame(loop);
  }

  renderer.render(scene, camera);
  if (!prefersReducedMotion) requestAnimationFrame(loop);
})();
