import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.alphaChange = Math.random() * 0.01;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }
      
      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Alpha pulse effect
        this.alpha += this.alphaChange * this.direction;
        if (this.alpha >= 0.6 || this.alpha <= 0.1) {
          this.direction *= -1;
        }
        
        // Boundary check and reset
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }
      
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        
        // Draw different geometric shapes for variety
        const shapeType = Math.floor(this.x % 3);
        
        if (shapeType === 0) {
          // Draw triangle
          const side = this.size;
          const height = side * Math.sqrt(3) / 2;
          
          ctx.moveTo(this.x, this.y - height / 2);
          ctx.lineTo(this.x - side / 2, this.y + height / 2);
          ctx.lineTo(this.x + side / 2, this.y + height / 2);
          ctx.closePath();
        } else if (shapeType === 1) {
          // Draw rectangle
          ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
          // Draw hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = this.x + this.size * Math.cos(angle);
            const y = this.y + this.size * Math.sin(angle);
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
        }
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Grid lines
    class GridLine {
      constructor(isHorizontal, position, width, speed, color) {
        this.isHorizontal = isHorizontal;
        this.position = position;
        this.width = width;
        this.speed = speed;
        this.color = color;
        this.alpha = Math.random() * 0.1 + 0.05;
      }
      
      update() {
        if (this.isHorizontal) {
          this.position += this.speed;
          if (this.position > canvas.height) {
            this.position = 0;
          }
        } else {
          this.position += this.speed;
          if (this.position > canvas.width) {
            this.position = 0;
          }
        }
      }
      
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        
        if (this.isHorizontal) {
          ctx.moveTo(0, this.position);
          ctx.lineTo(canvas.width, this.position);
        } else {
          ctx.moveTo(this.position, 0);
          ctx.lineTo(this.position, canvas.height);
        }
        
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize particles
    const particles = [];
    const gridLines = [];
    
    const initParticles = () => {
      const particleCount = Math.floor(canvas.width * canvas.height / 20000);
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 15 + 5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        const velocityFactor = 0.1;
        const velocity = {
          x: (Math.random() - 0.5) * velocityFactor,
          y: (Math.random() - 0.5) * velocityFactor
        };
        
        // Randomly choose color from theme
        const colors = [
          'rgba(0, 180, 216, 0.8)',  // Blue
          'rgba(157, 78, 221, 0.8)',  // Purple
          'rgba(0, 245, 212, 0.8)'    // Green
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(x, y, size, color, velocity));
      }
    };
    
    const initGridLines = () => {
      // Horizontal lines
      for (let i = 0; i < 15; i++) {
        const position = Math.random() * canvas.height;
        const speed = Math.random() * 0.1 + 0.05;
        const width = Math.random() > 0.8 ? 0.6 : 0.2;
        const color = Math.random() > 0.5 ? 'rgba(0, 180, 216, 0.5)' : 'rgba(157, 78, 221, 0.5)';
        
        gridLines.push(new GridLine(true, position, width, speed, color));
      }
      
      // Vertical lines
      for (let i = 0; i < 20; i++) {
        const position = Math.random() * canvas.width;
        const speed = Math.random() * 0.1 + 0.05;
        const width = Math.random() > 0.8 ? 0.6 : 0.2;
        const color = Math.random() > 0.5 ? 'rgba(0, 180, 216, 0.5)' : 'rgba(157, 78, 221, 0.5)';
        
        gridLines.push(new GridLine(false, position, width, speed, color));
      }
    };
    
    initParticles();
    initGridLines();
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(12, 12, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw radial gradient for depth
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(12, 12, 20, 0)');
      gradient.addColorStop(1, 'rgba(12, 12, 20, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Update and draw grid lines
      gridLines.forEach(line => {
        line.update();
        line.draw();
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <BackgroundContainer>
      <Canvas ref={canvasRef} />
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

export default Background; 