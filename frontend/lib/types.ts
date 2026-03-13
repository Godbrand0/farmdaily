// Plain TypeScript interfaces for all farm management entities
// These replace Mongoose Document-based interfaces after the Supabase migration

export interface ILayerBatch {
  _id: string;
  batchName: string;
  numberOfBirds: number;
  cageNumber: string;
  dateStocked: string;
  currentBirdsAlive: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFishUnit {
  _id: string;
  unitType: "Pond" | "Cage";
  unitNumber: string;
  stockedQuantity: number;
  currentFishAlive: number;
  dateStocked: string;
  feedStageMM: number;
  createdAt: string;
  updatedAt: string;
}

export interface IEggProduction {
  _id: string;
  layerBatchId: string;
  eggsCollected: number;
  damagedEggs: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFishHarvest {
  _id: string;
  fishUnitId: string;
  harvestDate: string;
  quantityHarvested: number;
  totalWeightKg: number;
  averageWeightKg: number;
  pricePerKg: number;
  totalIncome: number;
  harvestType: "Live" | "Smoked";
  smokedQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExpense {
  _id: string;
  category: "Feed" | "Medication" | "Maintenance" | "Labor";
  amount: number;
  description: string;
  date: string;
  relatedUnitId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMortalityRecord {
  _id: string;
  livestockType: "Layer" | "Catfish";
  referenceId: string;
  numberDead: number;
  cause: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFishFeedStage {
  _id: string;
  fishUnitId: string;
  feedSizeMM: number;
  dateStarted: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
