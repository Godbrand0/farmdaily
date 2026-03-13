import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IMortalityRecord } from "../types";
import {
  mockMortalityRecords,
  getMockApiResponse,
  filterMockData,
} from "../mockData";

export const fetchMortalityRecords = createAsyncThunk(
  "mortality/fetchMortalityRecords",
  async ({
    livestockType,
    referenceId,
  }: { livestockType?: string; referenceId?: string } = {}) => {
    try {
      const params = new URLSearchParams();
      if (livestockType) params.append("livestockType", livestockType);
      if (referenceId) params.append("referenceId", referenceId);

      const response = await fetch(`/api/mortality?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch mortality records");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // Return mock data if API fails
      console.warn("Using mock data for mortality records");
      let data = mockMortalityRecords;

      if (livestockType) {
        data = filterMockData.getMortalityByLivestockType(livestockType);
      }

      if (referenceId) {
        data = filterMockData.getMortalityByReferenceId(referenceId);
      }

      return getMockApiResponse(data);
    }
  },
);

export const createMortalityRecord = createAsyncThunk(
  "mortality/createMortalityRecord",
  async (mortalityData: Partial<IMortalityRecord>) => {
    const response = await fetch("/api/mortality", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mortalityData),
    });
    if (!response.ok) {
      throw new Error("Failed to create mortality record");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteMortalityRecord = createAsyncThunk(
  "mortality/deleteMortalityRecord",
  async (id: string) => {
    const response = await fetch(`/api/mortality/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete mortality record");
    }
    return id;
  },
);

interface MortalityState {
  mortalityRecords: IMortalityRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: MortalityState = {
  mortalityRecords: [],
  loading: false,
  error: null,
};

const mortalitySlice = createSlice({
  name: "mortality",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMortalityRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMortalityRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.mortalityRecords = action.payload.data || action.payload;
      })
      .addCase(fetchMortalityRecords.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch mortality records";
      })
      .addCase(createMortalityRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMortalityRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.mortalityRecords.push(action.payload);
      })
      .addCase(createMortalityRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to create mortality record";
      })
      .addCase(deleteMortalityRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMortalityRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.mortalityRecords = state.mortalityRecords.filter(
          (record) => record._id.toString() !== action.payload,
        );
      })
      .addCase(deleteMortalityRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to delete mortality record";
      });
  },
});

export const { clearError } = mortalitySlice.actions;
export default mortalitySlice.reducer;
