import { AboutTeam } from "./modules/about-team/about-team"
import { AboutResults } from "./modules/about-results/about-results"
import { AppSection } from "./modules/app-section"
import { Footer } from "./modules/footer"
import { Hero } from "./modules/hero"
import { PriceSection } from "./modules/price-section"
import { AboutProject } from "./modules/about-project/about-project"
import { AboutTech } from "./modules/about-tech/about-tech"

function App() {
  return (
    <main className="bg-bg">
      <div className="min-h-screen max-w-[640px] w-[95%] mx-auto flex flex-col gap-y-12 pt-12">
        <Hero/>
        <AboutProject/>
        <AppSection/>
        <AboutResults/>
        <AboutTech/>
        <PriceSection/>
        <AboutTeam/>
        <Footer/>
      </div>
    </main>
  )
}

export default App
