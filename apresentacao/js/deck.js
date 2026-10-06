/* Portal Engelec — apresentação
   Navegação, escala do palco 16:9, moldura dos slides e modelos dos mockups.
   Sem dependências externas. */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var slides = Array.prototype.slice.call(stage.querySelectorAll(".slide"));
  var total = slides.length;
  var ctrl = document.getElementById("ctrl");
  var ctrlNum = document.getElementById("ctrl-num");
  var progress = stage.querySelector(".progress");
  var current = -1;
  var pad = function (n) { return String(n).padStart(2, "0"); };

  /* ---------- Movimento: desligado para impressão e movimento reduzido ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var params = new URLSearchParams(location.search);
  var isStatic = params.has("static");
  function setMotion(on) { document.documentElement.classList.toggle("motion", on && !reduce.matches && !isStatic); }
  if (isStatic) document.documentElement.classList.add("is-static");
  setMotion(true);
  window.addEventListener("beforeprint", function () { setMotion(false); });
  window.addEventListener("afterprint", function () { setMotion(true); });

  /* ---------- Modelos compartilhados dos mockups ---------- */
  function tpl(id) { return document.getElementById(id).content.firstElementChild.cloneNode(true); }

  stage.querySelectorAll("[data-win]").forEach(function (win) {
    var bar = tpl("tpl-winbar");
    if (win.dataset.url) bar.querySelector("[data-url]").textContent = win.dataset.url;
    win.insertBefore(bar, win.firstChild);
  });
  stage.querySelectorAll("[data-side]").forEach(function (slot) {
    var side = tpl("tpl-side");
    var on = side.querySelector('[data-k="' + slot.dataset.side + '"]');
    if (on) on.classList.add("is-on");
    side.querySelector("[data-av]").textContent = slot.dataset.av || "";
    side.querySelector("[data-role]").textContent = slot.dataset.role || "";
    if (slot.dataset.count) {
      side.querySelector('[data-k="solicitacoes"]').insertAdjacentHTML("beforeend", '<span class="count">' + slot.dataset.count + "</span>");
    }
    slot.replaceWith(side);
  });
  stage.querySelectorAll("[data-top]").forEach(function (slot) {
    var top = tpl("tpl-top");
    var parts = slot.dataset.top.split("|");
    var crumb = top.querySelector("[data-crumb]");
    parts.forEach(function (p, i) {
      if (i) crumb.insertAdjacentHTML("beforeend", "<span>/</span>");
      var el = document.createElement(i === parts.length - 1 ? "b" : "span");
      if (/^[A-Z]{3}-\d{4}-\d{4}$/.test(p)) el.className = "mono";
      el.textContent = p;
      crumb.appendChild(el);
    });
    slot.replaceWith(top);
  });

  /* ---------- Moldura de cada slide (logo, trilha da jornada, atendimento, número, rodapé) ---------- */
  var STAGES = ["Site", "Solicitação", "Orçamento", "Proposta", "Projeto", "Equipamentos", "Documentação", "QR Code"];
  slides.forEach(function (s, i) {
    var top = document.createElement("header");
    top.className = "s-top";
    var trail = "";
    if (s.dataset.stage !== undefined) {
      var now = parseInt(s.dataset.stage, 10);
      trail = '<nav class="s-trail" aria-label="Etapa da jornada">' + STAGES.map(function (name, k) {
        return '<span class="' + (k < now ? "is-past" : k === now ? "is-now" : "") + '">' + name + "</span>";
      }).join("") + "</nav>";
    }
    var kase = s.dataset.case ? '<span class="s-case">' + s.dataset.case + "</span>" : "";
    top.innerHTML =
      '<span class="s-logo"><img src="assets/marca/logo-engelec.png" alt="Engelec"></span>' + trail +
      '<span class="s-right">' + kase + '<span class="s-num"><b>' + pad(i + 1) + "</b> / " + pad(total) + "</span></span>";
    s.appendChild(top);
    if (s.hasAttribute("data-plate")) s.classList.add("has-plate");

    var foot = s.hasAttribute("data-foot") ? s.getAttribute("data-foot") : "ROC7 Soluções Digitais";
    if (foot) {
      var f = document.createElement("footer");
      f.className = "s-foot";
      f.textContent = foot;
      s.appendChild(f);
    }
  });

  /* ---------- Escala do palco ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.setProperty("--scale", s);
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Navegação ---------- */
  function go(n, fromHash) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === current) return;
    slides.forEach(function (s, i) {
      var on = i === n;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    current = n;
    ctrlNum.textContent = pad(n + 1) + " / " + pad(total);
    ctrl.querySelector('[data-go="prev"]').disabled = n === 0;
    ctrl.querySelector('[data-go="next"]').disabled = n === total - 1;
    progress.style.setProperty("--p", (n + 1) / total);
    if (!fromHash) history.replaceState(null, "", "#/" + (n + 1));
  }
  function fromHash() {
    var m = /#\/(\d+)/.exec(location.hash);
    return m ? parseInt(m[1], 10) - 1 : 0;
  }
  window.addEventListener("hashchange", function () { go(fromHash(), true); });

  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
  }

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter":
        e.preventDefault(); go(current + 1); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace":
        e.preventDefault(); go(current - 1); break;
      case "Home": e.preventDefault(); go(0); break;
      case "End": e.preventDefault(); go(total - 1); break;
      case "f": case "F": e.preventDefault(); toggleFs(); break;
      default: return;
    }
    poke();
  });

  ctrl.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var a = b.dataset.go;
    if (a === "prev") go(current - 1);
    else if (a === "next") go(current + 1);
    else if (a === "fs") toggleFs();
    b.blur();
  });

  // Deslizar (touch)
  var tx = null, ty = null;
  document.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; poke(); }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
    tx = ty = null;
  }, { passive: true });

  // Controles discretos: aparecem com movimento do mouse e somem após 2,5 s
  var hideT;
  function poke() {
    ctrl.classList.add("is-visible");
    clearTimeout(hideT);
    hideT = setTimeout(function () { ctrl.classList.remove("is-visible"); }, 2500);
  }
  document.addEventListener("mousemove", poke);

  go(fromHash(), true);
  history.replaceState(null, "", "#/" + (current + 1));
})();
