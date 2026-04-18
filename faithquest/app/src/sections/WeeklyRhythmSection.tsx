import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, Users, Flame } from 'lucide-react';
import { weeklyRhythmConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Heart,
  Users,
  Flame,
};

// Prayer countdown timer
const PrayerCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isLive, setIsLive] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));

    // Find next Wednesday at 18:30
    const target = new Date(nairobiTime);
    target.setHours(18, 30, 0, 0);

    const dayOfWeek = nairobiTime.getDay();
    const daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
    target.setDate(nairobiTime.getDate() + daysUntilWednesday);

    // If it's already past Wednesday 18:30, go to next week
    if (daysUntilWednesday === 0 && nairobiTime.getHours() >= 18 && nairobiTime.getMinutes() >= 30) {
      target.setDate(target.getDate() + 7);
    }

    const diff = target.getTime() - nairobiTime.getTime();

    if (diff <= 0) {
      setIsLive(true);
      return;
    }

    setIsLive(false);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeLeft({ days, hours, minutes });
  }, []);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  if (isLive) {
    return (
      <div className="flex items-center gap-2 text-[#22C55E]">
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-dot" />
        <span className="font-mono text-sm font-semibold">Prayer Service is LIVE now</span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm" style={{ color: '#3B82F6' }}>
      {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
    </div>
  );
};

// Streak tracker component
const StreakTracker = () => {
  const days = [true, true, true, true, true, true, false]; // Mon-Sun
  const streak = 12;

  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-2">
        {days.map((active, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-sm transition-colors"
            style={{
              backgroundColor: active ? '#CC0000' : '#2A2A2A',
            }}
          />
        ))}
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-[#CC0000]" style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
          {streak}
        </div>
        <div className="caption-text">day streak</div>
      </div>
    </div>
  );
};

const WeeklyRhythmSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.rhythm-header > *',
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

      // Card stagger
      gsap.fromTo(
        '.rhythm-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.rhythm-cards',
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
      id="weekly-rhythm"
      ref={sectionRef}
      className="bg-[#121212] py-[120px] px-6 md:px-12 lg:px-[6vw]"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="rhythm-header mb-16">
          <span className="subsection-label block mb-4">{weeklyRhythmConfig.tag}</span>
          <h2 className="section-title whitespace-pre-line mb-6">{weeklyRhythmConfig.heading}</h2>
          <p className="body-large max-w-[560px]">{weeklyRhythmConfig.description}</p>
        </div>

        {/* Cards Grid */}
        <div className="rhythm-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklyRhythmConfig.cards.map((card) => {
            const IconComponent = iconMap[card.icon];
            return (
              <div key={card.id} className="rhythm-card glass-card p-8">
                {IconComponent && (
                  <IconComponent
                    size={32}
                    className="mb-6"
                    style={{ color: card.accentColor }}
                  />
                )}

                <h3 className="card-title mb-4">{card.title}</h3>
                <p className="text-[#C8C8C8] mb-6">{card.description}</p>

                {/* Interactive element */}
                <div className="mb-6">
                  {card.id === 'prayer' && <PrayerCountdown />}
                  {card.id === 'hangout' && (
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-dot" />
                      <span className="caption-text">{card.meta}</span>
                    </div>
                  )}
                  {card.id === 'streak' && <StreakTracker />}
                </div>

                <button
                  className="h-10 px-5 rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-80"
                  style={{
                    border: `1px solid ${card.accentColor}`,
                    color: card.accentColor,
                    background: 'transparent',
                  }}
                >
                  {card.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeeklyRhythmSection;
