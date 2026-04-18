import { useEffect, useRef } from 'react';
import { joinCTAConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const JoinCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-title',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.cta-desc',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.cta-button',
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.cta-subtext',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="join"
      ref={sectionRef}
      className="bg-[#0A0A0A] py-[160px] px-6 relative overflow-hidden"
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(204, 0, 0, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto text-center">
        <h2 className="cta-title section-title whitespace-pre-line mb-6">
          {joinCTAConfig.heading}
        </h2>

        <p className="cta-desc body-large max-w-[520px] mx-auto mb-10">
          {joinCTAConfig.description}
        </p>

        <button className="cta-button h-16 px-12 bg-[#CC0000] text-white font-semibold text-base rounded-xl animate-pulse-glow hover:bg-[#E60000] hover:scale-[1.03] transition-all duration-300">
          {joinCTAConfig.buttonText}
        </button>

        <p className="cta-subtext caption-text mt-6">{joinCTAConfig.subtext}</p>
      </div>
    </section>
  );
};

export default JoinCTASection;
