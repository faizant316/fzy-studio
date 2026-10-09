/* Selected Work data. The array is the seam: add a project here and it gets
   the same treatment on the home page. Only projects with `detail` get a
   "View details" case study. */

export type CaseStudyData = {
  projectType: string[];
  description: string;
  lead: string;
  stats: { value: number; suffix?: string; label: string }[];
  stack: { label: string; name: string; note: string }[];
  lighthouse: { score: number; label: string }[];
  timeline: { title: string; when: string; body: string; note?: string }[];
  timelineChips: string[];
};

export type Project = {
  client: string;
  category: string;
  year: string;
  status: "live" | "building";
  statusLabel: string;
  summary: string;
  services: string[];
  tech: string[];
  url: string;
  icon?: string;
  quote?: string;
  quoteBy?: { name: string; role: string; img?: string };
  detail?: CaseStudyData;
};

export const projects: Project[] = [
  {
    client: "Makeup by Roko",
    category: "Bridal booking platform",
    year: "2026",
    status: "live",
    statusLabel: "Live since July 2026",
    summary:
      "Online booking, signed agreements, Zelle deposits and an admin dashboard for a bridal makeup artist with 185K followers.",
    services: ["UI/UX design", "Booking & automation", "Full-stack development"],
    tech: ["Next.js 14", "Supabase", "Stripe", "Resend", "Vercel"],
    url: "https://makeupbyroko.org",
    quote: "It took my whole business out of my DMs and built something that runs itself.",
    quoteBy: { name: "Roqia Moshref", role: "Founder, Makeup by Roko", img: "/roko_pic.png" },
    detail: {
      projectType: ["Booking platform", "Admin dashboard", "Automation"],
      lead: "Online booking, signed agreements, deposits and an admin dashboard. Live at makeupbyroko.org.",
      description:
        "We designed and engineered Makeup by Roko end to end. A bride picks a date, signs her service agreement in the app and sends a Zelle deposit. Roko confirms the exact time from her phone, and the platform handles the emails in between.",
      // Counted from the production codebase, October 2026.
      stats: [
        { value: 49, label: "API routes" },
        { value: 21, label: "Branded email templates" },
        { value: 12, label: "Database tables" },
        { value: 7, label: "Admin dashboard tabs" },
      ],
      stack: [
        { label: "Framework", name: "Next.js 14", note: "App Router and 49 API routes" },
        { label: "Database", name: "Supabase", note: "12 tables with row-level security, plus file storage" },
        { label: "Payments", name: "Stripe", note: "Class checkout. Deposits go by Zelle" },
        { label: "Email", name: "Resend", note: "21 branded templates, delivery tracked" },
        { label: "Integrations", name: "Google Maps, Zoom", note: "Travel fees and consultation calls" },
        { label: "Hosting", name: "Vercel", note: "Production hosting and deploys" },
      ],
      lighthouse: [
        { score: 95, label: "Performance" },
        { score: 92, label: "Accessibility" },
        { score: 96, label: "Best practices" },
        { score: 100, label: "SEO" },
      ],
      timeline: [
        { title: "Meet with the client", when: "April 2026", body: "We sat down and mapped how she books clients, prices her services and takes deposits." },
        { title: "Build", when: "May to July 2026", body: "Designed mobile-first, then built the booking flow and admin dashboard with Next.js, Supabase, Stripe and Resend.", note: "10 weeks · 414 commits" },
        { title: "Launch", when: "July 2026", body: "Went live at makeupbyroko.org. Clients now book, sign and send their deposit without the back-and-forth.", note: "Still shipping updates" },
      ],
      timelineChips: ["Live at makeupbyroko.org since July 2026", "550+ commits since May"],
    },
  },
  {
    client: "Wedded App",
    category: "Wedding planning app",
    year: "2026",
    status: "building",
    statusLabel: "In development",
    summary:
      "An all-in-one wedding planner in a single app. Find every vendor, ask for prices and dates in one tap, and plan the whole wedding together with family.",
    services: ["Product design", "iOS & Android app", "Backend & cloud"],
    tech: ["React Native", "Expo", "Supabase", "AWS"],
    url: "",
    icon: "/wedded-icon.png",
  },
];
