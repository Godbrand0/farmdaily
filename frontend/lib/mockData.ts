// Mock data for Farm Management System
// This file contains sample data for all entities to be used when database is not available

// Simple interfaces for mock data (without MongoDB Document)
export interface MockLayerBatch {
  _id: string;
  batchName: string;
  cageNumber: string;
  birdsPlaced: number;
  currentBirdsAlive: number;
  datePlaced: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockFishUnit {
  _id: string;
  unitType: string;
  unitNumber: string;
  stockedQuantity: number;
  currentFishAlive: number;
  dateStocked: Date;
  feedStageMM: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockEggProduction {
  _id: string;
  layerBatchId: string;
  eggsCollected: number;
  damagedEggs: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockFishHarvest {
  _id: string;
  fishUnitId: string;
  harvestType: string;
  quantityHarvested: number;
  averageWeight: number;
  totalWeight: number;
  pricePerKg: number;
  totalIncome: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockExpense {
  _id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  relatedUnitId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockMortalityRecord {
  _id: string;
  livestockType: string;
  referenceId: string;
  numberDead: number;
  cause: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Layer Batches
export const mockLayers: MockLayerBatch[] = [
  {
    _id: "1",
    batchName: "Layer Batch 1",
    cageNumber: "C001",
    birdsPlaced: 1000,
    currentBirdsAlive: 980,
    datePlaced: new Date("2024-01-15"),
    breed: "Hy-Line Brown",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    batchName: "Layer Batch 2",
    cageNumber: "C002",
    birdsPlaced: 1200,
    currentBirdsAlive: 1150,
    datePlaced: new Date("2024-02-01"),
    breed: "Lohmann Brown",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    _id: "3",
    batchName: "Layer Batch 3",
    cageNumber: "C003",
    birdsPlaced: 800,
    currentBirdsAlive: 785,
    datePlaced: new Date("2024-02-10"),
    breed: "ISA Brown",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

// Fish Units
export const mockFishUnits: MockFishUnit[] = [
  {
    _id: "1",
    unitType: "Pond",
    unitNumber: "P001",
    stockedQuantity: 1000,
    currentFishAlive: 950,
    dateStocked: new Date("2024-01-15"),
    feedStageMM: 4.5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    unitType: "Cage",
    unitNumber: "C001",
    stockedQuantity: 500,
    currentFishAlive: 480,
    dateStocked: new Date("2024-02-01"),
    feedStageMM: 6.0,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    _id: "3",
    unitType: "Pond",
    unitNumber: "P002",
    stockedQuantity: 1500,
    currentFishAlive: 1420,
    dateStocked: new Date("2024-01-20"),
    feedStageMM: 5.2,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

// Egg Production Records
export const mockEggProduction: MockEggProduction[] = [
  {
    _id: "1",
    layerBatchId: "1",
    eggsCollected: 850,
    damagedEggs: 15,
    date: new Date("2024-02-10"),
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    _id: "2",
    layerBatchId: "2",
    eggsCollected: 920,
    damagedEggs: 10,
    date: new Date("2024-02-11"),
    createdAt: new Date("2024-02-11"),
    updatedAt: new Date("2024-02-11"),
  },
  {
    _id: "3",
    layerBatchId: "1",
    eggsCollected: 865,
    damagedEggs: 12,
    date: new Date("2024-02-11"),
    createdAt: new Date("2024-02-11"),
    updatedAt: new Date("2024-02-11"),
  },
  {
    _id: "4",
    layerBatchId: "3",
    eggsCollected: 680,
    damagedEggs: 8,
    date: new Date("2024-02-12"),
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
];

// Fish Harvest Records
export const mockHarvests: MockFishHarvest[] = [
  {
    _id: "1",
    fishUnitId: "1",
    harvestType: "Live",
    quantityHarvested: 200,
    averageWeight: 1.5,
    totalWeight: 300,
    pricePerKg: 8.5,
    totalIncome: 2550,
    date: new Date("2024-02-05"),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    _id: "2",
    fishUnitId: "2",
    harvestType: "Smoked",
    quantityHarvested: 150,
    averageWeight: 1.2,
    totalWeight: 180,
    pricePerKg: 12.0,
    totalIncome: 2160,
    date: new Date("2024-02-10"),
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    _id: "3",
    fishUnitId: "3",
    harvestType: "Live",
    quantityHarvested: 300,
    averageWeight: 1.8,
    totalWeight: 540,
    pricePerKg: 9.0,
    totalIncome: 4860,
    date: new Date("2024-02-12"),
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
];

// Expense Records
export const mockExpenses: MockExpense[] = [
  {
    _id: "1",
    category: "Feed",
    amount: 500,
    description: "Catfish feed for Pond 1",
    date: new Date("2024-02-01"),
    relatedUnitId: "1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    _id: "2",
    category: "Medication",
    amount: 150,
    description: "Vaccines for Layer Batch 1",
    date: new Date("2024-02-05"),
    relatedUnitId: null,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    _id: "3",
    category: "Labor",
    amount: 300,
    description: "Monthly wages for farm workers",
    date: new Date("2024-02-10"),
    relatedUnitId: null,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    _id: "4",
    category: "Maintenance",
    amount: 200,
    description: "Pond maintenance and repair",
    date: new Date("2024-02-12"),
    relatedUnitId: "2",
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
  {
    _id: "5",
    category: "Feed",
    amount: 750,
    description: "Layer feed for all batches",
    date: new Date("2024-02-08"),
    relatedUnitId: null,
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-08"),
  },
];

// Mortality Records
export const mockMortalityRecords: MockMortalityRecord[] = [
  {
    _id: "1",
    livestockType: "Layer",
    referenceId: "1",
    numberDead: 20,
    cause: "Disease",
    date: new Date("2024-02-05"),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    _id: "2",
    livestockType: "Catfish",
    referenceId: "1",
    numberDead: 50,
    cause: "Water Quality",
    date: new Date("2024-02-08"),
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-08"),
  },
  {
    _id: "3",
    livestockType: "Layer",
    referenceId: "2",
    numberDead: 15,
    cause: "Predator",
    date: new Date("2024-02-10"),
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    _id: "4",
    livestockType: "Catfish",
    referenceId: "3",
    numberDead: 80,
    cause: "Disease",
    date: new Date("2024-02-11"),
    createdAt: new Date("2024-02-11"),
    updatedAt: new Date("2024-02-11"),
  },
];

// Helper function to get mock data with API response format
export const getMockApiResponse = (data: any) => ({
  success: true,
  data,
});

// Helper functions to filter mock data
export const filterMockData = {
  // Filter layers by ID
  getLayerById: (id: string) => mockLayers.find((layer) => layer._id === id),

  // Filter fish units by ID
  getFishUnitById: (id: string) =>
    mockFishUnits.find((unit) => unit._id === id),

  // Filter egg production by layer batch ID
  getEggProductionByLayerId: (layerBatchId: string) =>
    mockEggProduction.filter((record) => record.layerBatchId === layerBatchId),

  // Filter harvests by fish unit ID
  getHarvestsByFishUnitId: (fishUnitId: string) =>
    mockHarvests.filter((record) => record.fishUnitId === fishUnitId),

  // Filter expenses by category
  getExpensesByCategory: (category: string) =>
    mockExpenses.filter((expense) => expense.category === category),

  // Filter expenses by related unit ID
  getExpensesByUnitId: (relatedUnitId: string) =>
    mockExpenses.filter((expense) => expense.relatedUnitId === relatedUnitId),

  // Filter mortality records by livestock type
  getMortalityByLivestockType: (livestockType: string) =>
    mockMortalityRecords.filter(
      (record) => record.livestockType === livestockType,
    ),

  // Filter mortality records by reference ID
  getMortalityByReferenceId: (referenceId: string) =>
    mockMortalityRecords.filter((record) => record.referenceId === referenceId),
};
