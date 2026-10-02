import JourneyTimeline from "@/components/modules/about/journey-timeline";
import Leadership from "@/components/modules/about/leadership";
import Mission from "@/components/modules/about/mission";
import ValuesGrid from "@/components/modules/about/values-grid";

export default function Page() {
  return (
    <div>
      <Mission />
      <ValuesGrid />
      <JourneyTimeline />
      <Leadership />
    </div>
  );
}
