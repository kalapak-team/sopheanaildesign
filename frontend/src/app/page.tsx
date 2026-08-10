import { DarkHero } from "@/components/DarkHero";
import { FixedNav } from "@/components/FixedNav";
import { HeroCarousel } from "@/components/HeroCarousel";
import { AboutSection } from "@/components/AboutSection";
import { StudySection } from "@/components/StudySection";
import { ServicesHero } from "@/components/ServicesHero";
import { PreislisteSection } from "@/components/PreislisteSection";
import { PromotionsSection } from "@/components/PromotionsSection";
import { InstagramSection } from "@/components/InstagramSection";
import { Footer } from "@/components/Footer";
import { fetchSiteData } from "@/lib/api";
import { fallbackSiteData } from "@/lib/fallback-data";

export default async function HomePage() {
  const remote = await fetchSiteData();
  const data = remote ?? fallbackSiteData;
  const settings = { ...fallbackSiteData.settings, ...data.settings };
  const openingHours = data.opening_hours.length
    ? data.opening_hours
    : fallbackSiteData.opening_hours;
  const heroSlides = data.hero_slides.length
    ? data.hero_slides
    : fallbackSiteData.hero_slides;

  return (
    <main>
      <FixedNav />
      {/* Match https://sopheanaildesign.webflow.io/ section order */}
      <DarkHero
        tagline={settings.hero_tagline}
        phone={settings.phone}
        facebook={settings.facebook}
        instagram={settings.instagram}
      />
      <HeroCarousel slides={heroSlides} />
      {/*
        NOTE: the source site's "Sommer-Aktion" promo card (.preisliste-sec.aktion-1)
        currently has `display: none` in its own production CSS (an old/seasonal
        promo left disabled), so it is intentionally omitted here to match the
        live site 1:1. The always-visible `.preisliste-sec` (price list) comes
        directly after the slider, before the About section.
      */}
      <PreislisteSection />
      <AboutSection settings={settings} />
      <StudySection settings={settings} />
      <ServicesHero />
      <PromotionsSection />
      <InstagramSection settings={settings} />
      <Footer settings={settings} openingHours={openingHours} />
    </main>
  );
}
