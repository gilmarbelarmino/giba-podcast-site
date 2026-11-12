import { useSiteContent } from "@/lib/useSiteContent";
import { useEffect } from "react";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Episodes } from "@/components/site/Episodes";
import { Footer } from "@/components/site/Footer";
import { Guests } from "@/components/site/Guests";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Newsletter } from "@/components/site/Newsletter";
import { Sponsorship } from "@/components/site/Sponsorship";
import { Stats } from "@/components/site/Stats";
import { Topics } from "@/components/site/Topics";

export default function Home() {
  const { content } = useSiteContent();

  useEffect(() => {
    document.title = `${content.brand.name} — ${content.brand.tagline}`;
  }, [content.brand.name, content.brand.tagline]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Header brand={content.brand} />
      <main>
        <Hero content={content} />
        <Marquee items={content.marquee} />
        <Episodes content={content} />
        <Topics topics={content.topics} />
        <About about={content.about} brand={content.brand} />
        <Stats stats={content.stats} />
        <Guests content={content} />
        <Sponsorship sponsorship={content.sponsorship} />
        <Contact content={content} />
        <Newsletter newsletter={content.newsletter} />
      </main>
      <Footer content={content} />
    </div>
  );
}
