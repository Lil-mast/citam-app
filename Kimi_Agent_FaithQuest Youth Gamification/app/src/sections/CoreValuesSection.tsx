import { useEffect, useRef, useState } from 'react';
import { coreValuesConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CoreValuesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const triggers: ScrollTrigger[] = [];

    // Create scroll trigger for each value
    coreValuesConfig.forEach((_, index) => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: () => `${(index / coreValuesConfig.length) * 100}% top`,
        end: () => `${((index + 1) / coreValuesConfig.length) * 100}% top`,
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Animate text change
  useEffect(() => {
    if (!textRef.current) return;

    const elements = textRef.current.querySelectorAll('.value-content');
    elements.forEach((el, i) => {
      if (i === activeIndex) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      } else {
        gsap.to(el, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' });
      }
    });
  }, [activeIndex]);

  return (
    <section
      id="values"
      ref={containerRef}
      className="relative bg-[#0A0A0A]"
      style={{ height: `${coreValuesConfig.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${coreValuesConfig[activeIndex].color}15 0%, transparent 60%)`,
          }}
        />

        {/* Central text display */}
        <div ref={textRef} className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          {coreValuesConfig.map((value, index) => (
            <div
              key={value.word}
              className="value-content absolute inset-0 flex flex-col items-center justify-center"
              style={{
                opacity: index === 0 ? 1 : 0,
                position: index === activeIndex ? 'relative' : 'absolute',
              }}
            >
              <h2
                className="mb-6"
                style={{
                  fontSize: 'clamp(48px, 10vw, 120px)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.04em',
                  color: value.color,
                  textShadow: `0 0 60px ${value.color}40`,
                }}
              >
                {value.word}
              </h2>
              <p className="body-large max-w-md mx-auto">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {coreValuesConfig.map((value, index) => (
            <button
              key={value.word}
              onClick={() => {
                const container = containerRef.current;
                if (container) {
                  const sectionHeight = container.offsetHeight / coreValuesConfig.length;
                  window.scrollTo({
                    top: container.offsetTop + sectionHeight * index,
                    behavior: 'smooth',
                  });
                }
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === activeIndex ? value.color : '#2A2A2A',
                transform: index === activeIndex ? 'scale(1.5)' : 'scale(1)',
              }}
              aria-label={`Go to ${value.word}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
