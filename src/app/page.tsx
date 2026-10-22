import { Closing } from "@/components/closing";
import { Compare } from "@/components/compare";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { How } from "@/components/how";
import { Nav } from "@/components/nav";
import { Tides } from "@/components/tides";
import { Voices } from "@/components/voices";
import { Watch } from "@/components/watch";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <How />
        <Compare />
        <Tides />
        <Watch />
        <Voices />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
