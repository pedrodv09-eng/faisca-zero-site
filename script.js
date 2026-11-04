(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== REVEAL ON SCROLL ===================== */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ===================== HERO PARTICLES ===================== */
  function setupParticles() {
    var container = document.getElementById("heroParticles");
    if (!container || prefersReducedMotion) return;

    var count = window.innerWidth < 600 ? 14 : 24;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      var left = Math.random() * 100;
      var duration = 6 + Math.random() * 8;
      var delay = Math.random() * 8;
      var size = 2 + Math.random() * 4;
      var bottom = Math.random() * 40;

      span.style.left = left + "%";
      span.style.bottom = bottom + "%";
      span.style.width = size + "px";
      span.style.height = size + "px";
      span.style.animationDuration = duration + "s";
      span.style.animationDelay = delay + "s";
      container.appendChild(span);
    }
  }

  /* ===================== COUNT-UP ===================== */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  function setupCounters() {
    var counters = document.querySelectorAll(".stat__number[data-target], .capacidade__seg-valor[data-target]");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ===================== TABELA DE CANAIS (CALCULADA) ===================== */
  function setupTabelaCanais() {
    var corpo = document.getElementById("tabelaCanaisBody");
    if (!corpo) return;

    var receitaTotal = 180; // R$ milhões
    var canais = [
      { nome: "Bares e conveniências", participacao: 0.55, margem: 0.48 },
      { nome: "Supermercados", participacao: 0.30, margem: 0.34 },
      { nome: "Atacarejo", participacao: 0.15, margem: 0.22 }
    ];

    var somaParticipacao = 0;
    var receitaTotalCalculada = 0;
    var lucroTotalCalculado = 0;

    canais.forEach(function (canal) {
      canal.receita = receitaTotal * canal.participacao;
      canal.lucroBruto = canal.receita * canal.margem;
      somaParticipacao += canal.participacao;
      receitaTotalCalculada += canal.receita;
      lucroTotalCalculado += canal.lucroBruto;
    });

    canais.forEach(function (canal) {
      canal.percentualDoLucro = (canal.lucroBruto / lucroTotalCalculado) * 100;
    });

    function fmtMoeda(v) {
      return v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    function fmtPct(v, casas) {
      return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + "%";
    }

    var html = "";
    canais.forEach(function (canal) {
      html +=
        '<tr>' +
        '<th scope="row">' + canal.nome + "</th>" +
        "<td>" + fmtPct(canal.participacao * 100, 0) + "</td>" +
        "<td>" + fmtMoeda(canal.receita) + "</td>" +
        "<td>" + fmtPct(canal.margem * 100, 0) + "</td>" +
        "<td>" + fmtMoeda(canal.lucroBruto) + "</td>" +
        '<td class="canal-bar-cell">' +
        '<div class="canal-bar" role="img" aria-label="' + fmtPct(canal.percentualDoLucro, 1) + ' do lucro bruto total">' +
        '<div class="canal-bar__fill" data-width="' + canal.percentualDoLucro + '"></div>' +
        "</div>" +
        '<span class="sr-only">' + fmtPct(canal.percentualDoLucro, 1) + "</span>" +
        "</td>" +
        "</tr>";
    });
    corpo.innerHTML = html;

    var totalParticipacaoEl = document.getElementById("totalParticipacao");
    var totalReceitaEl = document.getElementById("totalReceita");
    var totalLucroEl = document.getElementById("totalLucro");
    if (totalParticipacaoEl) totalParticipacaoEl.textContent = fmtPct(somaParticipacao * 100, 0);
    if (totalReceitaEl) totalReceitaEl.textContent = fmtMoeda(receitaTotalCalculada);
    if (totalLucroEl) totalLucroEl.textContent = fmtMoeda(lucroTotalCalculado);

    var barConv = canais[0];
    var destaqueEl = document.getElementById("destaqueBarConv");
    if (destaqueEl) {
      destaqueEl.textContent = fmtPct(barConv.percentualDoLucro, 0);
    }

    function animarBarras() {
      var fills = corpo.querySelectorAll(".canal-bar__fill");
      fills.forEach(function (fill) {
        var w = fill.getAttribute("data-width");
        requestAnimationFrame(function () {
          fill.style.width = w + "%";
        });
      });
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      animarBarras();
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animarBarras();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(corpo);
    }
  }

  /* ===================== CAPACIDADE FABRIL ===================== */
  function setupCapacidade() {
    var chart = document.getElementById("capacidadeChart");
    if (!chart) return;

    var capacidadeAtual = 72;
    var pedidoAtacarejo = 25;
    var tetoProposto = 15;

    var totalComTeto = capacidadeAtual + tetoProposto;
    var totalComAtacarejo = capacidadeAtual + pedidoAtacarejo;
    var folgaRestante = 100 - totalComTeto;

    var segAtual = chart.querySelector(".capacidade__seg--atual");
    var segProposta = chart.querySelector(".capacidade__seg--proposta");
    var segFolga = chart.querySelector(".capacidade__seg--folga");
    var folgaValorEl = document.getElementById("folgaRestante");
    var tetoEl = document.getElementById("capacidadeTeto");
    var atacarejoEl = document.getElementById("capacidadeAtacarejo");

    if (folgaValorEl) folgaValorEl.setAttribute("data-target", folgaRestante);
    if (tetoEl) tetoEl.textContent = totalComTeto + "%";
    if (atacarejoEl) atacarejoEl.textContent = totalComAtacarejo + "%";

    function aplicarLarguras() {
      if (segAtual) segAtual.style.setProperty("--valor", capacidadeAtual + "%");
      if (segProposta) segProposta.style.setProperty("--valor", tetoProposto + "%");
      if (segFolga) segFolga.style.setProperty("--valor", folgaRestante + "%");
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      aplicarLarguras();
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              aplicarLarguras();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(chart);
    }
  }

  /* ===================== INIT ===================== */
  document.addEventListener("DOMContentLoaded", function () {
    setupReveal();
    setupParticles();
    setupTabelaCanais();
    setupCapacidade();
    setupCounters();
  });
})();
