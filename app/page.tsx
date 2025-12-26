import Link from "next/link";
import AffordabilityCalculator from "../components/AffordabilityCalculator";

// Hardcoded list of states to ensure perfect linking
const STATES = [
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", 
  "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", 
  "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", 
  "maine", "maryland", "massachusetts", "michigan", "minnesota", 
  "mississippi", "missouri", "montana", "nebraska", "nevada", 
  "new-hampshire", "new-jersey", "new-mexico", "new-york", 
  "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon", 
  "pennsylvania", "rhode-island", "south-carolina", "south-dakota", 
  "tennessee", "texas", "utah", "vermont", "virginia", "washington", 
  "west-virginia", "wisconsin", "wyoming", "district-of-columbia"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* HERO SECTION */}
      <div className="w-full bg-white border-b border-gray-100 pb-12 pt-12 px-4 flex flex-col items-center">
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            US Salary & Rent Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Find out exactly how much you need to earn to live comfortably in any zip code. 
            Based on the <strong>30% Rent Rule</strong> and official 2025 HUD data.
          </p>
        </div>

        {/* MAIN CALCULATOR */}
        <div className="w-full max-w-lg relative z-10">
          <AffordabilityCalculator />
        </div>
      </div>

      {/* STATE LINKS (SEO HONEYPOT) */}
      <section className="w-full max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Browse Rent Data by State
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {STATES.map((state) => (
            <Link 
              key={state} 
              href={`/${state}`}
              className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all capitalize text-center"
            >
              {state.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm mt-auto border-t">
        <p>© 2025 Income Calculator • Data source: HUD User</p>
      </footer>

    </main>
  );
}