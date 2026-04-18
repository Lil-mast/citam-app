import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { pastorCornerConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PastorCornerSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image fade in
      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Text stagger
      gsap.fromTo(
        '.pastor-text > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Split the quote into parts to highlight
  const quoteLines = pastorCornerConfig.quote.split('\n');
  const highlightParts = pastorCornerConfig.quoteHighlight.split(' ');

  return (
    <section
      id="pastor"
      ref={sectionRef}
      className="bg-[#0A0A0A] min-h-[600px] flex flex-col lg:flex-row"
    >
      {/* Left: Image */}
      <div
        ref={imageRef}
        className="lg:w-1/2 h-[400px] lg:h-auto relative overflow-hidden"
      >
        <img
          src={pastorCornerConfig.image}
          alt="Rev. Paul Njoroge"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent lg:hidden" />
      </div>

      {/* Right: Text */}
      <div className="lg:w-1/2 flex items-center px-6 md:px-12 lg:px-[6vw] py-16 lg:py-0">
        <div className="pastor-text max-w-[440px]">
          <span className="subsection-label block mb-6">{pastorCornerConfig.tag}</span>

          <h2 className="section-title whitespace-pre-line mb-6">
            {quoteLines.map((line, i) => (
              <span key={i} className="block">
                {line.split(' ').map((word, wi) => {
                  const isHighlight = highlightParts.includes(word);
                  return (
                    <span
                      key={wi}
                      style={{ color: isHighlight ? '#CC0000' : '#FFFFFF' }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          <p className="text-[#8A8A8A] mb-4">{pastorCornerConfig.attribution}</p>

          <p className="body-large mb-8">{pastorCornerConfig.description}</p>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#CC0000] font-medium hover:underline transition-all"
          >
            {pastorCornerConfig.ctaText}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PastorCornerSection;
