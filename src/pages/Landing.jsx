import { lazy, Suspense, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Hero from "../components/sections/Hero"
// Lazy load non-critical sections
const Features = lazy(() => import("../components/sections/Features"))
const Workflow = lazy(() => import("../components/sections/Workflow"))
const Pricing = lazy(() => import("../components/sections/Pricing"))

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
  )
}

export default function Landing() {
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