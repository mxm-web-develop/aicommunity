'use client'
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function WaveBanner() {
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  
  useEffect(() => {
    // 波浪动画
    const wave1Anim = anime({
      targets: wave1Ref.current,
      translateX: '-50%',
      loop: true,
      duration: 20000,
      easing: 'linear'
    });

    const wave2Anim = anime({
      targets: wave2Ref.current,
      translateX: '-30%',
      loop: true,
      duration: 15000,
      easing: 'linear',
      direction: 'reverse' // 替代 GSAP 的 reversed
    });

    // 文字动画 - 科技感打字+显现效果
    if (titleRef.current && subtitleRef.current) {
      // 预处理标题文本
      const titleElement = titleRef.current;
      const titleText = titleElement.textContent;
      titleElement.innerHTML = '';
      
      // 为每个字符创建独立的span元素
      [...titleText].forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.display = 'inline-block';
        titleElement.appendChild(charSpan);
      });

      // 标题动画 - 逐字显现
      anime.timeline({
        easing: 'easeOutExpo',
      })
      .add({
        targets: titleElement.querySelectorAll('span'),
        opacity: [0, 1],
        translateY: [20, 0],
        translateZ: 0,
        duration: 1200,
        delay: (el, i) => 300 + 50 * i,
      })
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 800,
      }, '-=800');
      
      // 标题持续的轻微浮动效果
      setTimeout(() => {
        anime({
          targets: titleElement.querySelectorAll('span'),
          translateY: [0, -3, 0],
          opacity: [1, 0.9, 1],
          easing: 'easeInOutQuad',
          duration: 2000,
          delay: (el, i) => 100 * i,
          loop: true
        });
      }, 2000);
    }

    // 交互动画
    const container = containerRef.current;
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 16) return; // 限制帧率约60fps
      lastTime = now;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      anime.set([wave1Ref.current, wave2Ref.current], {
        scaleY: 1 + y * 0.2,
        skewX: (x - 0.5) * 10,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      wave1Anim.pause();
      wave2Anim.pause();
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-gradient-to-b from-blue-900 to-blue-500">
      {/* SVG 波浪 */}
      <svg ref={wave1Ref} className="absolute bottom-0 w-[200%] opacity-30" viewBox="0 0 1440 320">
        <path fill="#ffffff" d="M0,224L48,213.3C96,203,192,181,288,192C384,203,480,245,576,229.3C672,213,768,139,864,144C960,149,1056,235,1152,240C1248,245,1344,171,1392,133.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
      <svg ref={wave2Ref} className="absolute bottom-0 w-[200%] opacity-20" viewBox="0 0 1440 320">
        <path fill="#ffffff" d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,144C672,139,768,181,864,186.7C960,192,1056,160,1152,128C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
      
      {/* 浮动 AI 元素 */}
      <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="text-6xl font-bold text-white">AI+</div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-[140px] left-[80px] z-20 text-white">
        <div className="container">
          <div ref={titleRef} className="text-4xl font-bold tracking-wide relative">
            源启AI+
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300" id="title-underline"></div>
          </div>
          <div ref={subtitleRef} className="text-xl mt-2" style={{opacity: 0}}>智能引领未来，AI为您赋能</div>
        </div>
      </div>
    </div>
  );
}