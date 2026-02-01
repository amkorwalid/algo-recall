import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Pricing from '../components/home/Pricing';
import FAQ from '../components/home/FAQ';
import Footer from '../components/home/Footer';
import Problem from '../components/home/Problem';
import Solution from '../components/home/Solution';
import HowItWorks from '../components/home/HowItWorks';
import WhoItsFor from '../components/home/WhoItsFor';
import WhyAlgoRecall from '../components/home/WhyAlgoRecall';
import FinalCTA from '../components/home/FinalCTA';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <WhyAlgoRecall />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}