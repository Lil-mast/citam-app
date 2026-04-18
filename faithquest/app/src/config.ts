// ─── Site ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "FaithQuest - CITAM Woodley",
  description: "Your faith journey, gamified for the Woodley Youth. Deep and Bold.",
  language: "en",
};

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface MenuLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface NavigationConfig {
  brandName: string;
  menuLinks: MenuLink[];
  socialLinks: SocialLink[];
  searchPlaceholder: string;
  menuBackgroundImage: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "FaithQuest",
  menuLinks: [
    { label: "Weekly Rhythm", href: "#weekly-rhythm" },
    { label: "Sermons", href: "#sermons" },
    { label: "Leaderboard", href: "#leaderboard" },
    { label: "Join", href: "#join" },
  ],
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/citamwoodley" },
    { icon: "Youtube", label: "YouTube", href: "https://youtube.com/citamwoodley" },
  ],
  searchPlaceholder: "Search...",
  menuBackgroundImage: "/images/hero-bg-fallback.jpg",
};

// ─── Hero ────────────────────────────────────────────────────────────────────

export interface HeroConfig {
  tagline: string;
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryTarget: string;
  ctaSecondaryText: string;
  ctaSecondaryTarget: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  tagline: "CITAM WOODLEY YOUTH",
  title: "Deep and\nBold",
  subtitle: "Your faith journey, gamified for the Woodley Youth",
  ctaPrimaryText: "Launch Quest",
  ctaPrimaryTarget: "#weekly-rhythm",
  ctaSecondaryText: "Download App",
  ctaSecondaryTarget: "#join",
  backgroundImage: "/images/hero-bg-fallback.jpg",
};

// ─── Weekly Rhythm ───────────────────────────────────────────────────────────

export interface RhythmCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  accentColor: string;
  meta?: string;
}

export interface WeeklyRhythmConfig {
  tag: string;
  heading: string;
  description: string;
  cards: RhythmCard[];
}

export const weeklyRhythmConfig: WeeklyRhythmConfig = {
  tag: "THE WEEKLY LOOP",
  heading: "Your Week,\nPurposeful",
  description: "From Monday recaps to Friday hangouts — every day is an opportunity to go deeper.",
  cards: [
    {
      id: "prayer",
      icon: "Heart",
      title: "Prayer Wednesday",
      description: "Mid-week check-in at Prayer Service. Join the prayer chain and lift others up.",
      buttonText: "Set Reminder",
      accentColor: "#3B82F6",
      meta: "countdown",
    },
    {
      id: "hangout",
      icon: "Users",
      title: "Friday Hangout",
      description: "Location-based youth activities at Woodley. Find your crew and show up.",
      buttonText: "View Schedule",
      accentColor: "#CC0000",
      meta: "2 events this week",
    },
    {
      id: "streak",
      icon: "Flame",
      title: "Streak Tracker",
      description: "Consistency beats speed. Build your daily faith discipline and watch it compound.",
      buttonText: "View Leaderboard",
      accentColor: "#CC0000",
      meta: "streak",
    },
  ],
};

// ─── Sermon Sync ─────────────────────────────────────────────────────────────

export interface Sermon {
  id: number;
  title: string;
  date: string;
  series: string;
  image: string;
  isLatest?: boolean;
}

export interface SermonSyncConfig {
  tag: string;
  heading: string;
  description: string;
  sermons: Sermon[];
  viewAllText: string;
}

export const sermonSyncConfig: SermonSyncConfig = {
  tag: "THE SERMON SYNC",
  heading: "Catch the\nFire",
  description: "Watch recaps from Rev. Paul Njoroge's latest messages. Go deeper with Safari Group materials.",
  sermons: [
    {
      id: 1,
      title: "Going Deep in the Secret Place",
      date: "APR 13, 2026",
      series: "Deep and Bold Series",
      image: "/images/sermon-thumb-1.jpg",
      isLatest: true,
    },
    {
      id: 2,
      title: "Bold Faith in a Silent World",
      date: "APR 6, 2026",
      series: "Deep and Bold Series",
      image: "/images/sermon-thumb-2.jpg",
    },
    {
      id: 3,
      title: "The Power of Community",
      date: "MAR 30, 2026",
      series: "Deep and Bold Series",
      image: "/images/sermon-thumb-3.jpg",
    },
    {
      id: 4,
      title: "Transformed for Impact",
      date: "MAR 23, 2026",
      series: "Deep and Bold Series",
      image: "/images/sermon-thumb-4.jpg",
    },
  ],
  viewAllText: "Watch All Sermons",
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  members?: number;
  streak?: number;
  points: number;
}

export interface PointsBreakdown {
  icon: string;
  color: string;
  label: string;
  points: number;
}

