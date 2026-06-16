import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import Capabilities from "@/components/Capabilities";
import ContactReveal from "@/components/ContactReveal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Statement />
      <Work />
      <Capabilities />
      <ContactReveal />
      <Footer />
    </main>
  );
}
