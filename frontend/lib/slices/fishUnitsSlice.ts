import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IFishUnit } from "../../models/FishUnit";

export const fetchFishUnits = createAsyncThunk(
  "fishUnits/fetchFishUnits",
  async () => {
    const response = await fetch("/api/fish-units");
    if (!response.ok) {
      throw new Error("Failed to fetch fish units");
    }
    const data = await response.json();
    return data;
  },
);

export const createFishUnit = createAsyncThunk(
  "fishUnits/createFishUnit",
  async (fishUnitData: Partial<IFishUnit>) => {
    const response = await fetch("/api/fish-units", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fishUnitData),
    });
    if (!response.ok) {
      throw new Error("Failed to create fish unit");
    }
    const data = await response.json();
    return data;
  },
);

export const updateFishUnit = createAsyncThunk(
  "fishUnits/updateFishUnit",
  async ({
    id,
    fishUnitData,
  }: {
    id: string;
    fishUnitData: Partial<IFishUnit>;
  }) => {
    const response = await fetch(`/api/fish-units/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fishUnitData),
    });
    if (!response.ok) {
      throw new Error("Failed to update fish unit");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteFishUnit = createAsyncThunk(
  "fishUnits/deleteFishUnit",
  async (id: string) => {
    const response = await fetch(`/api/fish-units/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete fish unit");
    }
    return id;
  },
);

interface FishUnitsState {
  fishUnits: IFishUnit[];
  loading: boolean;
  error: string | null;
  selectedFishUnit: IFishUnit | null;
}

const initialState: FishUnitsState = {
  fishUnits: [],
  loading: false,
  error: null,
  selectedFishUnit: null,
};

const fishUnitsSlice = createSlice({
  name: "fishUnits",
  initialState,
  reducers: {
    setSelectedFishUnit: (state, action: PayloadAction<IFishUnit | null>) => {
      state.selectedFishUnit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFishUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFishUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.fishUnits = action.payload;
      })
      .addCase(fetchFishUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch fish units";
      })
      .addCase(createFishUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFishUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.fishUnits.push(action.payload);
      })
      .addCase(createFishUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create fish unit";
      })
      .addCase(updateFishUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFishUnit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fishUnits.findIndex(
          (unit) => unit._id === action.payload._id,
        );
        if (index !== -1) {
          state.fishUnits[index] = action.payload;
        }
      })
      .addCase(updateFishUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update fish unit";
      })
      .addCase(deleteFishUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFishUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.fishUnits = state.fishUnits.filter(
          (unit) => unit._id !== action.payload,
        );
      })
      .addCase(deleteFishUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete fish unit";
      });
  },
});

export const { setSelectedFishUnit, clearError } = fishUnitsSlice.actions;
export default fishUnitsSlice.reducer;
