import { useEffect, useRef } from 'react';

const HexagonalBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // تنظیم اندازه Canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // کلاس ذره
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 2;
        this.baseOpacity = 0.2;
        this.opacity = this.baseOpacity;
        this.vx = 0;
        this.vy = 0;
      }

      draw() {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark
          ? `rgba(96, 165, 250, ${this.opacity})`
          : `rgba(236, 72, 153, ${this.opacity})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (mouse.x !== null && distance < mouse.radius) {
          this.opacity = Math.min(1, this.baseOpacity + (1 - distance / mouse.radius) * 0.8);
          
          const force = (mouse.radius - distance) / mouse.radius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          this.vx += forceDirectionX * force * 0.5;
          this.vy += forceDirectionY * force * 0.5;
        } else {
          this.opacity = this.baseOpacity;
          this.vx += (this.baseX - this.x) * 0.05;
          this.vy += (this.baseY - this.y) * 0.05;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.85;
        this.vy *= 0.85;

        this.draw();
      }
    }

    // ایجاد شبکه هگزاگونال با تصادفی‌سازی
    const createHexagonalGrid = () => {
      particles = [];
      const spacing = 30;
      const hexHeight = spacing * Math.sqrt(3);
      const randomness = 35; // میزان پراکندگی تصادفی

      for (let y = 0; y < canvas.height + hexHeight; y += hexHeight / 2) {
        for (let x = 0; x < canvas.width + spacing; x += spacing * 1.5) {
          const offsetX = (Math.floor(y / (hexHeight / 2)) % 2) * (spacing * 0.75);
          
          // اضافه کردن تصادفی‌سازی به موقعیت
          const randomX = (Math.random() - 1) * randomness;
          const randomY = (Math.random() - 1) * randomness;
          
          particles.push(new Particle(
            x + offsetX + randomX,
            y + randomY
          ));
        }
      }
    };

    createHexagonalGrid();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => particle.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
style={{ width: '100%', height: '100%', backgroundColor: 'rgba(7, 7, 7, 0.1)' }}

    />
  );
};

export default HexagonalBackground;
