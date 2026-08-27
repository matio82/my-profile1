import { useEffect, useRef } from 'react';

// پس‌زمینه‌ی کهکشانی: نقاط همیشه به‌آرامی در حال حرکت و چشمک‌زدن هستن (نه ساکن)
// و موس مثل یک سیاه‌چاله عمل می‌کنه: نقاط نزدیک رو با یک حرکت چرخشی به سمت خودش می‌کشه
const GalaxyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const mouse = { x: null, y: null };

    // رنگ ستاره‌ها هماهنگ با رنگ اصلی سایت (آبی/بنفش)، جداگانه برای هر تم
    const PALETTE = {
      dark: ['96, 165, 250', '167, 139, 250'], // primary-dark / secondary-dark
      light: ['59, 130, 246', '139, 92, 246'], // primary-light / secondary-light
    };

    const GRAVITY_RADIUS = 220; // شعاع کشش سیاه‌چاله
    const EVENT_HORIZON = 14; // فاصله‌ای که نقطه «بلعیده» و دوباره متولد می‌شه

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    class Particle {
      constructor(x, y) {
        this.respawn(x, y);
      }

      respawn(x, y) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        this.size = Math.random() * 1.6 + 0.9;
        this.baseOpacity = Math.random() * 0.4 + 0.25;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.006;
        this.colorIndex = Math.random() < 0.5 ? 0 : 1;
        // حرکت آرام و همیشگی، مستقل از موس؛ همینه که حس «زنده‌بودن» می‌ده
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.12 + 0.03;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      }

      update(time) {
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < EVENT_HORIZON) {
            // نقطه بلعیده شد؛ یه ستاره‌ی تازه یه‌جای دیگه متولد می‌شه
            const edge = Math.floor(Math.random() * 4);
            const spawnPositions = [
              [Math.random() * canvas.width, -10],
              [Math.random() * canvas.width, canvas.height + 10],
              [-10, Math.random() * canvas.height],
              [canvas.width + 10, Math.random() * canvas.height],
            ];
            const [sx, sy] = spawnPositions[edge];
            this.respawn(sx, sy);
            return;
          }

          if (distance < GRAVITY_RADIUS) {
            const pull = (GRAVITY_RADIUS - distance) / GRAVITY_RADIUS;
            const radialX = dx / distance;
            const radialY = dy / distance;
            // مؤلفه‌ی مماسی برای حس چرخش دور سیاه‌چاله (مثل قرص برافزایشی)
            const tangentX = -radialY;
            const tangentY = radialX;

            this.vx += radialX * pull * 0.35 + tangentX * pull * 0.5;
            this.vy += radialY * pull * 0.35 + tangentY * pull * 0.5;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        // اصطکاک برای اینکه سرعت نامحدود نشه
        this.vx *= 0.97;
        this.vy *= 0.97;

        // حداقل سرعت پایه تا حرکت آرام هیچ‌وقت کاملاً متوقف نشه
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < 0.03) {
          const angle = Math.random() * Math.PI * 2;
          this.vx += Math.cos(angle) * 0.02;
          this.vy += Math.sin(angle) * 0.02;
        }

        // برگشت از لبه‌ی دیگر صفحه (حرکت بی‌پایان)
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;

        this.draw(time);
      }

      draw(time) {
        const isDark = document.documentElement.classList.contains('dark');
        const colors = isDark ? PALETTE.dark : PALETTE.light;
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase) * 0.2;
        const opacity = Math.min(1, Math.max(0.08, this.baseOpacity + twinkle));

        ctx.fillStyle = `rgba(${colors[this.colorIndex]}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      const count = Math.min(1000, Math.floor((canvas.width * canvas.height) / 500));
      particles = Array.from({ length: count }, () => new Particle());
    };
    initParticles();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };
    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // هاله‌ی سیاه‌چاله دور موس
      if (mouse.x !== null) {
        const isDark = document.documentElement.classList.contains('dark');
        const glowColor = isDark ? '96, 165, 250' : '139, 92, 246';
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GRAVITY_RADIUS);
        gradient.addColorStop(0, `rgba(${glowColor}, 0.12)`);
        gradient.addColorStop(0.5, `rgba(${glowColor}, 0.04)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((particle) => particle.update(time || 0));
      animationFrameId = requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};

export default GalaxyBackground;
