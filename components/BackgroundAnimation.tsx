"use client";

import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let gradientPosition = 0;
    const gradientSpeed = 0.0003; // Slower gradient movement
    
    // Create white particles
    const whiteParticles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.2 + 0.05, // Slower movement
      opacity: Math.random() * 0.15 + 0.05,
      direction: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.01 - 0.005, // Reduced spin
    }));
    
    const animate = () => {
      gradientPosition += gradientSpeed;
      
      // Create animated gradient
      const gradient = ctx.createLinearGradient(
        canvas.width * Math.sin(gradientPosition), 0,
        canvas.width, canvas.height
      );
      
      gradient.addColorStop(0, 'rgba(17, 24, 39, 1)');
      gradient.addColorStop(0.3, 'rgba(88, 28, 135, 0.8)');
      gradient.addColorStop(0.6, 'rgba(17, 24, 39, 0.9)');
      gradient.addColorStop(1, 'rgba(17, 24, 39, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add cyan particles
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.08;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(66, 220, 240, ${opacity})`;
        ctx.fill();
      }
      
      // Update and draw white particles
      whiteParticles.forEach((particle) => {
        // Update position
        particle.direction += particle.spin;
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Create a radial gradient for a glowing effect
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = glow;
        ctx.fill();
        
        // Draw white center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 2})`;
        ctx.fill();
      });
      
      // Reduce frequency of light streaks
      if (Math.random() < 0.04) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const length = Math.random() * 100 + 50;
        const angle = Math.random() * Math.PI * 2;
        const opacity = Math.random() * 0.05 + 0.02;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = Math.random() * 1 + 0.5;
        ctx.stroke();
      }
      
      // Reduce frequency of larger bright spots
      if (Math.random() < 0.01) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.1 + 0.03;
        
        // Create star glow
        const starGlow = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius * 4
        );
        starGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity * 1.2})`);
        starGlow.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.4})`);
        starGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = starGlow;
        ctx.fill();
        
        // Draw star center
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.5})`;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
}