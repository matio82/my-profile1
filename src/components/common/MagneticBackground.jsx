import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const HexagonalBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isDarkTheme = theme === 'dark';

    // تنظیم اندازه canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // کلاس ذره
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 3 + 1;
        this.density = Math.random() * 30 + 1;
      }

      draw() {
        const mouse = mouseRef.current;
        
        // وقتی موس نیست - شفافیت 20% برای هر دو تم
        if (mouse.x === null || mouse.y === null) {
          ctx.fillStyle = isDarkTheme
            ? 'rgba(0, 212, 255, 0.2)'
            : 'rgba(255, 105, 180, 0.4)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          return;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = 200;

        if (distance < maxDistance) {
          // شفافیت 20% تا 100% بر اساس فاصله
          let opacity = 0.2 + (0.8 * (1 - distance / maxDistance));
          ctx.fillStyle = isDarkTheme
            ? `rgba(0, 212, 255, ${opacity})`
            : `rgba(255, 105, 180, ${opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        } else {
          // خارج از محدوده - شفافیت 20% برای هر دو تم
          ctx.fillStyle = isDarkTheme
            ? 'rgba(0, 212, 255, 0.2)'
            : 'rgba(255, 105, 180, 0.4)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }

      update() {
        const mouse = mouseRef.current;
        if (mouse.x === null || mouse.y === null) {
          // برگشت به موقعیت اولیه
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
          return;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 150;
        let force = (maxDistance - distance) / maxDistance;
        
        // سرعت جذب نصف شده (ضرب در 0.5)
        let directionX = forceDirectionX * force * this.density * 0.7;
        let directionY = forceDirectionY * force * this.density * 0.7;

        if (distance < maxDistance) {
          // جذب به سمت موس
          this.x += directionX;
          this.y += directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    // ایجاد ذرات
    const init = () => {
      particlesRef.current = [];
      let numberOfParticles = (canvas.width * canvas.height) / 1000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(new Particle());
      }
    };
    init();

    // انیمیشن
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // رسم هاله آهنربا
      const mouse = mouseRef.current;
      if (mouse.x !== null && mouse.y !== null) {
        let gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          200
        );
        gradient.addColorStop(
          0,
          isDarkTheme ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 105, 180, 0.15)'
        );
        gradient.addColorStop(
          0.5,
          isDarkTheme ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255, 105, 180, 0.05)'
        );
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update();
        particlesRef.current[i].draw();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // ردیابی موس
    const handleMouseMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseOut = () => {
      mouseRef.current = { x: null, y: null };
    };

    // پشتیبانی از Touch
    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default HexagonalBackground;
