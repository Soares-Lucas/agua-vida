import React, { useEffect, useRef } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const confettiCount = 200;
  const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class ConfettiParticle {
      x: number;
      y: number;
      size: number;
      weight: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = Math.random() * 10 + 5;
        this.weight = Math.random() * 0.4 + 0.1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.speedX = Math.sin(angle) * speed;
        this.speedY = -Math.cos(angle) * speed - 5; // Initial upward burst
      }

      update() {
        this.speedY += this.weight; // Gravity
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Friction
        this.speedX *= 0.99;
        this.speedY *= 0.99;

        if (this.y > height) {
            // Reset particle
            Object.assign(this, new ConfettiParticle());
            this.y = -20; // Start from top
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < confettiCount; i++) {
      particles.push(new ConfettiParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[100]"
    />
  );
};

export default Confetti;
