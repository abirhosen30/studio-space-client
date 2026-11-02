import { Hero } from "@/components/hero";
import { Specializations } from "@/components/specializations";
import { BookingWorkflow } from "@/components/booking-workflow";

export default function Home() {
  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Hero />
      <div className="py-8 sm:py-12">
        <Specializations />
      </div>
      <BookingWorkflow />
    </main>
  );
}
