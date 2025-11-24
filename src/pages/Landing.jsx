import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Workflow from "../components/sections/Workflow";
import Pricing from "../components/sections/Pricing";

export default function Landing() {
  return (
    <div dir="rtl" className="min-h-svh bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute -top-24 start-1/2 -translate-x-1/2 size-[40rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 end-0 size-[24rem] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <Header />
      <Hero />
      <Features />
      <Workflow />
      <Pricing />
      <Footer />
    </div>
  );
}