export interface LeaderboardConfig {
  tag: string;
  heading: string;
  groupTabLabel: string;
  individualTabLabel: string;
  groups: LeaderboardEntry[];
  individuals: LeaderboardEntry[];
  pointsTitle: string;
  pointsDescription: string;
  pointsBreakdown: PointsBreakdown[];
  pointsMotto: string;
}

export const leaderboardConfig: LeaderboardConfig = {
  tag: "COMMUNITY STANDINGS",
  heading: "Trailblazers",
  groupTabLabel: "Top Safari Groups",
  individualTabLabel: "Individual Trailblazers",
  groups: [
    { rank: 1, name: "Mwangaza Safari", members: 24, points: 2450 },
    { rank: 2, name: "Nuru Collective", members: 18, points: 2180 },
    { rank: 3, name: "Imani Squad", members: 21, points: 1940 },
  ],
  individuals: [
    { rank: 1, name: "Sarah K.", streak: 12, points: 890 },
    { rank: 2, name: "David M.", streak: 9, points: 760 },
    { rank: 3, name: "Grace W.", streak: 8, points: 720 },
  ],
  pointsTitle: "How Points Work",
  pointsDescription: "Points reward consistency, not speed. Show up. Engage. Grow.",
  pointsBreakdown: [
    { icon: "Check", color: "#22C55E", label: "Daily Quest Complete", points: 10 },
    { icon: "Heart", color: "#3B82F6", label: "Prayer Chain Joined", points: 15 },
    { icon: "Users", color: "#CC0000", label: "Friday Hangout Attended", points: 25 },
    { icon: "Flame", color: "#FFD700", label: "7-Day Streak", points: 50 },
  ],
  pointsMotto: "consistency > speed",
};

// ─── Pastor's Corner ─────────────────────────────────────────────────────────

export interface PastorCornerConfig {
  tag: string;
  quote: string;
  quoteHighlight: string;
  attribution: string;
  description: string;
  ctaText: string;
  image: string;
}

export const pastorCornerConfig: PastorCornerConfig = {
  tag: "SENIOR PASTOR'S CORNER",
  quote: "To Know God and\nMake Him Known",
  quoteHighlight: "Make Him Known",
  attribution: "— Rev. Paul Njoroge, Senior Pastor, CITAM Woodley",
  description: "FaithQuest extends what starts on Sunday into every day of the week. Join us as we go deep in our faith and bold in our witness.",
  ctaText: "Meet the Pastoral Team",
  image: "/images/pastor-photo.jpg",
};

// ─── Join CTA ────────────────────────────────────────────────────────────────

export interface JoinCTAConfig {
  heading: string;
  description: string;
  buttonText: string;
  subtext: string;
}

export const joinCTAConfig: JoinCTAConfig = {
  heading: "Ready to Go\nDeep and Bold?",
  description: "Join hundreds of Woodley youth on a journey of faith, community, and transformation. Your quest starts now.",
  buttonText: "Start My Quest",
  subtext: "Free to join • No app store required",
};

// ─── Footer ──────────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterConfig {
  brandName: string;
  brandDescription: string;
  brandLocation: string;
  linkGroups: FooterLinkGroup[];
  legalLinks: FooterLink[];
  copyrightText: string;
  socialLinks: FooterSocialLink[];
}

export const footerConfig: FooterConfig = {
  brandName: "FaithQuest",
  brandDescription: "CITAM Woodley Youth",
  brandLocation: "Impacting the world from Joseph Kangethe Rd.",
  linkGroups: [
    {
      title: "Platform",
      links: [
        { label: "Weekly Rhythm", href: "#weekly-rhythm" },
        { label: "Sermons", href: "#sermons" },
        { label: "Leaderboard", href: "#leaderboard" },
        { label: "Safari Groups", href: "#" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "YouTube", href: "https://youtube.com/citamwoodley" },
        { label: "Instagram", href: "https://instagram.com/citamwoodley" },
        { label: "citamwoodley.org", href: "https://citamwoodley.org" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  copyrightText: "© 2026 FaithQuest by CITAM Woodley. All rights reserved.",
  socialLinks: [
    { icon: "Youtube", label: "YouTube", href: "https://youtube.com/citamwoodley" },
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/citamwoodley" },
  ],
};

// ─── Core Values ─────────────────────────────────────────────────────────────

export interface CoreValue {
  word: string;
  description: string;
  color: string;
}

export const coreValuesConfig: CoreValue[] = [
  {
    word: "Community",
    description: "We are better together. Safari Groups, prayer chains, and shared mission.",
    color: "#CC0000",
  },
  {
    word: "Integrity",
    description: "Authentic faith in public and private. Walking the talk, every single day.",
    color: "#3B82F6",
  },
  {
    word: "Transformation",
    description: "Not just information — formation. Changed lives, renewed minds.",
    color: "#22C55E",
  },
  {
    word: "Accountability",
    description: "Sharpening one another. Consistency over perfection, always.",
    color: "#FFD700",
  },
];
