# 📄 Farm Management System Implementation Guide

### Project: Multi-Livestock Farm ERP (Layers + Catfish)

### Stack: Next.js + MongoDB + Mongoose + REST API

---

# 1. 📌 Project Overview

## Goal

Build a digital farm management system that supports:

* Layer poultry management
* Catfish aquaculture management
* Infrastructure tracking (ponds & cages)
* Production and mortality tracking
* Feed stage monitoring
* Multi-month harvest tracking
* Financial analytics and reporting

---

# 2. 🧱 Tech Stack

## Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Recharts (Analytics)

## Backend

* Next.js API Routes (Server Functions)
* Node.js Runtime

## Database

* MongoDB
* Mongoose ODM

---

# 3. 🏗 System Architecture

```
Client UI
   ↓
Next.js Server/API
   ↓
Mongoose Models
   ↓
MongoDB Database
```

---

# 4. 📁 Folder Structure

```
/app
  /dashboard
  /layers
  /catfish
  /harvest
  /analytics

/app/api
  /layers
  /fish-units
  /egg-production
  /mortality
  /harvest
  /expenses

/lib
  mongodb.ts

/models
  LayerBatch.ts
  FishUnit.ts
  EggProduction.ts
  Mortality.ts
  FishHarvest.ts
  Expense.ts
  FishFeedStage.ts
```

---

# 5. 🗄 Database Models

---

## 5.1 Layer Batch Model

```
LayerBatch {
  batchName: String
  numberOfBirds: Number
  cageNumber: String
  dateStocked: Date
  currentBirdsAlive: Number
  createdAt: Date
}
```

---

## 5.2 Fish Unit Model

Represents ponds or cages.

```
FishUnit {
  unitType: "Pond" | "Cage"
  unitNumber: String
  stockedQuantity: Number
  currentFishAlive: Number
  dateStocked: Date
  feedStageMM: Number
  createdAt: Date
}
```

---

## 5.3 Fish Feed Stage Model

```
FishFeedStage {
  fishUnitId: ObjectId
  feedSizeMM: Number
  dateStarted: Date
  notes: String
}
```

---

## 5.4 Egg Production Model

```
EggProduction {
  layerBatchId: ObjectId
  eggsCollected: Number
  damagedEggs: Number
  date: Date
}
```

---

## 5.5 Mortality Model

```
MortalityRecord {
  livestockType: "Layer" | "Catfish"
  referenceId: ObjectId
  numberDead: Number
  cause: String
  date: Date
}
```

---

## 5.6 Fish Harvest Model

```
FishHarvest {
  fishUnitId: ObjectId
  harvestDate: Date
  quantityHarvested: Number
  totalWeightKg: Number
  averageWeightKg: Number
  pricePerKg: Number
  totalIncome: Number
  harvestType: "Live" | "Smoked"
  smokedQuantity: Number
}
```

---

## 5.7 Expense Model

```
Expense {
  category: "Feed" | "Medication" | "Maintenance" | "Labor"
  amount: Number
  description: String
  date: Date
  relatedUnitId: ObjectId
}
```

---

# 6. 🔗 API Endpoints

---

## 6.1 Layer Batch APIs

### Create Layer Batch

```
POST /api/layers
```

### Get All Layer Batches

```
GET /api/layers
```

### Update Layer Batch

```
PATCH /api/layers/:id
```

---

## 6.2 Fish Unit APIs

### Create Pond or Cage

```
POST /api/fish-units
```

### Get All Fish Units

```
GET /api/fish-units
```

---

## 6.3 Egg Production APIs

```
POST /api/egg-production
GET /api/egg-production
```

---

## 6.4 Mortality APIs

```
POST /api/mortality
GET /api/mortality
```

---

## 6.5 Fish Harvest APIs

```
POST /api/harvest
GET /api/harvest
```

---

## 6.6 Expense APIs

```
POST /api/expenses
GET /api/expenses
```

---

# 7. 🧠 Business Logic Rules

