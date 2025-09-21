import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemStatement from "@/components/ProblemStatement";
import FeaturesGrid from "@/components/FeaturesGrid";
import NewsSection from "@/components/NewsSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import DistrictReach from "@/components/DistrictReach";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <ProblemStatement />
        </section>
        <section id="features">
          <FeaturesGrid />
        </section>
        <section id="news">
          <NewsSection />
        </section>
        <section id="health-worker-connect">
          <DepartmentsSection />
        </section>
        <section id="resources">
          <DistrictReach />
        </section>
      </main>
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default Index;