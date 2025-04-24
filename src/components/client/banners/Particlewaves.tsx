'use client'
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

// 默认高级波浪路径数据集
const DEFAULT_WAVE_PATHS = [
  'M0,160 C320,300,420,240,640,220 C950,200,1110,340,1440,300 L1440,400 L0,400 Z',
  'M0,180 C120,210,320,150,640,250 C850,310,1120,280,1440,250 L1440,400 L0,400 Z',
  'M0,200 C220,260,420,210,640,270 C950,300,1110,240,1440,220 L1440,400 L0,400 Z'
];

// 定义组件Props接口
export interface ParticlewavesProps {
  // 波浪配置
  wavePaths?: string[];
  waveAnimationDuration?: number;
  waveGradient1?: {
    color1: string;
    color2: string;
    color3: string;
    opacity1: number;
    opacity2: number;
    opacity3: number;
  };
  waveGradient2?: {
    color1: string;
    color2: string;
    color3: string;
    opacity1: number;
    opacity2: number;
    opacity3: number;
  };
  
  // 背景配置
  backgroundColor?: {
    from: string;
    to: string;
  };
  backgroundLights?: {
    light1: {
      color: string;
      size: number;
      blur: number;
      position: {top: string, left: string}
    };
    light2: {
      color: string;
      size: number;
      blur: number;
      position: {bottom: string, right: string}
    };
  };
  
  // 粒子系统配置
  particleCount?: number;
  particleBaseSize?: number;
  particleBaseSpeed?: number;
  particleColorRange?: {
    hueStart: number;
    hueEnd: number;
    saturation: number;
    lightness: number;
    opacity: number;
  };
  
  // SVG标题配置
  svgTitle?: React.ReactNode;
  titleStrokeColor?: string;
  titleStrokeWidth?: string;
  titleGradient?: {
    color1: string;
    color2: string;
    color3: string;
  };
  
  // 动画配置
  titleAnimationDuration?: number;
  titleAnimationDelay?: number;
  underlineAnimationDuration?: number;
  underlineGradient?: {
    from: string;
    via: string;
    to: string;
  };
  
  // 副标题配置
  subtitle?: string;
  subtitleClass?: string;
  subtitleColor?: string;
  subtitleAnimationDuration?: number;
  subtitleAnimationDelay?: number;
  subtitleGradient?: {
    from: string;
    via?: string;
    to: string;
    animationDuration?: number;
  };
  
  // 位置配置
  titlePosition?: {
    top: string;
    left: string;
  };
}

