import { useEffect } from 'react';
import { siteConfig } from '../config';
import Navigation from '../sections/Navigation';
import HeroSection from '../sections/HeroSection';
import CoreValuesSection from '../sections/CoreValuesSection';
import WeeklyRhythmSection from '../sections/WeeklyRhythmSection';
import SermonSyncSection from '../sections/SermonSyncSection';
import LeaderboardSection from '../sections/LeaderboardSection';
import PastorCornerSection from '../sections/PastorCornerSection';
import JoinCTASection from '../sections/JoinCTASection';
import Footer from '../sections/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all sections mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]" lang={siteConfig.language || 'en'}>
      <Navigation />
      <main>
        <HeroSection />
        <CoreValuesSection />
        <WeeklyRhythmSection />
        <SermonSyncSection />
        <LeaderboardSection />
        <PastorCornerSection />
        <JoinCTASection />
      </main>
      <Footer />
    </div>
  );
}
