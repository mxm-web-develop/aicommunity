'use client'
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

// 波浪路径数据集
const WAVE_PATHS = [
  'M0,224L48,213.3C96,203,192,181,288,192C384,203,480,245,576,229.3C672,213,768,139,864,144C960,149,1056,235,1152,240C1248,245,1344,171,1392,133.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
  // 添加更多波浪路径数据...
];


export default function Particlewaves() {
  const waveRef = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const particleSystem = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    // 波浪路径变形动画
    const wavePathAnim = anime({
      targets: waveRef.current,
      d: WAVE_PATHS,
      duration: 8000,
      easing: 'easeInOutSine',
      loop: true,
      update: (anim) => {
        const path = anim.animatables[0].target as SVGPathElement;
        const pathData = path.getAttribute('d');
        if (pathData) {
          path.setAttribute('d', pathData);
        }
      }
    });

    // 粒子系统初始化
    if (canvasRef.current) {
      particleSystem.current = new ParticleSystem(canvasRef.current);
      particleSystem.current.init();
    }

    // 文字动画（优化版）
    if (titleRef.current) {
      const titleElement = titleRef.current;
      anime.timeline({ easing: 'easeOutExpo' })
        .add({
          targets: titleElement.querySelectorAll('.char'),
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 1200,
          delay: anime.stagger(50, { start: 300 })
        })
        .add({
          targets: titleElement.querySelector('#title-underline'),
          width: ['0%', '100%'],
          duration: 800,
          easing: 'easeOutCirc'
        }, '-=500');
    }

    // 高性能交互动画
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!particleSystem.current) return;
      
      rafId = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          particleSystem.current?.updateMouse(x, y);
        }
      });
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    return () => {
      wavePathAnim.pause();
      cancelAnimationFrame(rafId);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      particleSystem.current?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#020617]">
      {/* 数据流波浪层 */}
      <svg className="absolute bottom-0 w-[200%] opacity-40">
        <defs>
          <filter id="data-wave" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
          </filter>
        </defs>
        <path 
          ref={waveRef}
          fill="url(#wave-gradient)"
          filter="url(#data-wave)"
          d={WAVE_PATHS[0]}
          className="transform-gpu will-change-transform"
        />
      </svg>

      {/* AI粒子画布 */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-20"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* 三维标题 */}
      <div className="absolute top-[30%] left-20 z-30">
        <div ref={titleRef} className="text-5xl font-bold tracking-wide">
          <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {[...'源启AI+'].map((char, i) => (
              <span key={i} className="char inline-block will-change-transform">{char}</span>
            ))}
          </div>
          <div 
            id="title-underline"
            className="h-[2px] bg-gradient-to-r from-cyan-400/80 to-blue-500/80"
          />
        </div>
        <div className="mt-4 text-xl text-cyan-100 opacity-90">
          源溯万象，智启未来
        </div>
      </div>
    </div>
  );
}

// 粒子系统实现
class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
  }

  init() {
    // 初始化粒子
    this.particles = Array.from({ length: 150 }, () => new Particle(
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height
    ));

    // 动画循环
    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.update(this.mouse);
        p.draw(this.ctx);
      });
      requestAnimationFrame(animate);
    };
    animate();

    // 响应式处理
    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  speed: number;
  angle: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseSize = Math.random() * 2 + 1;
    this.size = this.baseSize;
    this.speed = Math.random() * 0.5 + 0.2;
    this.angle = Math.random() * Math.PI * 2;
    this.color = `hsla(${Math.random() * 60 + 180}, 70%, 70%, 0.8)`;
  }

  update(mouse: { x: number; y: number }) {
    // 粒子运动逻辑
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      this.angle = Math.atan2(dy, dx);
      this.speed = Math.min(2, 100 / distance);
    }
    
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    // 边界处理
    if (this.x < 0 || this.x > innerWidth) this.angle = Math.PI - this.angle;
    if (this.y < 0 || this.y > innerHeight) this.angle = -this.angle;
    
    // 动态尺寸
    this.size = this.baseSize * (0.5 + Math.abs(Math.sin(Date.now() * 0.002)));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}