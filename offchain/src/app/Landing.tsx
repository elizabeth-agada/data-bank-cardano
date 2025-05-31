import FeaturesSection from "@/components/features-section"
import Navbar from "@/components/heroNav"
import HeroSection from "@/components/heroSection"
import HowItWorks from "@/components/how-it-works"
import FAQSection from "@/components/faq-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-[url('/img/landing.png')] bg-cover bg-center min-h-screen">
      <Navbar/>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorks />
      <FAQSection/>
      <Footer/>
    </main>
  )
}

