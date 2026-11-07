/* ================================
   bg.js : พื้นหลังเคลื่อนไหว (canvas)
   - ตัวอักษรลอยขึ้นพร้อมส่ายซ้ายขวาและหมุน
   - จุดแสงลอยเชื่อมเส้นกันเหมือนกลุ่มดาว
   - ขยับตามเมาส์เล็กน้อย (parallax)
================================ */
(() => {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const stage = canvas.closest(".stage");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?_".split("");
  const ACCENT = "87, 194, 255";

  let w = 0;
  let h = 0;
  let letters = [];
  let dots = [];
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let lastTime = 0;
  let rafId = null;

  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- สร้างวัตถุ ---------- */

  function makeLetter(startAnywhere) {
    const size = clamp(rand(0.02, 0.05) * w, 16, 56);
    return {
      ch: CHARS[Math.floor(Math.random() * CHARS.length)],
      baseX: rand(0, w),
      y: startAnywhere ? rand(0, h) : h + size,
      vy: rand(18, 48),
      amp: rand(10, 40),
      phase: rand(0, Math.PI * 2),
      swing: rand(0.4, 1.1),
      rot: rand(-0.4, 0.4),
      vr: rand(-0.35, 0.35),
      size,
      alpha: rand(0.22, 0.55),
      depth: rand(0.4, 1.2),
      white: Math.random() < 0.25,
    };
  }

  function makeDot() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-14, 14),
      vy: rand(-14, 14),
      r: rand(1, 2.4),
      twinkle: rand(0, Math.PI * 2),
    };
  }

  function init() {
    const letterCount = clamp(Math.round(w / 38), 12, 34);
    const dotCount = clamp(Math.round(w / 22), 22, 56);
    letters = Array.from({ length: letterCount }, () => makeLetter(true));
    dots = Array.from({ length: dotCount }, makeDot);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
    draw(0);
  }

  /* ---------- อัปเดต ---------- */

  function update(dt) {
    smoothX += (pointerX - smoothX) * 0.05;
    smoothY += (pointerY - smoothY) * 0.05;

    for (const d of dots) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.twinkle += dt * 2;
      if (d.x < -10) d.x = w + 10;
      if (d.x > w + 10) d.x = -10;
      if (d.y < -10) d.y = h + 10;
      if (d.y > h + 10) d.y = -10;
    }

    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      l.y -= l.vy * dt;
      l.phase += l.swing * dt;
      l.rot += l.vr * dt;
      if (l.y < -l.size * 1.5) letters[i] = makeLetter(false);
    }
  }

  /* ---------- วาด ---------- */

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);

    const linkDist = clamp(w * 0.11, 70, 130);

    // เส้นเชื่อมจุดแสง
    ctx.lineWidth = 1;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - dist / linkDist) * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(dots[i].x + smoothX * 10, dots[i].y + smoothY * 10);
          ctx.lineTo(dots[j].x + smoothX * 10, dots[j].y + smoothY * 10);
          ctx.stroke();
        }
      }
    }

    // จุดแสงกะพริบ
    for (const d of dots) {
      const a = 0.45 + Math.sin(d.twinkle) * 0.3;
      ctx.fillStyle = `rgba(${ACCENT}, ${a})`;
      ctx.beginPath();
      ctx.arc(d.x + smoothX * 10, d.y + smoothY * 10, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ตัวอักษรลอย
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const l of letters) {
      const x = l.baseX + Math.sin(l.phase) * l.amp + smoothX * 28 * l.depth;
      const y = l.y + smoothY * 28 * l.depth;

      // จางเข้า-ออกตอนใกล้ขอบบน/ล่าง
      const edge = Math.min(l.y, h - l.y) / (h * 0.18);
      const fade = clamp(edge, 0, 1);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(l.rot);
      ctx.font = `600 ${l.size}px Niramit, sans-serif`;
      ctx.globalAlpha = l.alpha * fade;
      ctx.fillStyle = l.white ? "#ffffff" : `rgb(${ACCENT})`;
      ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
      ctx.shadowBlur = 14;
      ctx.fillText(l.ch, 0, 0);
      ctx.restore();
    }
  }

  /* ---------- วนเฟรม ---------- */

  function frame(time) {
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;
    update(dt);
    draw(dt);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId !== null) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function applyMotionPreference() {
    if (reduceMotion.matches) {
      stop();
      draw(0);
    } else {
      start();
    }
  }

  /* ---------- เหตุการณ์ ---------- */

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    pointerX = (e.clientX - rect.left) / rect.width - 0.5;
    pointerY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  stage.addEventListener("mouseleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  new ResizeObserver(resize).observe(stage);
  reduceMotion.addEventListener("change", applyMotionPreference);

  resize();
  applyMotionPreference();
})();

