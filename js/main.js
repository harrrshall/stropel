(function () {
  const page = (function currentPage() {
    const file = window.location.pathname.split("/").pop();
    if (!file || file.indexOf(".html") === -1) return "index.html";
    return file;
  })();

  const mark = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="4" fill="#1F2328"/><rect x="5" y="12" width="22" height="8" rx="1.5" fill="#6B3F2A"/><rect x="5" y="12" width="22" height="2" fill="#8A5340"/><path d="M4 16.5 L26 14.2 L28 16.5 L26 18.8 Z" fill="#D8D3CC"/></svg>`;

  function navItem(href, label) {
    const file = href.split("#")[0];
    const current = file === page ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${current}>${label}</a></li>`;
  }

  const header = `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="wordmark" href="index.html">${mark}Stropel</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav" id="site-nav">
          <ul class="nav-links">
            ${navItem("product.html", "Product")}
            ${navItem("product.html#integrations", "Integrations")}
            ${navItem("docs.html", "Docs")}
            ${navItem("pricing.html", "Pricing")}
            ${navItem("about.html#edge", "Edge")}
            <li><a class="btn btn-steel" href="pricing.html">Start honing</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="wordmark" href="index.html">${mark}Stropel</a>
            <p class="footer-tag">Hone the agent before the floor hears it.</p>
          </div>
          <div>
            <h3>Platform</h3>
            <ul>
              <li><a href="product.html#simulate">Simulate</a></li>
              <li><a href="product.html#evaluate">Evaluate</a></li>
              <li><a href="product.html#observe">Observe</a></li>
            </ul>
          </div>
          <div>
            <h3>Developers</h3>
            <ul>
              <li><a href="docs.html">Docs</a></li>
              <li><a href="docs.html#api">API</a></li>
              <li><a href="product.html#integrations">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><a href="about.html">About</a></li>
              <li><a href="about.html#careers">Careers</a></li>
              <li><a href="about.html#security">Security</a></li>
              <li><a href="about.html#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="legal-row">
          <div>
            <a href="about.html#privacy">Privacy</a>
            <a href="about.html#terms">Terms</a>
          </div>
          <div>© Stropel. ${new Date().getFullYear()}.</div>
        </div>
      </div>
    </footer>
  `;

  const headerMount = document.getElementById("chrome-header");
  const footerMount = document.getElementById("chrome-footer");
  if (headerMount) headerMount.innerHTML = header;
  if (footerMount) footerMount.innerHTML = footer;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const close = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });
  }

  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-success");
  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.hidden = true;
      success.classList.add("is-visible");
      success.focus();
    });
  }

  const meters = document.querySelectorAll(".ring circle.meter");
  if (meters.length && "IntersectionObserver" in window) {
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          const value = Number(entry.target.getAttribute("data-value") || "0");
          const circ = 2 * Math.PI * 42;
          entry.target.style.strokeDasharray = String(circ);
          entry.target.style.strokeDashoffset = String(circ);
          entry.target.getBoundingClientRect();
          entry.target.style.transition = "stroke-dashoffset 1.1s ease-out";
          entry.target.style.strokeDashoffset = String(circ * (1 - value / 100));
        });
      },
      { threshold: 0.4 }
    );
    meters.forEach(function (el) {
      io.observe(el);
    });
  }
})();
