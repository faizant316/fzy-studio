import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import Process from "@/components/Process";
import ContactReveal from "@/components/ContactReveal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Statement />
      <Work />
      <Process />
      <ContactReveal />
      <Footer />
    </main>
  );
}
