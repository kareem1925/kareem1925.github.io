(function() {
  const container = document.getElementById('quantum-canvas-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  let photons = [];
  let phase = 0;
  let isProjected = false;
  let animationId;
  let wavefrontRadius = 0;

  const mzi = {
    x: 0, y: 0, w: 0, h: 0,
    bs1: {x: 0.2, y: 0.5},
    bs2: {x: 0.8, y: 0.5},
    m1: {x: 0.5, y: 0.2},
    m2: {x: 0.5, y: 0.8}
  };

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const size = Math.min(width, height) * 0.7;
    mzi.w = size;
    mzi.h = size;
    mzi.x = (width - size) / 2;
    mzi.y = (height - size) / 2;
  }

  class Photon {
    constructor() {
      this.reset();
    }
    reset() {
      this.t = -Math.random() * 200;
      this.speed = 1.2 + Math.random();
      this.color = `hsla(${210 + Math.random() * 15}, 100%, 75%, ${0.5 + Math.random() * 0.4})`;
      this.size = 1.5 + Math.random();
      this.path = Math.random() < 0.5 ? 'upper' : 'lower';
      this.trail = [];
    }
    update() {
      this.t += this.speed;
      if (this.t > 400) this.reset();

      const p = this.t / 400;
      
      this.trail.unshift({x: this.x, y: this.y});
      if (this.trail.length > 10) this.trail.pop();

      if (p < 0.2) {
        this.x = mzi.x - 100 + (mzi.w * 0.2 + 100) * (p / 0.2);
        this.y = mzi.y + mzi.h * 0.5;
      } 
      else if (p < 0.5) {
        const subP = (p - 0.2) / 0.3;
        const startX = mzi.x + mzi.w * 0.2;
        const startY = mzi.y + mzi.h * 0.5;
        
        if (this.path === 'upper' || isProjected) {
          this.x = startX + (mzi.w * 0.3) * subP;
          this.y = startY - (mzi.h * 0.3) * subP;
        } else {
          this.x = startX + (mzi.w * 0.3) * subP;
          this.y = startY + (mzi.h * 0.3) * subP;
        }
      }
      else if (p < 0.8) {
        const subP = (p - 0.5) / 0.3;
        const startX = mzi.x + mzi.w * 0.5;
        
        if (this.path === 'upper' || isProjected) {
          this.x = startX + (mzi.w * 0.3) * subP;
          this.y = mzi.y + mzi.h * 0.2 + (mzi.h * 0.3) * subP;
        } else {
          this.x = startX + (mzi.w * 0.3) * subP;
          this.y = mzi.y + mzi.h * 0.8 - (mzi.h * 0.3) * subP;
        }
      }
      else {
        const subP = (p - 0.8) / 0.2;
        this.x = mzi.x + mzi.w * 0.8 + (mzi.w * 0.2 + 100) * subP;
        
        const probUpper = Math.pow(Math.cos(phase / 2), 2);
        if (isProjected) {
            this.y = mzi.y + mzi.h * 0.5;
        } else {
            if (this.path === 'upper' && Math.random() < probUpper) {
                this.y = mzi.y + mzi.h * 0.5 - subP * 20;
            } else {
                this.y = mzi.y + mzi.h * 0.5 + subP * 20;
            }
        }
      }
    }
    draw() {
      if (this.t < 0) return;
      
      // Draw Trail
      ctx.beginPath();
      this.trail.forEach((pos, i) => {
        if (!pos.x) return;
        const alpha = (1 - i / 10) * 0.3;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`);
        ctx.arc(pos.x, pos.y, this.size * (1 - i/15), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function drawMZI() {
    const alpha = isProjected ? 0.05 : 0.1;
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    
    // Ghost Paths
    ctx.strokeStyle = `rgba(74, 158, 255, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(mzi.x - 100, mzi.y + mzi.h * 0.5);
    ctx.lineTo(mzi.x + mzi.w * 0.2, mzi.y + mzi.h * 0.5);
    ctx.lineTo(mzi.x + mzi.w * 0.5, mzi.y + mzi.h * 0.2);
    ctx.lineTo(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5);
    ctx.moveTo(mzi.x + mzi.w * 0.2, mzi.y + mzi.h * 0.5);
    ctx.lineTo(mzi.x + mzi.w * 0.5, mzi.y + mzi.h * 0.8);
    ctx.lineTo(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5);
    ctx.moveTo(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5);
    ctx.lineTo(mzi.x + mzi.w + 100, mzi.y + mzi.h * 0.5);
    ctx.stroke();

    // Components
    const compAlpha = isProjected ? 0.1 : 0.7;
    function drawBS(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = `rgba(173, 216, 230, ${compAlpha * 0.3})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${compAlpha})`;
        ctx.fillRect(-2, -25, 4, 50);
        ctx.strokeRect(-2, -25, 4, 50);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${compAlpha * 1.5})`;
        ctx.moveTo(-2, -25);
        ctx.lineTo(-2, 10);
        ctx.stroke();
        ctx.restore();
    }

    function drawMirror(x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(100, 100, 100, ${compAlpha})`;
        ctx.fillRect(-2, -20, 6, 40);
        ctx.strokeStyle = `rgba(255, 255, 255, ${compAlpha})`;
        ctx.beginPath(); ctx.moveTo(4, -20); ctx.lineTo(4, 20); ctx.stroke();
        ctx.restore();
    }

    drawBS(mzi.x + mzi.w * 0.2, mzi.y + mzi.h * 0.5);
    drawBS(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5);
    drawMirror(mzi.x + mzi.w * 0.5, mzi.y + mzi.h * 0.2, -Math.PI / 4);
    drawMirror(mzi.x + mzi.w * 0.5, mzi.y + mzi.h * 0.8, Math.PI / 4);
    
    // Waveguide Shifter
    ctx.save();
    ctx.translate(mzi.x + mzi.w * 0.35, mzi.y + mzi.h * 0.35);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = isProjected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.4)';
    ctx.strokeStyle = `rgba(255,255,255, ${compAlpha})`;
    ctx.fillRect(-10, -6, 20, 12);
    ctx.strokeRect(-10, -6, 20, 12);
    ctx.restore();
  }

  function drawWavefront() {
    if (wavefrontRadius > 0 && wavefrontRadius < Math.max(width, height) * 2.5) {
      wavefrontRadius += 22;
      ctx.beginPath();
      ctx.arc(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5, wavefrontRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(96, 165, 250, ${Math.max(0, 0.8 - wavefrontRadius / (width * 1.8))})`;
      ctx.lineWidth = 15;
      ctx.stroke();
      
      // Secondary ring
      if (wavefrontRadius > 100) {
        ctx.beginPath();
        ctx.arc(mzi.x + mzi.w * 0.8, mzi.y + mzi.h * 0.5, wavefrontRadius - 100, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0, 0.4 - wavefrontRadius / (width * 1.8))})`;
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    }
  }

  function animate() {
    if (!isIntersecting && !isProjected) return;
    ctx.clearRect(0, 0, width, height);
    drawMZI();
    photons.forEach(p => { p.update(); p.draw(); });
    drawWavefront();
    animationId = requestAnimationFrame(animate);
  }

  let isIntersecting = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        if (!animationId) animate();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }, { threshold: 0.1 });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      photons = [];
      const isMobile = window.innerWidth < 768;
      const baseCount = isMobile ? 20 : 40;
      const count = isProjected ? (isMobile ? 8 : 15) : baseCount;
      for (let i = 0; i < count; i++) photons.push(new Photon());
    }, 200);
  });

  resize();
  // Initial population
  const isMobile = window.innerWidth < 768;
  const initialCount = isMobile ? 20 : 40;
  for (let i = 0; i < initialCount; i++) photons.push(new Photon());
  
  observer.observe(container.parentElement);

  // Interactions
  const phaseBtn = document.getElementById('phase-shift-btn');
  const projectBtn = document.getElementById('project-zero-btn');
  const stateVector = document.getElementById('state-vector');
  const initialContent = document.getElementById('hero-initial-content');
  const profileReveal = document.getElementById('quantum-profile-reveal');

  if (phaseBtn) {
    phaseBtn.addEventListener('click', () => {
      if (isProjected) return;
      phase += Math.PI / 8;
      const prob0 = Math.abs(Math.cos(phase / 2));
      const prob1 = Math.abs(Math.sin(phase / 2));
      stateVector.innerHTML = `|ψ⟩ = ${prob0.toFixed(3)}|0⟩ + ${prob1.toFixed(3)}|1⟩`;
      
      // Flash effect on BS2
      const bs2X = mzi.x + mzi.w * 0.8;
      const bs2Y = mzi.y + mzi.h * 0.5;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath(); ctx.arc(bs2X, bs2Y, 40, 0, Math.PI*2); ctx.fill();
    });
  }

  if (projectBtn) {
    projectBtn.addEventListener('click', () => {
      if (isProjected) return;
      isProjected = true;
      wavefrontRadius = 1;
      
      stateVector.innerHTML = `<span class="text-blue-400 font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">|ψ⟩ = 1.000|0⟩</span>`;
      
      // Staggered reveal
      initialContent.classList.add('opacity-0', 'scale-90', 'pointer-events-none', '-translate-y-20');
      
      setTimeout(() => {
          initialContent.style.display = 'none';
          profileReveal.classList.remove('hidden');
          
          // Reset icon states for animation
          const icons = profileReveal.querySelectorAll('.quantum-social-link');
          icons.forEach(icon => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(10px) scale(0.8)';
          });

          setTimeout(() => {
              profileReveal.classList.remove('opacity-0', 'translate-y-20');
              profileReveal.classList.add('opacity-100', 'translate-y-0');
              
              // Staggered icons reveal
              icons.forEach((icon, i) => {
                setTimeout(() => {
                  icon.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                  icon.style.opacity = '1';
                  icon.style.transform = 'translateY(0) scale(1)';
                }, 300 + i * 100);
              });
          }, 100);
      }, 800);

      container.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      container.style.boxShadow = 'inset 0 0 250px rgba(59, 130, 246, 0.3)';
      container.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    });
  }
})();
