import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IEggProduction } from "../types";
import {
  mockEggProduction,
  getMockApiResponse,
  filterMockData,
} from "../mockData";

export const fetchEggProduction = createAsyncThunk(
  "eggProduction/fetchEggProduction",
  async (layerBatchId?: string) => {
    try {
      const url = layerBatchId
        ? `/api/egg-production?layerBatchId=${layerBatchId}`
        : "/api/egg-production";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch egg production");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // Return mock data if API fails
      console.warn("Using mock data for egg production");
      const data = layerBatchId
        ? filterMockData.getEggProductionByLayerId(layerBatchId)
        : mockEggProduction;
      return getMockApiResponse(data);
    }
  },
);

export const createEggProduction = createAsyncThunk(
  "eggProduction/createEggProduction",
  async (productionData: Partial<IEggProduction>) => {
    const response = await fetch("/api/egg-production", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productionData),
    });
    if (!response.ok) {
      throw new Error("Failed to create egg production record");
    }
    const data = await response.json();
    return data;
  },
);

export const updateEggProduction = createAsyncThunk(
  "eggProduction/updateEggProduction",
  async ({
    id,
    productionData,
  }: {
    id: string;
    productionData: Partial<IEggProduction>;
  }) => {
    const response = await fetch(`/api/egg-production/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productionData),
    });
    if (!response.ok) {
      throw new Error("Failed to update egg production record");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteEggProduction = createAsyncThunk(
  "eggProduction/deleteEggProduction",
  async (id: string) => {
    const response = await fetch(`/api/egg-production/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete egg production record");
    }
    return id;
  },
);

interface EggProductionState {
  eggProduction: IEggProduction[];
  loading: boolean;
  error: string | null;
}

const initialState: EggProductionState = {
  eggProduction: [],
  loading: false,
  error: null,
};

const eggProductionSlice = createSlice({
  name: "eggProduction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEggProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEggProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.eggProduction = action.payload.data || action.payload;
      })
      .addCase(fetchEggProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch egg production";
      })
      .addCase(createEggProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEggProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.eggProduction.push(action.payload);
      })
      .addCase(createEggProduction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to create egg production record";
      })
      .addCase(updateEggProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEggProduction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.eggProduction.findIndex(
          (record) => record._id.toString() === action.payload._id.toString(),
        );
        if (index !== -1) {
          state.eggProduction[index] = action.payload;
        }
      })
      .addCase(updateEggProduction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update egg production record";
      })
      .addCase(deleteEggProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEggProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.eggProduction = state.eggProduction.filter(
          (record) => record._id.toString() !== action.payload,
        );
      })
      .addCase(deleteEggProduction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to delete egg production record";
      });
  },
});

export const { clearError } = eggProductionSlice.actions;
export default eggProductionSlice.reducer;
