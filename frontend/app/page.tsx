import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Packages from "@/components/landing/Packages";
import Portfolio from "@/components/landing/Portfolio";
import VoiceDemos from "@/components/landing/VoiceDemos";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/landing/ChatWidget";

export default function LandingPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#FFF8F0] text-[#171313]">
      <Navbar />
      <Hero />
      <Services />
      <Packages />
      <Portfolio />
      <VoiceDemos />
      <Footer />
      <ChatWidget />
    </main>
  );
}
