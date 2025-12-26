import { notFound } from "next/navigation";
import { getCityData } from "@/lib/geo";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";

// 1. Define Props (Next.js 15+ Style)
interface PageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

// 2. Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  // ⚠️ FIX 1: We must 'await' params here
  const { state, city } = await params;
  
  const data = await getCityData(state, city);

  if (!data) return { title: "City Not Found" };

  const title = `Salary needed to live in ${data.city}, ${state.replace(/-/g, ' ')}`;
  
  return {
    title: `${title} | Income Calculator`,
    description: `Current 2025 rent prices for ${data.city} (${data.zip}). Calculate if you can afford to live in ${data.city}.`,
  };
}

// 3. The Page Content
export default async function CityPage({ params }: PageProps) {
  // ⚠️ FIX 2: We must 'await' params here too!
  // If you forget 'await' here, 'state' becomes undefined -> CRASH.
  const { state, city } = await params;
  
  // Fetch data
  const data = await getCityData(state, city);

  if (!data) {
    notFound();
  }

  const cityName = data.city;
  const stateName = state.replace(/-/g, ' ').toUpperCase();
  const rentPrice = data.rent;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 capitalize">
          Salary needed for {cityName}
        </h1>
        <p className="text-lg text-gray-600">
          Current market data for <strong>{cityName}, {stateName}</strong> (Zip: {data.zip}).
          <br />
          Based on HUD FY2026 Fair Market Rents.
        </p>
      </div>

      <div className="w-full max-w-lg">
        {/* We will pass the specific rent to the calculator soon */}
        <div className="w-full max-w-lg">
        {/* Pass the data we found into the calculator */}
        <AffordabilityCalculator 
          initialZip={data.zip} 
          initialRent={data.rent} 
          initialCity={data.city} 
        />
      </div>
      </div>

      <article className="max-w-2xl w-full mt-16 prose prose-blue">
        <h3>How much do you need to earn?</h3>
        <p>
          To live comfortably in <strong>{cityName}</strong>, housing experts recommend spending no more than 30% of your gross monthly income on rent.
        </p>
        <p>
          The current fair market rent for a 2-bedroom apartment in this area is <strong>${rentPrice.toLocaleString()}/mo</strong>.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 not-prose">
          <p className="text-blue-800 font-medium m-0">
            💡 <strong>Quick Math:</strong> You typically need to earn roughly 
            <strong> ${(rentPrice * 3.33 * 12).toLocaleString()} per year</strong> to get approved for an apartment here.
          </p>
        </div>
      </article>

    </main>
  );
}