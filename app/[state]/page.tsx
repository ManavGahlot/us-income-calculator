import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateData } from "@/lib/geo";

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

// 1. Dynamic SEO for the State Page
export async function generateMetadata({ params }: PageProps) {
  const { state } = await params;
  const stateName = state.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `Salary Needed to Live in ${stateName} (2025 Data)`,
    description: `See rental costs and salary requirements for every city in ${stateName}. Based on official HUD FY2025 data.`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  
  // 2. Fetch all cities for this state
  const cityList = await getStateData(state);

  if (!cityList) {
    return notFound();
  }

  // Convert the object into a sorted array
  const cities = Object.entries(cityList).map(([slug, data]) => ({
    slug,
    name: data.city,
    rent: data.rent,
    zip: data.zip
  })).sort((a, b) => a.name.localeCompare(b.name));

  const stateName = state.replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 capitalize mb-4">
            Rent & Salary Data for {stateName}
          </h1>
          <p className="text-lg text-gray-600">
            Select a city below to calculate affordability based on current 2025 market rents.
          </p>
        </div>

        {/* The Big List of Cities (Internal Links) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <Link 
              key={city.slug}
              href={`/${state}/${city.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-400 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{city.name}</h3>
                  <span className="text-xs text-gray-500">Zip: {city.zip}</span>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-blue-600 text-sm">
                    ${city.rent.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase">2-Bed</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}