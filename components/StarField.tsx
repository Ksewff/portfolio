"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  depth: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooter: ShootingStar | null = null;
    let nextShootAt = performance.now() + 4500;
    let frameId = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const buildStars = (): void => {
      const isNarrow = width < 768;
      const count = isNarrow
        ? 58
        : Math.min(230, Math.max(120, Math.round((width * height) / 9000)));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random() * 0.8 + 0.2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: depth * (Math.random() * 1.1 + 0.3),
          baseAlpha: 0.2 + depth * 0.55,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.35 + Math.random() * 0.9,
          depth,
        };
      });
    };

    const paintBackdrop = (): void => {
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(
        width * 0.72,
        height * 0.18,
        0,
        width * 0.72,
        height * 0.18,
        Math.max(width, height) * 0.75,
      );
      glow.addColorStop(0, "rgba(99, 102, 241, 0.10)");
      glow.addColorStop(0.45, "rgba(49, 46, 129, 0.05)");
      glow.addColorStop(1, "rgba(11, 15, 26, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };

    const drawStars = (time: number): void => {
      const offsetX = pointer.x * 16;
      const offsetY = pointer.y * 16;
      for (const star of stars) {
        const twinkle = reduceMotion
          ? 1
          : 0.65 + Math.sin(time * 0.001 * star.twinkleSpeed + star.phase) * 0.35;
        const alpha = Math.min(1, star.baseAlpha * twinkle);
        const x = star.x + offsetX * star.depth;
        const y = star.y + offsetY * star.depth;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(226, 232, 244, ${alpha.toFixed(3)})`;
        context.fill();
      }
    };

    const drawShooter = (): void => {
      if (!shooter) return;
      const progress = 1 - shooter.life / shooter.maxLife;
      const alpha = Math.sin(Math.PI * Math.min(1, progress * 1.2));
      const tailX = shooter.x - shooter.vx * 14;
      const tailY = shooter.y - shooter.vy * 14;
      const gradient = context.createLinearGradient(shooter.x, shooter.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(226, 232, 244, ${0.85 * alpha})`);
      gradient.addColorStop(0.4, `rgba(165, 180, 252, ${0.45 * alpha})`);
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
      context.strokeStyle = gradient;
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(shooter.x, shooter.y);
      context.lineTo(tailX, tailY);
      context.stroke();
    };

    const render = (time: number): void => {
      if (!visible) return;
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      paintBackdrop();
      drawStars(time);

      if (!reduceMotion) {
        if (!shooter && time > nextShootAt) {
          shooter = {
            x: width * (0.35 + Math.random() * 0.55),
            y: height * (0.05 + Math.random() * 0.3),
            vx: -(5 + Math.random() * 3),
            vy: 2.4 + Math.random() * 1.8,
            life: 68,
            maxLife: 68,
          };
          nextShootAt = time + 9000 + Math.random() * 7000;
        }

        if (shooter) {
          shooter.x += shooter.vx;
          shooter.y += shooter.vy;
          shooter.life -= 1;
          drawShooter();
          if (shooter.life <= 0) {
            shooter = null;
          }
        }
      }

      frameId = window.requestAnimationFrame(render);
    };

    const resize = (): void => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildStars();
      if (reduceMotion) {
        paintBackdrop();
        drawStars(0);
      }
    };

    const handlePointerMove = (event: PointerEvent): void => {
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleVisibility = (): void => {
      visible = document.visibilityState === "visible";
      if (visible && !reduceMotion) {
        frameId = window.requestAnimationFrame(render);
      } else {
        window.cancelAnimationFrame(frameId);
      }
    };

    const handleResize = (): void => {
      resize();
    };

    resize();
    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(render);
      window.addEventListener("visibilitychange", handleVisibility);
      if (finePointer) {
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  );
}
