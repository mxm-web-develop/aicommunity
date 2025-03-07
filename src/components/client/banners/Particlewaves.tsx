'use client'
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

// 高级波浪路径数据集
const WAVE_PATHS = [
  'M0,160 C320,300,420,240,640,220 C950,200,1110,340,1440,300 L1440,400 L0,400 Z',
  'M0,180 C120,210,320,150,640,250 C850,310,1120,280,1440,250 L1440,400 L0,400 Z',
  'M0,200 C220,260,420,210,640,270 C950,300,1110,240,1440,220 L1440,400 L0,400 Z'
];

export default function Particlewaves() {
  const waveRef = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgTitleRef = useRef<SVGSVGElement>(null);
  const particleSystem = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    // 确保组件填满父容器
    const updateDimensions = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      // 获取父元素的实际尺寸
      const parentElement = containerRef.current.parentElement;
      const parentWidth = parentElement?.clientWidth || window.innerWidth;
      const parentHeight = parentElement?.clientHeight || window.innerHeight;
      
      // 设置容器尺寸
      containerRef.current.style.width = `${parentWidth}px`;
      containerRef.current.style.height = `${parentHeight}px`;
      
      // 设置画布尺寸
      canvasRef.current.width = parentWidth;
      canvasRef.current.height = parentHeight;
      
      // 如果粒子系统已初始化，通知其尺寸变更
      if (particleSystem.current) {
        particleSystem.current.resize();
      }
    };
    
    // 初始调整尺寸
    updateDimensions();
    
    // 高级波浪动画
    const wavePathAnim = anime({
      targets: waveRef.current,
      d: WAVE_PATHS,
      duration: 15000,
      easing: 'cubicBezier(0.420, 0.000, 0.580, 1.000)',
      loop: true,
      direction: 'alternate',
      update: (anim) => {
        const path = anim.animatables[0].target as SVGPathElement;
        const pathData = path.getAttribute('d');
        if (pathData) {
          path.setAttribute('d', pathData);
        }
      }
    });

    // 优化粒子系统
    if (canvasRef.current) {
      particleSystem.current = new ParticleSystem(canvasRef.current);
      particleSystem.current.init();
    }

    // SVG 文字动画
    if (svgTitleRef.current) {
      // 获取所有路径元素
      const paths = svgTitleRef.current.querySelectorAll('path');
      
      // 设置路径初始状态
      paths.forEach(path => {
        // 获取路径长度
        const length = path.getTotalLength();
        
        // 设置初始样式 - 隐藏路径
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.fillOpacity = '0';
      });
      
      // 创建动画时间轴
      const timeline = anime.timeline({
        easing: 'easeOutSine',
        duration: 800,
        complete: () => {
          // 动画完成后添加发光效果
          paths.forEach(path => {
            path.style.filter = 'drop-shadow(0 0 2px rgba(79, 70, 229, 0.5))';
          });
        }
      });
      
      // 逐个描绘字符
      paths.forEach((path, index) => {
        timeline.add({
          targets: path,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'cubicBezier(0.12, 0, 0.39, 0)',
          duration: 1200,
          delay: index * 150
        });
      });
      
      // 所有路径描绘完成后填充颜色
      timeline.add({
        targets: Array.from(paths),
        fillOpacity: 1,
        duration: 800,
        delay: anime.stagger(50),
        easing: 'easeOutQuad'
      });
      
      // 添加下划线动画
      timeline.add({
        targets: '#title-underline',
        width: ['0%', '100%'],
        duration: 800,
        easing: 'easeOutCirc'
      }, '-=400');
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
    
    // 监听尺寸变化
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      // 清理，包括移除尺寸变化监听
      wavePathAnim.pause();
      cancelAnimationFrame(rafId);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      particleSystem.current?.destroy();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#030d24] to-[#0a192f]"
      style={{ width: '100%', height: '100%' }}
    >
      {/* 高级背景光效 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#4f46e5] blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-[#06b6d4] blur-[120px]"></div>
      </div>
      
      {/* 精致网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxYTFhMWEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzAgMGg2MHY2MEgzMHoiLz48cGF0aCBmaWxsPSIjMWExYTFhIiBmaWxsLW9wYWNpdHk9Ii4wMiIgZD0iTTAgMGgzMHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      {/* 高级数据流波浪 */}
      <svg className="absolute bottom-0 w-full h-1/3" preserveAspectRatio="none" viewBox="0 0 1440 400">
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.15)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.25)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.15)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </linearGradient>
          <filter id="data-wave" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" result="noise" seed="3"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          </filter>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* 背景波浪 */}
        <path 
          fill="url(#wave-gradient-2)"
          d="M0,180 C320,230,520,150,740,200 C950,250,1110,180,1440,230 L1440,400 L0,400 Z"
          opacity="0.6"
          filter="url(#data-wave)"
          className="transform-gpu will-change-transform"
        />
        
        {/* 前景波浪 */}
        <path 
          ref={waveRef}
          fill="url(#wave-gradient-1)"
          filter="url(#glow)"
          d={WAVE_PATHS[0]}
          className="transform-gpu will-change-transform"
        />
      </svg>

      {/* 高级AI粒子画布 */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-20 w-full h-full"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* SVG 标题 */}
      <div className="absolute top-1/3 left-[10%] z-30 max-w-md">
        <svg 
          ref={svgTitleRef}
          width="300" 
          height="70" 
          viewBox="0 0 300 70" 
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2"
        >
          {/* 源 */}
          <path 
            d="M30,15 C35,15 40,20 40,30 C40,40 35,45 30,45 C25,45 20,40 20,30 C20,20 25,15 30,15 Z M30,20 C27,20 25,23 25,30 C25,37 27,40 30,40 C33,40 35,37 35,30 C35,23 33,20 30,20 Z M40,15 L55,15 L55,20 L45,20 L45,28 L50,28 L50,33 L45,33 L45,45 L40,45 Z" 
            fill="url(#title-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="1.5"
          />
          {/* 启 */}
          <path 
            d="M75,15 L90,15 L90,20 L80,20 L80,28 L88,28 L88,33 L80,33 L80,45 L75,45 Z M90,25 L95,25 C100,25 105,28 105,35 C105,42 100,45 95,45 L90,45 Z M95,30 L95,40 C97,40 100,39 100,35 C100,31 97,30 95,30 Z" 
            fill="url(#title-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="1.5" 
          />
          {/* A */}
          <path 
            d="M120,15 L135,45 L129,45 L126,38 L114,38 L111,45 L105,45 L120,15 Z M124,33 L120,24 L116,33 L124,33 Z" 
            fill="url(#title-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="1.5"
          />
          {/* I */}
          <path 
            d="M145,15 L155,15 L155,45 L145,45 Z" 
            fill="url(#title-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="1.5"
          />
          {/* + */}
          <path 
            d="M175,25 L175,15 L180,15 L180,25 L190,25 L190,30 L180,30 L180,45 L175,45 L175,30 L165,30 L165,25 Z" 
            fill="url(#title-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="1.5"
          />
          
          {/* 定义渐变 */}
          <defs>
            <linearGradient id="title-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 下划线 */}
        <div 
          id="title-underline"
          className="h-[3px] bg-gradient-to-r from-[#4f46e5]/80 via-[#06b6d4] to-[#3b82f6]/80 rounded-full"
          style={{ width: "0%" }}
        />
        
        <div className="mt-6 text-2xl text-[#e0f2fe] font-light opacity-90 tracking-wide">
          源溯万象，智启未来
        </div>
      </div>
    </div>
  );
}

