import FeaturesGrid from "@/components/modules/homepage/features-grid";
import Hero from "@/components/modules/homepage/Hero";
import HomeCta from "@/components/modules/homepage/home-cta";
import HowItWorks from "@/components/modules/homepage/how-it-works";
import Perspectives from "@/components/modules/homepage/perspectives";

export default function Page() {
  return (
    <div>
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <Perspectives />
      <HomeCta />
    </div>
  );
}
