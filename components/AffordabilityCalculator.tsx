"use client";

import { useState, useEffect } from "react";

// 1. Define inputs (Props) the component can accept
interface Props {
  initialZip?: string;
  // FIX: Allow 'null' so the default value works
  initialRent?: number | null;
  initialCity?: string;
}

interface ZipData {
  r: number; // rent
  s: string; // state slug
  c: string; // city name
}

interface ZipIndex {
  [key: string]: ZipData;
}

// 2. Accept the props in the function
export default function AffordabilityCalculator({ 
  initialZip = "", 
  initialRent = null, 
  initialCity = "Enter Zip Code" 
}: Props) {
  
  // 3. Initialize State with the passed data (Auto-fill)
  const [zipCode, setZipCode] = useState(initialZip);
  const [salary, setSalary] = useState("");
  const [locationName, setLocationName] = useState(initialCity);
  const [currentRent, setCurrentRent] = useState<number | null>(initialRent);
  
  // Database State
  const [db, setDb] = useState<ZipIndex | null>(null);

  // Load the search index
  useEffect(() => {
    fetch("/data/zip_index.json")
      .then((res) => res.json())
      .then((data) => setDb(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 5);
    setZipCode(val);

    if (val.length === 5 && db) {
      const found = db[val];
      if (found) {
        setLocationName(`${found.c.toUpperCase()}`);
        setCurrentRent(found.r);
      } else {
        setLocationName("LOCATION NOT FOUND");
        setCurrentRent(null);
      }
    } else {
      if (val.length === 0) {
        setLocationName("Enter Zip Code");
        setCurrentRent(null);
      }
    }
  };

  const calculateResult = () => {
    if (!salary || !currentRent) return null;

    const annualSalary = parseFloat(salary.replace(/,/g, ""));
    const monthlyGross = annualSalary / 12;
    const monthlyNet = monthlyGross * 0.78; 
    
    const affordableRent = monthlyGross * 0.30;
    const isAffordable = currentRent <= affordableRent;
    const percentOfIncome = (currentRent / monthlyGross) * 100;

    return { isAffordable, percentOfIncome, monthlyNet };
  };

  const result = calculateResult();

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full border border-gray-100">
      
      {/* HEADER */}
      <div className="bg-blue-600 p-6 text-center text-white">
        <h2 className="text-2xl font-bold">Can I Afford It?</h2>
        <p className="text-blue-100 text-sm mt-1 uppercase tracking-wide">
          {locationName}
        </p>
      </div>

      {/* BODY */}
      <div className="p-8 space-y-6">
        
        {/* INPUT 1: ZIP CODE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Where do you want to live?
          </label>
          <input
            type="number"
            placeholder="Enter Zip Code"
            value={zipCode}
            onChange={handleZipChange}
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Dynamic Rent Display */}
        {currentRent && (
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm font-medium text-center">
            Average 2-Bed Rent: <strong>${currentRent.toLocaleString()}/mo</strong>
          </div>
        )}

        {/* INPUT 2: SALARY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What is your Annual Salary?
          </label>
          <input
            type="number"
            placeholder="$ e.g. 65000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            // Unlocked if rent is present
            disabled={!currentRent} 
            className={`w-full p-4 border-2 rounded-lg text-lg focus:outline-none transition-colors ${
              !currentRent 
                ? "bg-gray-100 border-gray-200 cursor-not-allowed" 
                : "bg-gray-50 border-gray-200 focus:border-blue-500"
            }`}
          />
        </div>

        {/* RESULTS BOX */}
        <div className="pt-4">
          {result ? (
            <div
              className={`text-center p-6 rounded-xl border-2 ${
                result.isAffordable
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <h3 className="text-3xl font-extrabold mb-1">
                {result.isAffordable ? "YES ✅" : "NO ❌"}
              </h3>
              <p className="text-sm font-medium opacity-80">
                Rent is <strong>{result.percentOfIncome.toFixed(1)}%</strong> of your income.
              </p>
            </div>
          ) : (
            <div className="text-center p-6 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              {currentRent ? "Enter salary to see result" : "Enter details to calculate"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}