---

## 7.1 Mortality Handling

When mortality is recorded:

```
If livestockType = Layer
  Reduce currentBirdsAlive

If livestockType = Catfish
  Reduce currentFishAlive
```

---

## 7.2 Harvest Calculations

### Average Weight

```
averageWeightKg = totalWeightKg / quantityHarvested
```

### Income Calculation

```
totalIncome = totalWeightKg * pricePerKg
```

---

## 7.3 Feed Stage Update

Latest feed stage overrides previous stage.

---

# 8. 📊 Analytics Calculations

---

## Bird Egg Production Rate

```
eggsCollected / currentBirdsAlive
```

---

## Fish Survival Rate

```
currentFishAlive / stockedQuantity * 100
```

---

## Total Revenue

```
Sum(FishHarvest.totalIncome)
```

---

## Total Expenses

```
Sum(Expense.amount)
```

---

## Net Profit

```
Revenue - Expenses
```

---

# 9. 🖥 UI Requirements

---

## Dashboard

Must show:

* Birds Alive Count
* Fish Alive Count
* Daily Egg Production
* Harvest Revenue
* Mortality Trends
* Expense Summary

---

## Layers Module

Features:

* Add Batch
* Record Egg Production
* Record Mortality
* View Batch Stats

---

## Catfish Module

Features:

* Add Pond/Cage
* Feed Stage Input
* Mortality Input
* Survival Stats

---

## Harvest Module

Fields:

* Select Fish Unit
* Harvest Date
* Quantity Harvested
* Total Weight
* Price Per Kg
* Harvest Type
* Smoked Quantity

---

## Expenses Module

* Add Expense
* Filter by Category
* Monthly Expense Reports

---

# 10. ✔ Validation Rules

---

## General

* All numeric values must be positive
* Dates cannot be future dates

---

## Harvest Validation

* smokedQuantity required if harvestType = Smoked
* quantityHarvested cannot exceed fish alive

---

## Mortality Validation

* numberDead cannot exceed current stock

---

# 11. 🔐 Future Auth Integration (Optional)

* Admin Role
* Worker Role (Restricted input only)

---

# 12. 🚀 Implementation Order

---

## Phase 1 — Core Infrastructure

* MongoDB connection
* Mongoose models
* Basic API routes

---

## Phase 2 — Livestock Modules

* Layers CRUD
* Fish Unit CRUD
* Mortality logic

---

## Phase 3 — Production Tracking

* Egg production
* Feed stage tracking

---

## Phase 4 — Harvest Tracking

* Multi-entry harvest records
* Income calculations

---

## Phase 5 — Financial Tracking

* Expense management
* Profit analytics

---

## Phase 6 — Dashboard

* Charts
* Summary analytics

---

# 13. 📦 MongoDB Connection Setup

```
import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI);
}
```

---

# 14. 📊 Analytics Library Requirement

Create reusable functions:

```
calculateMortalityRate()
calculateSurvivalRate()
calculateEggProductionRate()
calculateProfit()
```

---

# 15. 🧪 Testing Requirements

* API validation testing
* Mortality adjustment testing
* Harvest calculation accuracy
* Feed stage update logic

---

# 16. 📌 Performance Requirements

* API responses under 500ms
* Pagination for list endpoints
* Indexed MongoDB fields:

  * fishUnitId
  * layerBatchId
  * date

---

# 17. 📈 Future Scalability

* Multi-farm support
* Mobile app
* IoT integration
* SMS alert system
* Predictive analytics

---

# ✅ Project Success Criteria

System must:

* Track layers and catfish independently
* Track pond and cage infrastructure
* Support multi-harvest cycles
* Provide automated analytics
* Maintain accurate stock counts

---

If you want, I can also generate:

✅ Mongoose schema files ready to paste
✅ Next.js API route boilerplates
✅ Postman testing collection
✅ ER diagram
✅ UI wireframes
✅ Agent task breakdown checklist

Just tell me which one you want next.