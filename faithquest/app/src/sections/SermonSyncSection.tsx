import { useEffect, useRef } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { sermonSyncConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SermonSyncSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.sermon-header > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards slide in
      gsap.fromTo(
        '.sermon-card',
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sermon-carousel',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sermons"
      ref={sectionRef}
      className="bg-[#0A0A0A] py-[120px]"
    >
      <div className="px-6 md:px-12 lg:px-[6vw] max-w-[1280px] mx-auto mb-12">
        {/* Header */}
        <div className="sermon-header">
          <span className="subsection-label block mb-4">{sermonSyncConfig.tag}</span>
          <h2 className="section-title whitespace-pre-line mb-6">{sermonSyncConfig.heading}</h2>
          <p className="body-large max-w-[560px]">{sermonSyncConfig.description}</p>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="sermon-carousel overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-[6vw]">
        <div className="flex gap-6" style={{ scrollSnapType: 'x mandatory' }}>
          {sermonSyncConfig.sermons.map((sermon) => (
            <div
              key={sermon.id}
              className="sermon-card flex-shrink-0 w-[320px] rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                scrollSnapAlign: 'start',
                background: '#121212',
              }}
            >
              {/* Thumbnail */}
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Latest badge */}
                {sermon.isLatest && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-[#CC0000] text-white text-xs font-medium rounded-full">
                    Latest
                  </span>
                )}

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-[#CC0000] flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                    <Play size={20} className="text-white ml-1" fill="white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-[#8A8A8A] text-xs rounded-full mb-3">
                  {sermon.date}
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight mb-2 line-clamp-2">
                  {sermon.title}
                </h3>
                <p className="caption-text">{sermon.series}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 md:px-12 lg:px-[6vw] max-w-[1280px] mx-auto mt-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[#CC0000] font-medium hover:underline transition-all"
        >
          {sermonSyncConfig.viewAllText}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default SermonSyncSection;
