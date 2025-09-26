export type ChemicalUsage = {
  date: string; // YYYY-MM-DD
  chlorine: number;
  ph: number;
  alkalinity: number;
  calciumHardness: number;
  cyanuricAcid: number;
  notes?: string; // Notes for this specific chemical usage entry
};

export type Customer = {
  id: string;
  name: string;
  address: string;
  poolDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  chemicalHistory: ChemicalUsage[];
};