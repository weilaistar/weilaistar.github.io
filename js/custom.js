/* ============================================================
   Weilaistar · 自定义脚本
   1) 首屏打字机效果
   2) 矩阵雨背景（Linux / 终端风）
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 打字机 ---------- */
  function initTyping() {
    var el = document.getElementById('typed-text');
    if (!el) return;

    var phrases = [
      'whoami  →  a Linux & Kernel learner @ USTC 🐧',
      'echo "红专并进 · 理实交融" —— USTC 校训',
      'uname -sr  →  Linux · the kernel I love',
      'cat ~/interests  →  device drivers · cache · memory',
      'gcc -O2 -o future life.c  &&  ./future',
      'Welcome to my blog, enjoy the journey!'
    ];

    var pi = 0;      // 短语序号
    var ci = 0;      // 字符序号
    var deleting = false;

    function tick() {
      var text = phrases[pi % phrases.length];
      var chars = Array.from(text);

      if (!deleting) {
        ci++;
        el.textContent = chars.slice(0, ci).join('');
        if (ci === chars.length) {
          deleting = true;
          return setTimeout(tick, 2300);
        }
        return setTimeout(tick, 72);
      }

      ci--;
      el.textContent = chars.slice(0, ci).join('');
      if (ci === 0) {
        deleting = false;
        pi++;
        return setTimeout(tick, 420);
      }
      return setTimeout(tick, 32);
    }

    el.textContent = '';
    tick();
  }

  /* ---------- 矩阵雨 ---------- */
  function initMatrix() {
    var canvas = document.getElementById('bg-fx');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var glyphs = 'アカサタナハマヤラワ0123456789ABCDEF$#@%&*+=<>/\\';
    var fontSize = 14;
    var columns = 0;
    var drops = [];
    var running = true;
    var scheduled = false;
    var last = 0;

    function resize() {
      var host = canvas.parentElement;
      var w = host ? host.clientWidth : window.innerWidth;
      var h = host ? host.clientHeight : window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      columns = Math.floor(w / fontSize);
      drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -40);
      }
    }

    function draw(t) {
      scheduled = false;
      if (!running) return;
      scheduled = true;
      requestAnimationFrame(draw);
      if (t - last < 50) return; // ~20fps
      last = t;

      ctx.fillStyle = 'rgba(4, 8, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < columns; i++) {
        var ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        var x = i * fontSize;
        var y = drops[i] * fontSize;
        ctx.fillStyle = 'rgba(74, 246, 38, 0.85)';
        ctx.fillText(ch, x, y);
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function ensure() {
      if (!scheduled && running) {
        scheduled = true;
        requestAnimationFrame(draw);
      }
    }

    // 仅当首屏可见时运行，节省性能
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) {
          last = 0;
          ensure();
        }
      }).observe(canvas);
    }

    resize();
    window.addEventListener('resize', resize);
    ensure();
  }

  function init() {
    initTyping();
    initMatrix();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