export default function Particlewaves({
  // 设置默认值
  wavePaths = DEFAULT_WAVE_PATHS,
  waveAnimationDuration = 15000,
  waveGradient1 = {
    color1: 'rgba(79, 70, 229, 0.15)',
    color2: 'rgba(6, 182, 212, 0.25)',
    color3: 'rgba(59, 130, 246, 0.15)',
    opacity1: 0,
    opacity2: 50,
    opacity3: 100
  },
  waveGradient2 = {
    color1: 'rgba(79, 70, 229, 0.05)',
    color2: 'rgba(6, 182, 212, 0.15)',
    color3: 'rgba(59, 130, 246, 0.05)',
    opacity1: 0,
    opacity2: 50,
    opacity3: 100
  },
  backgroundColor = {
    from: '#030d24',
    to: '#0a192f'
  },
  backgroundLights = {
    light1: {
      color: '#4f46e5',
      size: 96,
      blur: 100,
      position: {top: '1/4', left: '-20'}
    },
    light2: {
      color: '#06b6d4',
      size: 80,
      blur: 120,
      position: {bottom: '1/3', right: '10'}
    }
  },
  particleCount = 180,
  particleBaseSize = 1.5,
  particleBaseSpeed = 0.3,
  particleColorRange = {
    hueStart: 200,
    hueEnd: 240,
    saturation: 80,
    lightness: 60,
    opacity: 0.8
  },
  svgTitle,
  titleStrokeColor = '#4f46e5',
  titleStrokeWidth = '1.5px',
  titleGradient = {
    color1: '#4f46e5',
    color2: '#06b6d4',
    color3: '#3b82f6'
  },
  titleAnimationDuration = 650,
  titleAnimationDelay = 40,
  underlineAnimationDuration = 800,
  underlineGradient = {
    from: '#4f46e5/80',
    via: '#06b6d4',
    to: '#3b82f6/80'
  },
  subtitle = '源溯万象，智启未来',
  subtitleClass = 'mt-2 text-2xl font-light tracking-wide',
  subtitleColor = '#e0f2fe',
  subtitleAnimationDuration = 600,
  subtitleAnimationDelay = 100,
  subtitleGradient = {
    from: 'rgba(79, 70, 229, 0.9)',
    via: 'rgba(6, 182, 212, 0.9)',
    to: 'rgba(59, 130, 246, 0.9)',
    animationDuration: 1000
  },
  titlePosition = {
    top: '1/3',
    left: '10%'
  }
}: ParticlewavesProps) {
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
      d: wavePaths,
      duration: waveAnimationDuration,
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
      particleSystem.current = new ParticleSystem(canvasRef.current, {
        particleCount,
        particleBaseSize,
        particleBaseSpeed,
        particleColorRange
      });
      particleSystem.current.init();
    }

    // SVG 文字动画
    if (svgTitleRef.current) {
      // 获取所有路径元素
      const pathElements = Array.from(svgTitleRef.current.querySelectorAll('path'));
      
      // 根据 x 坐标对路径进行排序（从左到右）
      const paths = pathElements.sort((a, b) => {
        // 获取每个路径的边界框
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        // 按 x 坐标排序
        return rectA.left - rectB.left;
      });
      
      // 设置路径初始状态
      paths.forEach(path => {
        // 获取路径长度
        const length = path.getTotalLength();
        
        // 设置初始样式 - 隐藏路径
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.fillOpacity = '0';
        path.style.fill = 'url(#title-gradient)';
        path.style.stroke = titleStrokeColor;
        path.style.strokeWidth = titleStrokeWidth;
      });
      
      // 隐藏副标题，设置透明度和添加渐变属性
      const subtitle = document.getElementById('title-subtitle');
      if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.background = `linear-gradient(90deg, ${subtitleGradient.from} 0%, ${subtitleGradient.via || subtitleGradient.from} 50%, ${subtitleGradient.to} 100%)`;
        subtitle.style.backgroundClip = 'text';
        subtitle.style.webkitBackgroundClip = 'text';
        subtitle.style.color = 'transparent';
        subtitle.style.backgroundSize = '200% 100%';
        subtitle.style.backgroundPosition = 'left';
      }
      
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
      
      // 逐个描绘字符（从左到右）
      paths.forEach((path, index) => {
        timeline.add({
          targets: path,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'cubicBezier(0.12, 0, 0.39, 0)',
          duration: titleAnimationDuration,
          delay: index * titleAnimationDelay
        });
      });
      
      // 所有路径描绘完成后填充颜色
      timeline.add({
        targets: paths,
        fillOpacity: 1,
        duration: 800,
        delay: anime.stagger(50),
        easing: 'easeOutQuad'
      });
      
      // 添加下划线动画
      timeline.add({
        targets: '#title-underline',
        width: ['0%', '100%'],
        duration: underlineAnimationDuration,
        easing: 'easeOutCirc',
      }, '-=400');
      
      // 修改副标题动画，添加透明度和渐变效果
      timeline.add({
        targets: '#title-subtitle',
        opacity: [0, 1],
        backgroundPosition: ['left', 'right'],
        duration: subtitleAnimationDuration,
        easing: 'easeOutCirc',
      }, `+=${subtitleAnimationDelay}`);
      
      // 添加副标题渐变动画循环
      anime({
        targets: '#title-subtitle',
        backgroundPosition: ['left', 'right', 'left'],
        duration: subtitleGradient.animationDuration,
        easing: 'linear',
        loop: true,
        delay: subtitleAnimationDuration + 1000,
      });
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
  }, [
    wavePaths,
    waveAnimationDuration,
    particleCount,
    particleBaseSize,
    particleBaseSpeed,
    particleColorRange,
    titleAnimationDuration,
    titleAnimationDelay,
    underlineAnimationDuration,
    subtitleAnimationDuration,
    subtitleAnimationDelay,
    subtitleGradient,
    titleStrokeColor,
    titleStrokeWidth
  ]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-hidden bg-gradient-to-b from-[${backgroundColor.from}] to-[${backgroundColor.to}]`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* 高级背景光效 */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute top-${backgroundLights.light1.position.top} -left-${backgroundLights.light1.position.left} w-${backgroundLights.light1.size} h-${backgroundLights.light1.size} rounded-full bg-[${backgroundLights.light1.color}] blur-[${backgroundLights.light1.blur}px]`}></div>
        <div className={`absolute bottom-${backgroundLights.light2.position.bottom} right-${backgroundLights.light2.position.right} w-${backgroundLights.light2.size} h-${backgroundLights.light2.size} rounded-full bg-[${backgroundLights.light2.color}] blur-[${backgroundLights.light2.blur}px]`}></div>
      </div>
      
      {/* 精致网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxYTFhMWEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzAgMGg2MHY2MEgzMHoiLz48cGF0aCBmaWxsPSIjMWExYTFhIiBmaWxsLW9wYWNpdHk9Ii4wMiIgZD0iTTAgMGgzMHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      {/* 高级数据流波浪 */}
      <svg className="absolute bottom-0 w-full h-1/3" preserveAspectRatio="none" viewBox="0 0 1440 400">
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${waveGradient1.opacity1}%`} stopColor={waveGradient1.color1} />
            <stop offset={`${waveGradient1.opacity2}%`} stopColor={waveGradient1.color2} />
            <stop offset={`${waveGradient1.opacity3}%`} stopColor={waveGradient1.color3} />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${waveGradient2.opacity1}%`} stopColor={waveGradient2.color1} />
            <stop offset={`${waveGradient2.opacity2}%`} stopColor={waveGradient2.color2} />
            <stop offset={`${waveGradient2.opacity3}%`} stopColor={waveGradient2.color3} />
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
          d={wavePaths[0]}
          className="transform-gpu will-change-transform"
        />
      </svg>

      {/* 高级AI粒子画布 */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-20 w-full h-full"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* SVG 标题 - 使用提供的SVG */}
      <div className={`absolute top-${titlePosition.top} left-[${titlePosition.left}] z-30 max-w-lg`}>
        <svg 
          ref={svgTitleRef}
          width="347" 
          height="113" 
          viewBox="0 0 347 113" 
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2"
        >
          {/* 如果提供了自定义SVG标题，使用它，否则使用默认的 */}
          {svgTitle || (
            <>
              <path d="M347 24.061H331.046V40H323.031V24.061H307V16.0153H323.031V0H331.046V16.0153H347V24.061Z" />
              <path d="M295.387 24V112.458H276.542V24H295.387Z" />
              <path d="M265.406 112.458H244.848L238.224 92.1853H206.072L199.562 112.458H179.118L211.498 24H233.655L265.406 112.458ZM233.769 77.6231L223.718 46.9569C223.071 45.0152 222.614 42.4454 222.348 39.2475H221.834C221.605 41.8363 221.092 44.33 220.292 46.7284L210.184 77.6231H233.769Z" />
              <path d="M100.854 39.7901H128.75C127.959 37.6542 127.169 35.6552 126.378 33.7931L138.976 31C140.203 33.8205 141.403 36.7505 142.576 39.7901H169V68.8712H111.898C111.898 87.0538 108.325 101.348 101.181 111.754C98.9447 109.015 96.2178 105.839 93 102.224C98.2357 93.4067 100.854 82.0152 100.854 68.0497V39.7901ZM157.956 58.8489V49.8124H111.898V58.8489H157.956ZM114.434 112V76.7576H168.427V111.836H157.465V107.646H125.396V112H114.434ZM157.465 86.8621H125.396V97.5416H157.465V86.8621Z" />
              <path d="M8.33898 31C14.4978 35.4361 18.9671 38.8043 21.7468 41.1045L14.1436 49.4016C10.2738 45.6227 6.0771 41.8712 1.55334 38.1471L8.33898 31ZM41.8584 86.5335L49.8704 91.4625C48.0718 94.3925 46.0143 97.4594 43.6979 100.663C45.115 100.882 46.9545 101.019 49.2164 101.074C51.6145 100.745 52.8408 99.6227 52.8953 97.7059V84.7262H38.4247V49.9767H47.2134C48.1944 47.7039 49.0528 45.3489 49.7886 42.9118H33.8465V67.6389C33.8465 88.2312 30.8215 103.018 24.7717 112C21.2835 108.495 18.2041 105.866 15.5334 104.114C20.8202 96.2272 23.4364 83.5761 23.3819 66.1602V33.711H80.6919V42.9118H60.5394C59.8853 44.5274 58.7953 46.8824 57.2692 49.9767H77.1765V84.7262H63.3599V100.253C63.3599 103.374 62.7059 105.811 61.3978 107.564C60.117 109.316 58.1412 110.384 55.4706 110.768C52.8272 111.151 49.3526 111.288 45.0469 111.178C44.5836 108.194 43.9159 104.99 43.0439 101.567C41.4633 103.703 39.7873 105.894 38.016 108.139L30.4128 101.978C34.3915 97.7606 38.2067 92.6126 41.8584 86.5335ZM67.0389 58.356H48.3988V63.5314H67.0389V58.356ZM67.0389 76.3469V71.0892H48.3988V76.3469H67.0389ZM6.70389 52.1947C10.8461 55.2069 15.1519 58.6572 19.6211 62.5456L12.2632 71.4179C8.28448 67.5294 4.19674 63.7231 0 59.999L6.70389 52.1947ZM9.15653 75.6897C13.2443 77.5517 16.5962 78.8661 19.2124 79.6329L11.8544 110.603C8.25723 109.234 4.66002 108.112 1.06281 107.235C3.84247 98.856 6.54038 88.3408 9.15653 75.6897ZM71.7807 86.2049C75.2144 90.6957 78.6208 95.8164 82 101.567L73.5793 106.578C70.9631 101.54 67.8019 96.2546 64.0957 90.7231L71.7807 86.2049Z" />
            </>
          )}
          
          {/* 定义渐变 */}
          <defs>
            <linearGradient id="title-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={titleGradient.color1} />
              <stop offset="50%" stopColor={titleGradient.color2} />
              <stop offset="100%" stopColor={titleGradient.color3} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 下划线 */}
          <div 
            id="title-underline"
          className={`h-[3px] bg-gradient-to-r from-[${underlineGradient.from}] via-[${underlineGradient.via}] to-[${underlineGradient.to}] rounded-full`}
          style={{ width: "0%" }}
        />
        
        {/* 副标题只设置透明度初始值 */}
        <div 
          id="title-subtitle"
          className={subtitleClass}
          style={{ 
            opacity: 0, 
            // 注意：具体样式将在useEffect中设置，这里只设置初始透明度
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}

// 优化的粒子系统实现
interface ParticleSystemOptions {
  particleCount: number;
  particleBaseSize: number;
  particleBaseSpeed: number;
  particleColorRange: {
    hueStart: number;
    hueEnd: number;
    saturation: number;
    lightness: number;
    opacity: number;
  };
}

class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private connections: Connection[] = [];
  private mouse = { x: 0, y: 0 };
  private mouseActive = false;
  private lastTime = 0;
  private options: ParticleSystemOptions;
  // 存储事件监听器引用
  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseLeaveHandler: () => void;

  constructor(canvas: HTMLCanvasElement, options: ParticleSystemOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.options = options;
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
    this.particles = Array.from({ length: this.options.particleCount }, () => new Particle(
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height,
      this.options.particleBaseSize,
      this.options.particleBaseSpeed,
      this.options.particleColorRange
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

  constructor(
    x: number, 
    y: number, 
    baseSize: number, 
    baseSpeed: number,
    colorRange: { hueStart: number, hueEnd: number, saturation: number, lightness: number, opacity: number }
  ) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.baseSize = Math.random() * baseSize + 0.5;
    this.size = this.baseSize;
    this.speed = Math.random() * baseSpeed + 0.1;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
    
    // 高级色彩方案
    const hue = Math.random() * (colorRange.hueEnd - colorRange.hueStart) + colorRange.hueStart;
    this.color = `hsla(${hue}, ${colorRange.saturation}%, ${colorRange.lightness}%, ${colorRange.opacity})`;
    this.glowColor = `hsla(${hue}, ${colorRange.saturation}%, ${colorRange.lightness}%, 0.3)`;
    
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