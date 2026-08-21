import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Landing() {
  useEffect(() => {
    const scrollToHash = (behavior: ScrollBehavior) => {
      const element = window.location.hash ? document.querySelector(window.location.hash) : null;
      element?.scrollIntoView({ behavior });
    };
    requestAnimationFrame(() => scrollToHash("auto"));
    const handleAnchorClick = (e: Event) => {
      const anchor = (e.target as Element).closest("a");
      if (anchor?.hash && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        document.getElementById(anchor.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="case-studies">
          <CaseStudies />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
