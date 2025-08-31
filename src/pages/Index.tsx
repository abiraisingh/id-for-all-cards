import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import IDCardGenerator from "@/components/IDCardGenerator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Team />
        <IDCardGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
