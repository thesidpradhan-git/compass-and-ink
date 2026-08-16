(function () {
  var content = document.querySelector(".post-content");
  var toc = document.getElementById("toc");
  var wrap = document.querySelector(".post-toc-wrap");
  if (!content || !toc || !wrap) return;

  var headings = content.querySelectorAll("h2, h3");
  if (headings.length < 3) {
    wrap.remove();
    return;
  }

  var list = document.createElement("ul");
  headings.forEach(function (heading) {
    if (!heading.id) return;
    var li = document.createElement("li");
    li.className = "toc__item toc__item--" + heading.tagName.toLowerCase();
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    li.appendChild(link);
    list.appendChild(li);
  });
  toc.innerHTML = "";
  var label = document.createElement("p");
  label.className = "toc__label";
  label.textContent = "Contents";
  toc.appendChild(label);
  toc.appendChild(list);

  var links = list.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.remove("is-active");
          });
          var active = list.querySelector('a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    headings.forEach(function (heading) {
      if (heading.id) observer.observe(heading);
    });
  }
})();
