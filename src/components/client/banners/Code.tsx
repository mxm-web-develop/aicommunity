'use client'
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';


// 复制到样式表中
// @keyframes float-slow {
//     0% { transform: translateY(0) translateX(0); }
//     50% { transform: translateY(-15px) translateX(10px); }
//     100% { transform: translateY(0) translateX(0); }
//   }
  
//   .animate-float-slow {
//     animation-name: float-slow;
//     animation-timing-function: ease-in-out;
//     animation-iteration-count: infinite;
//   }
  
//   .perspective-500 {
//     perspective: 500px;
//   }
export default function WaveBanner() {
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleUnderlineRef = useRef(null);
  const matrixRef = useRef(null);
  
  useEffect(() => {
    // 矩阵数字雨背景
    if (matrixRef.current) {
      const canvas = matrixRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const characters = '01AIGIENTECH源启赋能未来';
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops = Array(Math.floor(columns)).fill(1);
      
      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 10, 30, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4f8bff';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const text = characters[Math.floor(Math.random() * characters.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const matrixInterval = setInterval(drawMatrix, 45);
      return () => clearInterval(matrixInterval);
    }

    // 改进波浪动画 - 使用无限滚动而不是translateX
    if (wave1Ref.current && wave2Ref.current) {
      // 设置波浪初始位置
      anime.set(wave1Ref.current, { translateX: '0%' });
      anime.set(wave2Ref.current, { translateX: '0%' });
      
      // 使用两个重叠的波浪元素实现无限滚动
      const wave1Clone = wave1Ref.current.cloneNode(true);
      const wave2Clone = wave2Ref.current.cloneNode(true);
      
      wave1Ref.current.parentNode.appendChild(wave1Clone);
      wave2Ref.current.parentNode.appendChild(wave2Clone);
      
      // 设置克隆元素的初始位置
      anime.set(wave1Clone, { translateX: '100%' });
      anime.set(wave2Clone, { translateX: '100%' });
      
      // 给两个原始波浪和它们的克隆添加动画
      const wave1Timeline = anime.timeline({
        loop: true,
        easing: 'linear'
      });
      
      wave1Timeline
        .add({
          targets: wave1Ref.current,
          translateX: '-100%',
          duration: 25000,
        })
        .add({
          targets: wave1Ref.current,
          translateX: '100%',
          duration: 0,
        }, '+=0');
      
      anime({
        targets: wave1Clone,
        translateX: '-100%',
        duration: 25000,
        loop: true,
        easing: 'linear',
        delay: 12500
      });
      
      const wave2Timeline = anime.timeline({
        loop: true,
        easing: 'linear'
      });
      
      wave2Timeline
        .add({
          targets: wave2Ref.current,
          translateX: '-100%',
          duration: 18000,
        })
        .add({
          targets: wave2Ref.current,
          translateX: '100%',
          duration: 0,
        }, '+=0');
      
      anime({
        targets: wave2Clone,
        translateX: '-100%',
        duration: 18000,
        loop: true,
        easing: 'linear',
        delay: 9000
      });
    }

    // 优化文字动画
    if (titleRef.current && subtitleRef.current) {
      // 标题字符分割
      const titleElement = titleRef.current;
      const titleText = titleElement.textContent;
      titleElement.innerHTML = '';
      
      // 更精致的字符分割方式
      [...titleText].forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.display = 'inline-block';
        
        // 为 "AI+" 添加特殊样式
        if (index >= 2 && index <= 4) {
          charSpan.className = 'text-cyan-300';
        }
        
        titleElement.appendChild(charSpan);
      });

      // 标题发光效果
      anime.set(titleElement, {
        textShadow: '0 0 10px rgba(100, 200, 255, 0.4)'
      });

      // 标题动画序列
      anime.timeline({
        easing: 'easeOutExpo',
      })
      .add({
        targets: titleElement.querySelectorAll('span'),
        opacity: [0, 1],
        translateY: [30, 0],
        translateZ: 0,
        rotateX: [90, 0],
        duration: 1500,
        delay: (el, i) => 300 + 80 * i,
      })
      .add({
        targets: titleUnderlineRef.current,
        width: ['0%', '100%'],
        duration: 1200,
        easing: 'easeInOutQuart'
      }, '-=800')
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
      }, '-=1000');
      
      // 持续的微妙动画
      setTimeout(() => {
        // 字符悬浮效果
        const chars = titleElement.querySelectorAll('span');
        chars.forEach((char, i) => {
          anime({
            targets: char,
            translateY: [0, -5, 0],
            opacity: [1, 0.8, 1],
            scale: [1, 1.05, 1],
            easing: 'easeInOutSine',
            duration: 4000 + i * 300,
            delay: i * 150,
            loop: true
          });
        });
        
        // 副标题微妙动画
        anime({
          targets: subtitleRef.current,
          translateY: [0, -3, 0],
          opacity: [1, 0.9, 1],
          easing: 'easeInOutQuad',
          duration: 6000,
          loop: true
        });
        
        // 下划线动画
        anime({
          targets: titleUnderlineRef.current,
          opacity: [1, 0.5, 1],
          backgroundPosition: ['0% 50%', '100% 50%'],
          easing: 'easeInOutSine',
          duration: 8000,
          loop: true
        });
      }, 3000);
    }

    // 交互动画
    const container = containerRef.current;
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 16) return;
      lastTime = now;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // 平滑的波浪响应
      anime({
        targets: [wave1Ref.current, wave1Ref.current.nextSibling, wave2Ref.current, wave2Ref.current.nextSibling],
        scaleY: 1 + y * 0.2,
        skewX: (x - 0.5) * 5,
        duration: 400,
        easing: 'easeOutQuad'
      });
      
      // 中央AI元素响应
      anime({
        targets: '.ai-center-element',
        translateX: (x - 0.5) * 20,
        translateY: (y - 0.5) * 20,
        duration: 800,
        easing: 'easeOutQuad'
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* 矩阵背景 */}
      <canvas ref={matrixRef} className="absolute inset-0 z-10 opacity-30" />
      
      {/* 发光粒子效果 */}
      <div className="absolute inset-0 z-10">
        {Array.from({length: 15}).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 blur-md animate-float-slow"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* 波浪容器 - 使用绝对定位和宽度控制 */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg ref={wave1Ref} className="absolute bottom-0 w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path fill="#ffffff" d="M0,224L48,213.3C96,203,192,181,288,192C384,203,480,245,576,229.3C672,213,768,139,864,144C960,149,1056,235,1152,240C1248,245,1344,171,1392,133.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg ref={wave2Ref} className="absolute bottom-0 w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path fill="#ffffff" d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,144C672,139,768,181,864,186.7C960,192,1056,160,1152,128C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
      
      {/* 中央AI元素 */}
      <div className="ai-center-element absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200 drop-shadow-[0_0_8px_rgba(120,200,255,0.6)]">AI+</div>
          </div>
        </div>
      </div>
      
      {/* 标题区块 - 现代科技感排版 */}
      <div className="absolute top-[120px] left-0 right-0 z-30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl">
            <div 
              ref={titleRef} 
              className="text-5xl md:text-6xl font-bold tracking-tight relative perspective-500 inline-block"
            >
              源启AI+
            </div>
            <div 
              ref={titleUnderlineRef} 
              className="h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 mt-2 rounded-full w-0"
            ></div>
            <div 
              ref={subtitleRef} 
              className="text-xl md:text-2xl mt-4 text-blue-100 font-light tracking-wide"
              style={{opacity: 0}}
            >
              智能引领未来，AI为您赋能
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}