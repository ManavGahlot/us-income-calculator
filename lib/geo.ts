import path from 'path';
import fs from 'fs/promises';

// Define what a "City" looks like in our database
export interface CityData {
  city: string;
  rent: number;
  zip: string;
}

// 1. Load data for a specific state
export async function getStateData(state: string) {
  // Security: Prevent accessing files outside the geo folder
  const safeState = state.replace(/[^a-z0-9-]/g, '');
  
  const filePath = path.join(process.cwd(), 'public/data/geo', `${safeState}.json`);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as Record<string, CityData>;
  } catch (error) {
    return null; // Return null if state doesn't exist
  }
}

// 2. Find a specific city inside that state
export async function getCityData(state: string, citySlug: string) {
  const stateData = await getStateData(state);
  
  if (!stateData) return null;
  
  return stateData[citySlug] || null;
}