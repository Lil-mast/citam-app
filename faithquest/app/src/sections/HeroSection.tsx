import { useEffect, useRef, useState, useCallback } from 'react';
import { heroConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0, 1);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iDim;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.1 + vec2(3.1, 1.7);
    a *= 0.5;
  }
  return v;
}

float getWaveHeight(vec2 p, float t) {
  float d = length(p);
  return sin(d * 3.0 - t * 1.5) * 0.3
    + sin(d * 7.0 - t * 2.5) * 0.15
    + sin(p.x * 5.0 + t * 1.2) * sin(p.y * 4.0 - t * 0.8) * 0.1
    + exp(-d * d * 2.0) * 0.5;
}

vec2 fluidDistortion(vec2 uv, float t) {
  float n1 = fbm(uv * 3.0 + t * 0.2) * 2.0 - 1.0;
  float n2 = fbm(uv * 2.0 - t * 0.15) * 2.0 - 1.0;
  return vec2(n1, n2) * 0.3;
}

vec4 sampleFluidState(vec2 uv, float t) {
  vec2 fluid = fluidDistortion(uv, t);
  vec2 warpedUV = uv + fluid;
  float wave = getWaveHeight(warpedUV, t);
  float speed = length(fluid);
  return vec4(wave, fluid.x, fluid.y, speed);
}

float sparkle(vec2 uv, float t) {
  float n = noise(uv * 30.0 + t * 0.5);
  float spark = pow(n, 20.0);
  float modulation = sin(t * 3.0 + uv.x * 10.0) * 0.5 + 0.5;
  spark *= modulation;
  return spark * 0.8;
}

float vignette(vec2 uv) {
  return 1.0 - dot(uv, uv) * 0.5;
}

float edgerGlow(vec2 uv, float intensity) {
  return pow(1.0 - abs(uv.x), 3.0) * intensity;
}

vec2 rot2(float a) {
  return vec2(cos(a), sin(a));
}

vec4 sampleAdv(vec2 uv, float t, float ms) {
  uv.y = -uv.y;
  vec2 sc = rot2(-0.2);
  uv = (uv - 0.5) * sc;
  return sampleFluidState(uv, t) + ms;
}

vec3 colorRamp(float h) {
  if (h < 0.15) return vec3(1.0, 0.6, 0.6);
  if (h < 0.3) return vec3(1.0, 0.2, 0.2);
  if (h < 0.5) return vec3(0.8, 0.0, 0.0);
  if (h < 0.7) return vec3(0.5, 0.0, 0.0);
  return vec3(0.15, 0.0, 0.0);
}

vec3 sampleColor(vec2 uv, float t, float ms) {
  vec4 s = sampleAdv(uv, t, ms);
  float h = s.x;
  return colorRamp(h) + vec3(0.5, 0.0, 0.0) * s.w * 0.5;
}

