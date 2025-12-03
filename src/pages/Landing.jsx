import {lazy, Suspense, useEffect} from "react";
import {useLocation} from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import usePageMeta from "../hooks/usePageMeta";
// Lazy load non-critical sections
const Features = lazy(() => import("../components/sections/Features"));
const Workflow = lazy(() => import("../components/sections/Workflow"));
const Pricing = lazy(() => import("../components/sections/Pricing"));

// Loading skeletons for lazy components
function SectionSkeleton() {
  return (
    <div className="container py-16">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    let attempts = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({behavior: "smooth", block: "start"});
      } else if (attempts < 6) {
        attempts += 1;
        setTimeout(tryScroll, 200);
      }
    };

    // small timeout to allow layout/lazy sections to mount
    setTimeout(tryScroll, 50);
  }, [location]);

  // Set SEO meta for the landing page
  usePageMeta({
    title: "تابيبي — نظام إدارة العيادات والمواعيد",
    description:
      "تابيبي نظام عربي لإدارة العيادات: حجز مواعيد، ملف طبي، فواتير، وتقارير.",
    url: typeof window !== "undefined" ? window.location.href : "/",
    canonical:
      typeof window !== "undefined" ? window.location.href.split("#")[0] : "/",
    image: "/hero-optimized.webp",
  });

  return (
    <div dir="rtl" className="min-h-svh bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute -top-24 start-1/2 -translate-x-1/2 size-[40rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 end-0 size-[24rem] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <Header />
      <Hero />
      {/* Lazy load sections with fallback UI */}
      <Suspense fallback={<SectionSkeleton />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Workflow />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Pricing />
      </Suspense>
      <Footer />
    </div>
  );
}