// 优化的粒子系统实现
class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private connections: Connection[] = [];
  private mouse = { x: 0, y: 0 };
  private mouseActive = false;
  private lastTime = 0;
  // 存储事件监听器引用
  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseLeaveHandler: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    
    // 预定义事件处理器
    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouseActive = true;
    };
    
    this.mouseLeaveHandler = () => {
      this.mouseActive = false;
    };
  }

  init() {
    // 创建更多高质量粒子
    this.particles = Array.from({ length: 180 }, () => new Particle(
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height
    ));

    // 动画循环带时间差
    this.lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 更新和绘制粒子
      this.particles.forEach(p => {
        p.update(this.mouse, deltaTime, this.mouseActive);
        p.draw(this.ctx);
      });
      
      // 建立粒子连接
      this.createConnections();
      
      requestAnimationFrame(animate);
    };
    
    animate(performance.now());
    
    // 鼠标交互增强 - 使用预定义的事件处理器
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
    
    window.addEventListener('resize', this.resize);
  }

  createConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.connections.push(new Connection(p1, p2, distance));
        }
      }
    }
    
    // 绘制连接
    this.connections.forEach(c => c.draw(this.ctx));
  }

  resize = () => {
    const parentElement = this.canvas.parentElement;
    if (parentElement) {
      this.canvas.width = parentElement.clientWidth;
      this.canvas.height = parentElement.clientHeight;
      
      // 重新分配粒子位置，确保覆盖整个画布
      this.particles.forEach(p => {
        p.x = Math.random() * this.canvas.width;
        p.y = Math.random() * this.canvas.height;
      });
    }
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouseActive = true;
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    // 正确移除事件监听器
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
  }
}

class Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
  baseSize: number;
  speed: number;
  vx: number;
  vy: number;
  color: string;
  glowColor: string;
  lifeTime: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.baseSize = Math.random() * 1.5 + 0.5;
    this.size = this.baseSize;
    this.speed = Math.random() * 0.3 + 0.1;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
    
    // 高级色彩方案
    const hue = Math.random() * 40 + 200; // 蓝色到紫色范围
    this.color = `hsla(${hue}, 80%, 60%, 0.8)`;
    this.glowColor = `hsla(${hue}, 80%, 60%, 0.3)`;
    
    this.maxLife = Math.random() * 100 + 100;
    this.lifeTime = Math.random() * this.maxLife;
  }

  update(mouse: { x: number; y: number }, deltaTime: number, mouseActive: boolean) {
    // 自然漂移动作
    this.lifeTime += 0.5;
    if (this.lifeTime > this.maxLife) {
      this.lifeTime = 0;
    }
    
    const lifeRatio = this.lifeTime / this.maxLife;
    
    // 平滑的大小变化
    this.size = this.baseSize * (0.7 + Math.sin(lifeRatio * Math.PI * 2) * 0.3);
    
    // 流体运动
    this.vx += (Math.random() - 0.5) * 0.01;
    this.vy += (Math.random() - 0.5) * 0.01;
    
    // 限制速度
    const maxSpeed = 0.4;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }
    
    // 鼠标交互 - 更平滑的吸引或排斥效果
    if (mouseActive) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 1500;
        // 鼠标排斥效果
        this.vx -= dx * force;
        this.vy -= dy * force;
      }
    }
    
    // 逐渐回到原始位置
    this.vx += (this.originalX - this.x) * 0.0005;
    this.vy += (this.originalY - this.y) * 0.0005;
    
    // 应用运动，使用deltaTime使动画帧率独立
    const timeScale = deltaTime / 16; // 16ms是60fps
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    
    // 边界处理 - 反弹效果
    if (this.x < 0 || this.x > innerWidth) {
      this.vx = -this.vx * 0.8;
      this.x = Math.max(0, Math.min(this.x, innerWidth));
    }
    if (this.y < 0 || this.y > innerHeight) {
      this.vy = -this.vy * 0.8;
      this.y = Math.max(0, Math.min(this.y, innerHeight));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 绘制发光效果
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = 8;
    
    // 主粒子
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // 重置阴影
    ctx.shadowBlur = 0;
  }
}

class Connection {
  p1: Particle;
  p2: Particle;
  distance: number;
  
  constructor(p1: Particle, p2: Particle, distance: number) {
    this.p1 = p1;
    this.p2 = p2;
    this.distance = distance;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // 基于距离的透明度
    const opacity = (100 - this.distance) / 100;
    
    // 创建线性渐变
    const gradient = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    gradient.addColorStop(0, `rgba(100, 200, 255, ${opacity * 0.2})`);
    gradient.addColorStop(1, `rgba(100, 120, 255, ${opacity * 0.2})`);
    
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}