# Particlewaves 组件文档

`Particlewaves` 是一个高度可定制的动态背景组件，结合了SVG动画、粒子系统和波浪效果，为您的应用提供现代化的技术感视觉体验。

## 目录

- [Particlewaves 组件文档](#particlewaves-组件文档)
  - [目录](#目录)
  - [基本用法](#基本用法)
  - [核心参数](#核心参数)
    - [示例](#示例)
  - [视觉风格参数](#视觉风格参数)
    - [示例](#示例-1)
  - [动画控制参数](#动画控制参数)
    - [示例](#示例-2)
  - [粒子系统参数](#粒子系统参数)
    - [示例](#示例-3)
  - [高级定制参数](#高级定制参数)
    - [示例](#示例-4)
  - [完整参数示例](#完整参数示例)
  - [主题预设](#主题预设)
    - [科技蓝主题](#科技蓝主题)
    - [活力橙主题](#活力橙主题)

## 基本用法

使用默认配置：

```tsx
import { Particlewaves } from '@/components/client/banners';

export default function Banner() {
  return (
    <div className="relative w-full h-[600px]">
      <Particlewaves />
    </div>
  );
}
```

## 核心参数

这些是最基本的配置参数，决定了组件的核心外观：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| svgTitle | React.ReactNode | (默认AI+的SVG路径) | 自定义SVG标题内容 |
| subtitle | string | '源溯万象，智启未来' | 副标题文本 |
| titlePosition | {top: string, left: string} | {top: '1/3', left: '10%'} | 标题在容器中的位置 |
| backgroundColor | {from: string, to: string} | {from: '#030d24', to: '#0a192f'} | 背景渐变色 |

### 示例

```tsx
<Particlewaves 
  svgTitle={<path d="M10,10 L50,10 L50,50 L10,50 Z" />} // 自定义SVG路径
  subtitle="AI驱动的未来" 
  titlePosition={{ top: '1/4', left: '5%' }}
  backgroundColor={{ from: '#000428', to: '#004e92' }}
/>
```

## 视觉风格参数

这些参数控制组件的视觉风格和色彩方案：

| 参数 | 类型 | 说明 |
|------|------|------|
| titleGradient | {color1: string, color2: string, color3: string} | 标题文字的渐变色 |
| subtitleGradient | {from: string, via?: string, to: string, animationDuration?: number} | 副标题的渐变色和动画 |
| backgroundLights | {light1: {...}, light2: {...}} | 背景中的发光效果 |
| waveGradient1 | {color1, color2, color3, opacity1, opacity2, opacity3} | 前景波浪渐变色 |
| waveGradient2 | {color1, color2, color3, opacity1, opacity2, opacity3} | 背景波浪渐变色 |
| underlineGradient | {from: string, via: string, to: string} | 下划线渐变色 |

### 示例

```tsx
<Particlewaves 
  titleGradient={{
    color1: '#ff4d4d',
    color2: '#f9cb28',
    color3: '#ff4d4d'
  }}
  subtitleGradient={{
    from: 'rgba(249, 203, 40, 0.9)',
    via: 'rgba(255, 77, 77, 0.9)',
    to: 'rgba(249, 203, 40, 0.9)',
    animationDuration: 2000
  }}
  backgroundLights={{
    light1: {
      color: '#f9cb28',
      size: 120,
      blur: 150,
      position: {top: '1/5', left: '10'}
    },
    light2: {
      color: '#ff4d4d',
      size: 100,
      blur: 130,
      position: {bottom: '1/4', right: '5'}
    }
  }}
  waveGradient1={{
    color1: 'rgba(255, 77, 77, 0.15)',
    color2: 'rgba(249, 203, 40, 0.25)',
    color3: 'rgba(255, 77, 77, 0.15)',
    opacity1: 0,
    opacity2: 50,
    opacity3: 100
  }}
/>
```

## 动画控制参数

这些参数精细控制各种动画效果：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| titleAnimationDuration | number | 650 | 标题描边动画持续时间(ms) |
| titleAnimationDelay | number | 40 | 标题描边动画字符间延迟(ms) |
| underlineAnimationDuration | number | 800 | 下划线动画持续时间(ms) |
| subtitleAnimationDuration | number | 600 | 副标题淡入动画持续时间(ms) |
| subtitleAnimationDelay | number | 100 | 副标题动画延迟时间(ms) |
| waveAnimationDuration | number | 15000 | 波浪动画周期时间(ms) |

### 示例

```tsx
<Particlewaves 
  titleAnimationDuration={800}
  titleAnimationDelay={60}
  underlineAnimationDuration={600}
  subtitleAnimationDuration={500}
  subtitleAnimationDelay={50}
  waveAnimationDuration={20000}
/>
```

## 粒子系统参数

控制背景粒子系统的表现：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| particleCount | number | 180 | 粒子数量 |
| particleBaseSize | number | 1.5 | 粒子基础大小 |
| particleBaseSpeed | number | 0.3 | 粒子基础速度 |
| particleColorRange | {hueStart, hueEnd, saturation, lightness, opacity} | {hueStart: 200, hueEnd: 240...} | 粒子色彩范围 |

### 示例

```tsx
<Particlewaves 
  particleCount={250}
  particleBaseSize={1.0}
  particleBaseSpeed={0.4}
  particleColorRange={{
    hueStart: 0,
    hueEnd: 60,
    saturation: 85,
    lightness: 65,
    opacity: 0.75
  }}
/>
```

## 高级定制参数

这些参数提供精细的样式控制：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| titleStrokeColor | string | '#4f46e5' | 标题描边颜色 |
| titleStrokeWidth | string | '1.5px' | 标题描边宽度 |
| subtitleClass | string | 'mt-2 text-2xl font-light tracking-wide' | 副标题样式类 |
| subtitleColor | string | '#e0f2fe' | 副标题文字颜色（用于非渐变时） |
| wavePaths | string[] | [...] | 自定义波浪路径数据 |

### 示例

```tsx
<Particlewaves 
  titleStrokeColor="#f43f5e"
  titleStrokeWidth="2px"
  subtitleClass="mt-4 text-3xl font-medium tracking-wider"
  subtitleColor="#fef3c7"
  wavePaths={[
    'M0,150 C300,280,400,220,600,200 C900,180,1100,320,1440,280 L1440,400 L0,400 Z',
    'M0,170 C120,200,320,140,640,240 C850,300,1120,270,1440,240 L1440,400 L0,400 Z',
    'M0,190 C220,250,420,200,640,260 C950,290,1110,230,1440,210 L1440,400 L0,400 Z'
  ]}
/>
```

## 完整参数示例

以下是一个综合所有参数的完整示例，展示了如何创建自定义主题的粒子波浪背景：

```tsx
<Particlewaves 
  // 核心参数
  subtitle="智能科技，引领未来"
  titlePosition={{ top: '1/4', left: '8%' }}
  backgroundColor={{ from: '#000428', to: '#004e92' }}
  
  // 视觉风格
  titleGradient={{
    color1: '#60a5fa',
    color2: '#34d399',
    color3: '#818cf8'
  }}
  subtitleGradient={{
    from: 'rgba(96, 165, 250, 0.9)',
    via: 'rgba(52, 211, 153, 0.9)',
    to: 'rgba(129, 140, 248, 0.9)',
    animationDuration: 3000
  }}
  backgroundLights={{
    light1: {
      color: '#60a5fa',
      size: 150,
      blur: 130,
      position: {top: '1/5', left: '0'}
    },
    light2: {
      color: '#34d399',
      size: 120,
      blur: 140,
      position: {bottom: '1/4', right: '5'}
    }
  }}
  underlineGradient={{
    from: '#60a5fa/80',
    via: '#34d399',
    to: '#818cf8/80'
  }}
  
  // 动画控制
  titleAnimationDuration={700}
  titleAnimationDelay={50}
  underlineAnimationDuration={800}
  subtitleAnimationDuration={700}
  subtitleAnimationDelay={80}
  
  // 粒子系统
  particleCount={220}
  particleBaseSize={1.2}
  particleBaseSpeed={0.35}
  particleColorRange={{
    hueStart: 190,
    hueEnd: 260,
    saturation: 75,
    lightness: 60,
    opacity: 0.8
  }}
  
  // 波浪配置
  waveAnimationDuration={18000}
  waveGradient1={{
    color1: 'rgba(96, 165, 250, 0.15)',
    color2: 'rgba(52, 211, 153, 0.25)',
    color3: 'rgba(129, 140, 248, 0.15)',
    opacity1: 0,
    opacity2: 50,
    opacity3: 100
  }}
  waveGradient2={{
    color1: 'rgba(96, 165, 250, 0.05)',
    color2: 'rgba(52, 211, 153, 0.15)',
    color3: 'rgba(129, 140, 248, 0.05)',
    opacity1: 0,
    opacity2: 50,
    opacity3: 100
  }}
/>
```

## 主题预设

### 科技蓝主题

```tsx
<Particlewaves 
  backgroundColor={{ from: '#0f172a', to: '#1e293b' }}
  titleGradient={{
    color1: '#3b82f6',
    color2: '#06b6d4',
    color3: '#2563eb'
  }}
  subtitleGradient={{
    from: 'rgba(59, 130, 246, 0.9)',
    via: 'rgba(6, 182, 212, 0.9)',
    to: 'rgba(37, 99, 235, 0.9)',
  }}
  backgroundLights={{
    light1: { color: '#3b82f6', size: 120, blur: 130, position: {top: '1/5', left: '0'} },
    light2: { color: '#06b6d4', size: 100, blur: 120, position: {bottom: '1/4', right: '10'} }
  }}
/>
```

### 活力橙主题

```tsx
<Particlewaves 
  backgroundColor={{ from: '#1a1a1a', to: '#262626' }}
  titleGradient={{
    color1: '#f97316',
    color2: '#fbbf24',
    color3: '#ea580c'
  }}
  particleColorRange={{
    hueStart: 20,
    hueEnd: 50,
    saturation: 90,
    lightness: 60,
    opacity: 0.7
  }}
  backgroundLights={{
    light1: { color: '#f97316', size: 110, blur: 130, position: {top: '1/5', left: '0'} },
    light2: { color: '#fbbf24', size: 90, blur: 120, position: {bottom: '1/4', right: '10'} }
  }}
/>
```

以上就是 Particlewaves 组件的全部配置参数和使用示例，通过这些参数的组合，您可以创建出各种风格的动态背景效果。