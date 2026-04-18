import { useEffect, useRef, useState } from 'react';
import { Check, Heart, Users, Flame, Crown } from 'lucide-react';
import { leaderboardConfig } from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Check,
  Heart,
  Users,
  Flame,
};

const LeaderboardSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabSwitch = (index: number) => {
    if (index === activeTab || isAnimating) return;
    setIsAnimating(true);

    const content = document.querySelector('.leaderboard-content');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setActiveTab(index);
          gsap.fromTo(
            content,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.1, onComplete: () => setIsAnimating(false) }
          );
        },
      });
    } else {
      setActiveTab(index);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(
        '.lb-header > *',
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

      // Left column
      gsap.fromTo(
        '.lb-left',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lb-columns',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Right column
      gsap.fromTo(
        '.lb-right',
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lb-columns',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const currentEntries = activeTab === 0 ? leaderboardConfig.groups : leaderboardConfig.individuals;
  const maxPoints = Math.max(...currentEntries.map((e) => e.points));

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#8A8A8A';
  };

  return (
    <section
      id="leaderboard"
      ref={sectionRef}
      className="bg-[#121212] py-[120px] px-6 md:px-12 lg:px-[6vw]"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="lb-header mb-16">
          <span className="subsection-label block mb-4">{leaderboardConfig.tag}</span>
          <h2 className="section-title">{leaderboardConfig.heading}</h2>
        </div>

        {/* Two Column Layout */}
        <div className="lb-columns grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Leaderboard */}
          <div className="lb-left lg:col-span-3">
            <div className="glass-card p-6 md:p-8">
              {/* Tabs */}
              <div className="relative flex mb-8 border-b border-[#2A2A2A]">
                <button
                  onClick={() => handleTabSwitch(0)}
                  className="pb-4 px-4 text-sm font-medium transition-colors duration-300 relative"
                  style={{
                    color: activeTab === 0 ? '#FFFFFF' : '#8A8A8A',
                  }}
                >
                  {leaderboardConfig.groupTabLabel}
                  {activeTab === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC0000]" />
                  )}
                </button>
                <button
                  onClick={() => handleTabSwitch(1)}
                  className="pb-4 px-4 text-sm font-medium transition-colors duration-300 relative"
                  style={{
                    color: activeTab === 1 ? '#FFFFFF' : '#8A8A8A',
                  }}
                >
                  {leaderboardConfig.individualTabLabel}
                  {activeTab === 1 && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC0000]" />
                  )}
                </button>
              </div>

              {/* Entries */}
              <div className="leaderboard-content space-y-6">
                {currentEntries.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-10 text-center flex-shrink-0">
                      {entry.rank === 1 ? (
                        <Crown size={20} style={{ color: '#FFD700' }} className="mx-auto" />
                      ) : (
                        <span className="text-lg font-bold" style={{ color: getRankColor(entry.rank) }}>
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: entry.rank === 1
                          ? 'linear-gradient(135deg, #CC0000, #990000)'
                          : '#2A2A2A',
                      }}
                    >
                      <span className="text-white font-semibold text-sm">
                        {entry.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{entry.name}</div>
                      <div className="caption-text">
                        {entry.members ? `${entry.members} members` : `${entry.streak} day streak`}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="hidden sm:block w-[120px] md:w-[160px] flex-shrink-0">
                      <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(entry.points / maxPoints) * 100}%`,
                            backgroundColor: '#CC0000',
                          }}
                        />
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-[#CC0000] font-bold text-lg">{entry.points.toLocaleString()}</span>
                      <span className="caption-text ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Points Explanation */}
          <div className="lb-right lg:col-span-2">
            <div className="lg:sticky lg:top-32">
              <h3 className="card-title mb-4">{leaderboardConfig.pointsTitle}</h3>
              <p className="text-[#C8C8C8] mb-8">{leaderboardConfig.pointsDescription}</p>

              <div className="space-y-5">
                {leaderboardConfig.pointsBreakdown.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      {IconComponent && (
                        <IconComponent size={24} style={{ color: item.color }} />
                      )}
                      <span className="text-white flex-1">{item.label}</span>
                      <span className="caption-text">+{item.points} pts</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 caption-text italic">
                {leaderboardConfig.pointsMotto}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
