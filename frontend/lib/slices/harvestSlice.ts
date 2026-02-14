import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IFishHarvest } from "../../models/FishHarvest";
import { mockHarvests, getMockApiResponse, filterMockData } from "../mockData";

export const fetchHarvests = createAsyncThunk(
  "harvest/fetchHarvests",
  async (fishUnitId?: string) => {
    try {
      const url = fishUnitId
        ? `/api/harvest?fishUnitId=${fishUnitId}`
        : "/api/harvest";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch harvest records");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // Return mock data if API fails
      console.warn("Using mock data for harvests");
      const data = fishUnitId
        ? filterMockData.getHarvestsByFishUnitId(fishUnitId)
        : mockHarvests;
      return getMockApiResponse(data);
    }
  },
);

export const createHarvest = createAsyncThunk(
  "harvest/createHarvest",
  async (harvestData: Partial<IFishHarvest>) => {
    const response = await fetch("/api/harvest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(harvestData),
    });
    if (!response.ok) {
      throw new Error("Failed to create harvest record");
    }
    const data = await response.json();
    return data;
  },
);

export const updateHarvest = createAsyncThunk(
  "harvest/updateHarvest",
  async ({
    id,
    harvestData,
  }: {
    id: string;
    harvestData: Partial<IFishHarvest>;
  }) => {
    const response = await fetch(`/api/harvest/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(harvestData),
    });
    if (!response.ok) {
      throw new Error("Failed to update harvest record");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteHarvest = createAsyncThunk(
  "harvest/deleteHarvest",
  async (id: string) => {
    const response = await fetch(`/api/harvest/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete harvest record");
    }
    return id;
  },
);

interface HarvestState {
  harvests: IFishHarvest[];
  loading: boolean;
  error: string | null;
}

const initialState: HarvestState = {
  harvests: [],
  loading: false,
  error: null,
};

const harvestSlice = createSlice({
  name: "harvest",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHarvests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHarvests.fulfilled, (state, action) => {
        state.loading = false;
        state.harvests = action.payload.data || action.payload;
      })
      .addCase(fetchHarvests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch harvest records";
      })
      .addCase(createHarvest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHarvest.fulfilled, (state, action) => {
        state.loading = false;
        state.harvests.push(action.payload);
      })
      .addCase(createHarvest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create harvest record";
      })
      .addCase(updateHarvest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHarvest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.harvests.findIndex(
          (harvest) => harvest._id.toString() === action.payload._id.toString(),
        );
        if (index !== -1) {
          state.harvests[index] = action.payload;
        }
      })
      .addCase(updateHarvest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update harvest record";
      })
      .addCase(deleteHarvest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHarvest.fulfilled, (state, action) => {
        state.loading = false;
        state.harvests = state.harvests.filter(
          (harvest) => harvest._id.toString() !== action.payload,
        );
      })
      .addCase(deleteHarvest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete harvest record";
      });
  },
});

export const { clearError } = harvestSlice.actions;
export default harvestSlice.reducer;
