import Hero from "@/components/front/Hero";
import AboutSection from "@/components/front/AboutSection";
import ProjectsSection from "@/components/front/ProjectsSection";
import SkillsSection from "@/components/front/SkillsSection";
import BlogPreview from "@/components/front/BlogPreview";
import ContactSection from "@/components/front/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <BlogPreview />
      <ContactSection />
    </>
  );
}
