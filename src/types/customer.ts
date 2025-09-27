export type ChemicalUsage = {
  id: string; // Added unique ID for each chemical usage entry
  date: string; // YYYY-MM-DD
  chlorine?: string; // Changed to string for notes
  ph?: string; // Changed to string for notes
  alkalinity?: string; // Changed to string for notes
  calciumHardness?: string; // Changed to string for notes
  cyanuricAcid?: string; // Changed to string for notes
  notes?: string; // General notes for this specific chemical usage entry
};

export type Customer = {
  id: string;
  name: string;
  address: string;
  poolDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  chemicalHistory: ChemicalUsage[];
};