float colComp(vec2 uv, float t, float ms, float d) {
  vec2 uv2 = uv + vec2(d) * 0.02;
  vec4 s = sampleAdv(uv2, t, ms);
  return s.x;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / iResolution.xy;

  vec4 m = vec4(0.0);
  if (iMouse.x > 0.0) {
    m.xy = (iMouse.xy - uv * iResolution.xy) / iResolution.y;
    m.z = length(m.xy);
    m.xy = normalize(m.xy) * log(m.z + 1.0) * 0.3;
  }

  float ms = length(m.xy);
  vec4 s = sampleAdv(uv, iTime, ms);
  float h = s.x;
  float sp = s.w;
  float vc = vignette(uv * 2.0 - 1.0);

  vec3 cc = sampleColor(uv, iTime, ms);
  cc += vec3(0.05, 0.0, 0.0) * edgerGlow(uv * 2.0 - 1.0, 1.0);
  cc += vec3(1.0, 0.8, 0.8) * sparkle(uv, iTime);

  float d = (colComp(uv, iTime, ms, 1.0) - colComp(uv, iTime, ms, -1.0)) * 0.5;
  cc += vec3(0.5, 0.0, 0.0) * abs(d) * 2.0;

  float dim = vc * (1.0 - iDim);
  cc *= dim;

  float gr = smoothstep(0.3, 0.7, h + sp * 0.2) * 0.3;
  vec3 gray = vec3(gr * 0.9);
  cc += (gray + vec3(0.1, 0.0, 0.0)) * 0.3;

  cc += vec3(1.0, 0.3, 0.0) * pow(max(h, 0.0), 3.0) * 0.5;

  cc = pow(cc / (1.0 + cc), vec3(0.9));

  gl_FragColor = vec4(cc, 1.0);
}
`;

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dimRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Initialize WebGL shader
  const initShader = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, VERTEX_SHADER);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, FRAGMENT_SHADER);
    gl.compileShader(fragShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Fullscreen triangle
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Set initial resolution
    const uResolution = gl.getUniformLocation(program, 'iResolution');
    gl.uniform2f(uResolution, canvas.width, canvas.height);

    setIsLoaded(true);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const time = (Date.now() - startTimeRef.current) * 0.001;

    // Smooth mouse
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.uniform1f(gl.getUniformLocation(program, 'iTime'), time);
    gl.uniform2f(gl.getUniformLocation(program, 'iMouse'), mouseRef.current.x, mouseRef.current.y);
    gl.uniform1f(gl.getUniformLocation(program, 'iDim'), dimRef.current);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) * dpr;
      mouseRef.current.targetY = (rect.height - (e.clientY - rect.top)) * dpr;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current.targetX = (touch.clientX - rect.left) * dpr;
        mouseRef.current.targetY = (rect.height - (touch.clientY - rect.top)) * dpr;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Initialize and start animation
  useEffect(() => {
    initShader();
    rafRef.current = requestAnimationFrame(animate);

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Scroll-driven dim
    if (containerRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '200px top',
        scrub: true,
        onUpdate: (self) => {
          dimRef.current = self.progress * 0.4;
        },
      });
    }

    // Handle resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      const gl = glRef.current;
      const program = programRef.current;
      if (!canvas || !gl || !program) return;

      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [initShader, animate]);

  // Hero entrance animations
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      '.hero-title-line',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
    )
      .fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        '.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
        '-=0.3'
      );
  }, [isLoaded]);

  const titleLines = heroConfig.title.split('\n');

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* WebGL Shader Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Fallback background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroConfig.backgroundImage})`,
          zIndex: 0,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <div className="mb-4 opacity-0 hero-subtitle">
          <span className="inline-block text-xs tracking-[0.3em] font-medium uppercase text-[#C8C8C8]">
            {heroConfig.tagline}
          </span>
        </div>

        <h1 className="text-shadow-hero mb-6">
          {titleLines.map((line, i) => (
            <span
              key={i}
              className="hero-title-line block opacity-0"
              style={{
                fontSize: 'clamp(56px, 8vw, 96px)',
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle opacity-0 body-large max-w-lg mx-auto mb-10">
          {heroConfig.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={heroConfig.ctaPrimaryTarget}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(heroConfig.ctaPrimaryTarget)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hero-cta opacity-0 inline-flex items-center justify-center h-14 px-8 bg-[#CC0000] text-white font-semibold text-base rounded-lg animate-pulse-glow hover:bg-[#E60000] hover:scale-[1.03] transition-all duration-300"
          >
            {heroConfig.ctaPrimaryText}
          </a>
          <a
            href={heroConfig.ctaSecondaryTarget}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(heroConfig.ctaSecondaryTarget)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hero-cta opacity-0 inline-flex items-center justify-center h-14 px-8 border border-white text-white font-semibold text-base rounded-lg hover:bg-white hover:text-black transition-all duration-300"
          >
            {heroConfig.ctaSecondaryText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
