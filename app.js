/* Shehryar Prints & Gifts — shared logic. Products and prices live in data.js. */
(function (root) {
  "use strict";
  var D = root.__DATA__;
  var SITE = D.SITE, COLLECTIONS = D.COLLECTIONS, PRODUCTS = D.PRODUCTS;

  /* ---------- pure helpers (also used by tests) ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return n == null ? "Price confirmed on WhatsApp" : "Rs. " + Number(n).toLocaleString("en-US"); }
  function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function search(q, c) {
    q = (q || "").toLowerCase().trim();
    return PRODUCTS.filter(function (p) {
      var cn = (COLLECTIONS.filter(function (x) { return x.id === p.collection; })[0] || {}).name || "";
      return (!c || p.collection === c) && (!q || (p.name + " " + p.desc + " " + cn).toLowerCase().indexOf(q) > -1);
    });
  }
  function itemKey(id, opts) { return id + "|" + Object.keys(opts).sort().map(function (k) { return k + "=" + opts[k]; }).join(";"); }
  function totals(cart) {
    var sub = 0, pending = 0, count = 0;
    cart.forEach(function (it) {
      var p = find(it.id); if (!p) return;
      count += it.qty;
      if (p.price == null) pending += it.qty; else sub += p.price * it.qty;
    });
    return { subtotal: sub, pending: pending, count: count, total: pending ? null : sub };
  }
  function validPhone(s) {
    var d = String(s || "").replace(/[\s\-()]/g, "");
    return /^(\+?92|0)3\d{9}$/.test(d);
  }
  function validate(c) {
    var e = {};
    if (!c.name || c.name.trim().length < 2) e.name = "Enter your name.";
    if (!validPhone(c.phone)) e.phone = "Enter a Pakistani mobile number, like 0300 1234567.";
    if (!c.city || !c.city.trim()) e.city = "Enter your city.";
    if (!c.address || c.address.trim().length < 8) e.address = "Enter your full delivery address.";
    return e;
  }
  function waLink(text) { return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text); }
  function orderMessage(cart, c) {
    var t = totals(cart), L = [];
    L.push("Assalam o Alaikum! Order request from the " + SITE.collection + " website.", "", "Items:");
    cart.forEach(function (it, i) {
      var p = find(it.id); if (!p) return;
      var line = (i + 1) + ". " + p.name + " (" + p.size + ") x " + it.qty + " - " + (p.price == null ? "price to be confirmed" : money(p.price) + " each = " + money(p.price * it.qty));
      L.push(line);
      Object.keys(it.opts).forEach(function (k) { if (it.opts[k]) L.push("   " + k + ": " + it.opts[k]); });
    });
    L.push("", "Subtotal (priced items): " + money(t.subtotal));
    if (t.pending) L.push(t.pending + " item(s) have a price still to be confirmed.");
    L.push("Estimated total: " + (t.total == null ? "to be confirmed" : money(t.total)) + " + delivery (charge to be confirmed after location check).");
    L.push("", "Name: " + c.name.trim(), "Phone: " + c.phone.trim(), "City: " + c.city.trim(), "Address: " + c.address.trim());
    if (c.notes && c.notes.trim()) L.push("Notes: " + c.notes.trim());
    L.push("", "I will send my photos here on WhatsApp after you confirm. Please confirm availability, final price and delivery time.");
    return L.join("\n");
  }
  function customMessage(f) {
    var L = ["Assalam o Alaikum! Custom print request from the " + SITE.collection + " website.", "",
      "Product: " + f.type, "Photos: " + (f.photos || "not sure yet"), "Text on print: " + (f.text || "none"), "Occasion: " + (f.occasion || "not specified"),
      "Needed by: " + (f.date || "no fixed date"), "Notes: " + (f.notes || "none"), "", "Name: " + f.name.trim(), "Phone: " + f.phone.trim(),
      "", "I will send my photos here on WhatsApp after we discuss the details."];
    return L.join("\n");
  }
    /* ---------- sample mockups (local files, see data.js ids) ---------- */
  function art(p) {
    return '<img src="' + esc(p.img || "m-" + p.id + ".svg") + '" alt="Sample mockup: ' + esc(p.name) + '" width="800" height="1000" loading="lazy" decoding="async">';
  }
  function card(p) {
    return '<a class="card" href="product.html?id=' + encodeURIComponent(p.id) + '"><div class="sheet">' + art(p) + '<span class="tag">Sample design</span></div><h3>' + esc(p.name) + '</h3><p class="price">' + money(p.price) + '</p></a>';
  }
  var api = { esc: esc, money: money, find: find, search: search, itemKey: itemKey, totals: totals, validPhone: validPhone, validate: validate, waLink: waLink, orderMessage: orderMessage, customMessage: customMessage, art: art };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  /* ---------- browser only ---------- */
  var mem = [];
  function load() { try { return JSON.parse(localStorage.getItem("shpg_cart") || "[]"); } catch (e) { return mem; } }
  function save(c) { mem = c; try { localStorage.setItem("shpg_cart", JSON.stringify(c)); } catch (e) { } updateBadge(); }
  function updateBadge() { var b = document.getElementById("cartCount"); if (b) b.textContent = totals(load()).count; }
  function $(s) { return document.querySelector(s); }
  function add(id, opts, qty) {
    var c = load(), k = itemKey(id, opts), x = c.filter(function (i) { return i.key === k; })[0];
    if (x) x.qty = Math.min(99, x.qty + qty); else c.push({ key: k, id: id, opts: opts, qty: qty });
    save(c);
  }
  function layout() {
    var q = new URLSearchParams(location.search).get("q") || "";
    document.body.insertAdjacentHTML("afterbegin",
      '<a class="skip" href="#main">Skip to content</a><header class="top">' +
      '<button class="menu" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"><i></i><i></i><i></i></button>' +
      '<a class="wordmark" href="index.html"><b>SHEHRYAR PRINTS &amp; GIFTS</b><small>Personalised Prints \u2022 Thoughtful Gifts</small></a>' +
      '<a class="cartlink" href="cart.html">Cart <b id="cartCount">0</b></a>' +
      '<nav id="nav" aria-label="Main"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="custom.html">Custom print</a><a href="contact.html">Contact</a>' +
      '<form class="search" action="shop.html" role="search"><input type="search" name="q" value="' + esc(q) + '" placeholder="Search prints" aria-label="Search products"><button>Search</button></form></nav></header>');
    var mb = document.querySelector(".menu"), hd = document.querySelector(".top");
    mb.addEventListener("click", function () { var o = hd.classList.toggle("open"); mb.setAttribute("aria-expanded", o ? "true" : "false"); });
    var soc = (SITE.instagram ? '<a href="https://instagram.com/' + esc(SITE.instagram) + '" rel="noopener">Instagram</a>' : "") + (SITE.facebook ? '<a href="' + esc(SITE.facebook) + '" rel="noopener">Facebook</a>' : "");
    document.body.insertAdjacentHTML("beforeend",
      '<footer><div class="fb"><p class="wm">SHEHRYAR PRINTS &amp; GIFTS</p><p class="small">Personalised Prints \u2022 Thoughtful Gifts</p><img src="logo-sm.png" width="84" height="73" alt="Shehryar Stationery logo" loading="lazy"><p class="small">A collection by ' + esc(SITE.name) + ', ' + esc(SITE.area) + '</p></div>' +
      '<div><h4>Contact</h4><a href="' + waLink("Assalam o Alaikum! I have a question about " + SITE.collection + ".") + '">WhatsApp ' + esc(SITE.phoneDisplay) + '</a>' + soc + '<p class="small">' + esc(SITE.area) + '</p></div>' +
      '<div><h4>Shop</h4><a href="shop.html">All prints</a><a href="shop.html?c=custom-prints">Custom Prints</a><a href="shop.html?c=original-posters">Original Posters</a><a href="custom.html">Custom print request</a></div>' +
      '<div><h4>Help</h4><a href="about.html">About us</a><a href="faq.html">FAQ</a><a href="shipping.html">Shipping</a><a href="returns.html">Returns and refunds</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div></footer>');
    updateBadge();
  }
  var FAQ = [
    ["How do I order?", "Add items to your cart and tap the WhatsApp button. We reply to confirm the price, time and delivery before anything is printed."],
    ["Does sending the WhatsApp message confirm my order?", "No. The order is only accepted once we reply and confirm it. Nothing is saved on this website."],
    ["How do I send my photos?", "After we discuss your order on WhatsApp, send the photos in the same chat. The website never collects or stores photos."],
    ["Where do you deliver?", "Karachi only for now. The delivery charge is told after we confirm your order and location."],
    ["How do I pay?", "We tell you the payment method on WhatsApp when we confirm. The website takes no payment and no card details."],
    ["What sizes do you print?", "A4 only for now."]
  ];
  var PAGES = {
    about: ["About us", "<p>Shehryar Stationery is a shop in " + esc(SITE.area) + " selling stationery, toys, gifts, decoration items, colour printing and photocopy services.</p><p>" + esc(SITE.collection) + " is our new made-to-order collection: A4 photo collages and original quote posters, printed after your order is confirmed.</p>"],
    contact: ["Contact us", "<p>The fastest way to reach us is WhatsApp.</p><p><a class=\"btn\" href=\"" + waLink("Assalam o Alaikum! I have a question about " + SITE.collection + ".") + "\">Message us on WhatsApp</a></p><p>Shop: " + esc(SITE.area) + "</p>"],
    faq: ["Frequently asked questions", FAQ.map(function (f) { return "<details><summary>" + esc(f[0]) + "</summary><p>" + esc(f[1]) + "</p></details>"; }).join("")],
    shipping: ["Shipping policy", "<p>" + esc(D.SHIPPING_INFO) + "</p><p>We do not deliver outside Karachi yet. Production time is confirmed on WhatsApp for each order.</p><p><em>Draft policy: review and edit it before you rely on it.</em></p>"],
    returns: ["Returns and refund policy", "<p>Prints are made to order from your photos and text, so we cannot take them back for a change of mind.</p><p>If your print arrives damaged or is not what we agreed on WhatsApp, message us the same day with a photo and we will reprint it or sort it out with you.</p><p><em>Draft policy: review and edit it before you rely on it.</em></p>"],
    privacy: ["Privacy policy", "<p>This website has no accounts, no database and no payment form. What you type into the cart form is used only to write your WhatsApp message in your own browser. We do not collect or store your photos on this site.</p><p>Your cart is kept in your browser so it is still there if you come back. When you send a WhatsApp message, WhatsApp handles it under its own terms, and we see your number and what you send us.</p><p><em>Draft policy: review and edit it before you rely on it.</em></p>"],
    terms: ["Terms and conditions", "<p>An order is accepted only when we confirm it on WhatsApp. Prices and delivery charges are confirmed there.</p><p>By sending us photos or text you confirm you have the right to use them, and that you are happy for us to print them for your order.</p><p>We may refuse content that is unlawful or that we are not allowed to print.</p><p><em>Draft policy: review and edit it before you rely on it.</em></p>"]
  };
  var page = document.body.dataset.page;
  layout();
  var m = document.getElementById("main");
  function chips(sel) {
    return '<div class="chips"><a href="shop.html" class="' + (!sel ? "on" : "") + '">All</a>' + COLLECTIONS.map(function (c) { return '<a href="shop.html?c=' + c.id + '" class="' + (sel === c.id ? "on" : "") + '">' + esc(c.name) + '</a>'; }).join("") + "</div>";
  }
  if (PAGES[page]) { m.innerHTML = "<h1>" + PAGES[page][0] + "</h1>" + PAGES[page][1]; document.title = PAGES[page][0] + " | " + SITE.name; }
  if (page === "home") {
    m.innerHTML =
      '<section class="hero"><div class="ht"><img class="mark" src="logo-sm.png" width="76" height="66" alt="Shehryar Stationery logo"><h1>Make Your Memories Wall-Worthy.</h1><p>Personalised A4 photo collages, name posters and original quote prints, made to order in Karachi and ready for the wall or a thoughtful gift.</p><p><a class="btn" href="#collection">Explore Collection</a></p><p class="small">' + esc(SITE.announcement) + '</p></div><div class="hi"><img src="m-hero.svg" width="800" height="1000" alt="Sample mockup: framed photo collage and name poster" fetchpriority="high"></div></section>' +
      '<section id="collection"><h2>The Collection</h2><div class="chips"><a href="shop.html?c=custom-prints">Custom Prints</a><a href="shop.html?c=original-posters">Original Posters</a><a href="shop.html">View all</a></div><div class="grid">' + PRODUCTS.map(card).join("") + '</div><p class="small">Images are illustrative sample designs, not customer orders.</p></section>' +
      '<section class="cream order"><h2>Order a custom print</h2><p>Tell us what you have in mind. We confirm the price and time with you on WhatsApp, then you send your photos in the same chat.</p><p><a class="btn" href="' + waLink("Assalam o Alaikum! I would like to order a print from " + SITE.collection + ".") + '">Order on WhatsApp</a> <a class="btn alt" href="custom.html">Fill the request form</a></p></section>' +
      '<section><h2>How it works</h2><ol class="steps"><li>Choose a print and add it to your cart.</li><li>Send your order request on WhatsApp.</li><li>We confirm price, time and delivery, then you send your photos there.</li><li>We print it and deliver it in Karachi.</li></ol></section>';
  }
  if (page === "shop") {
    var u = new URLSearchParams(location.search), c = u.get("c") || "", q = u.get("q") || "", col = COLLECTIONS.filter(function (x) { return x.id === c; })[0], r = search(q, col ? c : "");
    document.title = (col ? col.name : "Shop all") + " | " + SITE.name;
    m.innerHTML = "<h1>" + esc(col ? col.name : "Shop all prints") + "</h1>" + (col ? "<p>" + esc(col.blurb) + "</p>" : "") + chips(col ? c : "") + '<p class="small" aria-live="polite">' + r.length + " item(s)" + (q ? ' for "' + esc(q) + '"' : "") + "</p>" +
      (r.length ? '<div class="grid">' + r.map(card).join("") + "</div>" : '<p>Nothing matches. <a href="shop.html">See all prints</a> or <a href="custom.html">send a custom request</a>.</p>');
  }
  if (page === "product") {
    var p = find(new URLSearchParams(location.search).get("id"));
    if (!p) { m.innerHTML = '<h1>Product not found</h1><p><a href="shop.html">Back to the shop</a></p>'; }
    else {
      document.title = p.name + " | " + SITE.name;
      m.innerHTML = '<div class="pdp"><div class="sheet big">' + art(p) + '<span class="tag">Sample design</span></div><div><h1>' + esc(p.name) + '</h1><p class="price">' + money(p.price) + '</p><p>' + esc(p.desc) + '</p>' +
        '<form id="pf"><label>Size<select disabled><option>' + esc(p.size) + '</option></select></label>' +
        p.fields.map(function (f, i) { return '<label>' + esc(f.label) + '<input name="f' + i + '" type="text" maxlength="80"' + (f.required ? " required" : "") + "></label>"; }).join("") +
        '<label>Quantity<input id="qty" type="number" min="1" max="99" value="1"></label><p id="pe" class="err" role="alert"></p><button class="btn" type="submit">Add to cart</button></form>' +
        '<ul class="facts"><li>Availability: ' + esc(p.availability) + '</li><li>Production time: ' + esc(p.productionTime) + '</li><li>Delivery: ' + esc(D.SHIPPING_INFO) + '</li><li>Photos: send them on WhatsApp after we confirm. The site never stores photos.</li></ul></div></div>';
      $("#pf").addEventListener("submit", function (e) {
        e.preventDefault();
        var q2 = parseInt($("#qty").value, 10);
        if (!(q2 >= 1 && q2 <= 99)) { $("#pe").textContent = "Quantity must be between 1 and 99."; return; }
        var o = {}; p.fields.forEach(function (f, i) { o[f.key] = (e.target.elements["f" + i].value || "").trim(); });
        var miss = p.fields.filter(function (f) { return f.required && !o[f.key]; });
        if (miss.length) { $("#pe").textContent = "Please fill in: " + miss[0].label + "."; return; }
        add(p.id, o, q2); location.href = "cart.html";
      });
    }
  }
  if (page === "cart") {
    var render = function () {
      var c = load().filter(function (i) { return find(i.id); }), t = totals(c);
      if (!c.length) { m.innerHTML = '<h1>Your cart</h1><p>Your cart is empty. <a href="shop.html">Browse prints</a></p>'; return; }
      m.innerHTML = "<h1>Your cart</h1>" + c.map(function (it, i) {
        var p = find(it.id);
        return '<div class="line"><div><b>' + esc(p.name) + '</b><div class="small">' + Object.keys(it.opts).filter(function (k) { return it.opts[k]; }).map(function (k) { return esc(k) + ": " + esc(it.opts[k]); }).join("<br>") + '</div></div><div class="q"><button data-a="m" data-i="' + i + '" aria-label="Decrease quantity">-</button><span>' + it.qty + '</span><button data-a="p" data-i="' + i + '" aria-label="Increase quantity">+</button><button data-a="r" data-i="' + i + '">Remove</button></div><div>' + (p.price == null ? "Price confirmed on WhatsApp" : money(p.price * it.qty)) + "</div></div>";
      }).join("") +
        '<div class="sum"><p>Subtotal (priced items): <b>' + money(t.subtotal) + "</b></p>" + (t.pending ? "<p>" + t.pending + " item(s) have the price confirmed on WhatsApp.</p>" : "") + "<p>Estimated total: <b>" + (t.total == null ? "to be confirmed" : money(t.total)) + "</b> + delivery (charge told after location check)</p></div>" +
        '<form id="cf" novalidate><h2>Your details</h2><label>Name<input name="name" autocomplete="name"></label><span class="err" data-e="name"></span><label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="03XX XXXXXXX"></label><span class="err" data-e="phone"></span><label>City<input name="city" value="Karachi"></label><span class="err" data-e="city"></span><label>Delivery address<textarea name="address" rows="3"></textarea></label><span class="err" data-e="address"></span><label>Customization notes<textarea name="notes" rows="2"></textarea></label>' +
        '<p class="small">Sending this message does not confirm your order. We reply to confirm price, time and delivery. Send your photos in the WhatsApp chat after that. Delivery is Karachi only for now. Your details are not saved on this website.</p><button class="btn" type="submit">Send order request on WhatsApp</button></form>';
      m.querySelectorAll("[data-a]").forEach(function (b) {
        b.onclick = function () {
          var cart = load(), i = +b.dataset.i, a = b.dataset.a;
          if (a === "p") cart[i].qty = Math.min(99, cart[i].qty + 1);
          if (a === "m") cart[i].qty = Math.max(1, cart[i].qty - 1);
          if (a === "r") cart.splice(i, 1);
          save(cart); render();
        };
      });
      $("#cf").addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target, v = { name: f.elements.name.value, phone: f.elements.phone.value, city: f.elements.city.value, address: f.elements.address.value, notes: f.elements.notes.value }, er = validate(v);
        f.querySelectorAll("[data-e]").forEach(function (s) { s.textContent = er[s.dataset.e] || ""; });
        if (Object.keys(er).length) { var fe = f.querySelector(".err:not(:empty)"); if (fe && fe.scrollIntoView) fe.scrollIntoView(); return; }
        window.open(waLink(orderMessage(load(), v)), "_blank", "noopener");
      });
    };
    render();
  }
  if (page === "custom") {
    m.innerHTML = '<h1>Custom print request</h1><p>Tell us what you want. We reply on WhatsApp. Do not upload photos here; send them in the chat after we reply.</p><form id="uf" novalidate><label>Product<select name="type">' + PRODUCTS.map(function (p) { return "<option>" + esc(p.name) + "</option>"; }).join("") + '<option>Something else (describe in notes)</option></select></label><label>Number of photos<input name="photos" inputmode="numeric"></label><label>Text on print<input name="text"></label><label>Occasion<input name="occasion"></label><label>Needed by<input name="date" placeholder="e.g. 25 October"></label><label>Notes<textarea name="notes" rows="3"></textarea></label><label>Your name<input name="name"></label><span class="err" data-e="name"></span><label>Your phone<input name="phone" type="tel"></label><span class="err" data-e="phone"></span><button class="btn" type="submit">Send request on WhatsApp</button></form>';
    $("#uf").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, v = { type: f.elements.type.value, photos: f.elements.photos.value, text: f.elements.text.value, occasion: f.elements.occasion.value, date: f.elements.date.value, notes: f.elements.notes.value, name: f.elements.name.value, phone: f.elements.phone.value }, er = validate({ name: v.name, phone: v.phone, city: "x", address: "xxxxxxxx" });
      f.querySelectorAll("[data-e]").forEach(function (s) { s.textContent = er[s.dataset.e] || ""; });
      if (er.name || er.phone) return;
      window.open(waLink(customMessage(v)), "_blank", "noopener");
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
