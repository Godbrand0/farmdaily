import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ILayerBatch } from "../types";
import { mockLayers, getMockApiResponse } from "../mockData";

// Async thunks
export const fetchLayers = createAsyncThunk("layers/fetchLayers", async () => {
  try {
    const response = await fetch("/api/layers");
    if (!response.ok) {
      throw new Error("Failed to fetch layers");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Return mock data if API fails
    console.warn("Using mock data for layers");
    return getMockApiResponse(mockLayers);
  }
});

export const createLayer = createAsyncThunk(
  "layers/createLayer",
  async (layerData: Partial<ILayerBatch>) => {
    const response = await fetch("/api/layers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(layerData),
    });
    if (!response.ok) {
      throw new Error("Failed to create layer");
    }
    const data = await response.json();
    return data;
  },
);

export const updateLayer = createAsyncThunk(
  "layers/updateLayer",
  async ({
    id,
    layerData,
  }: {
    id: string;
    layerData: Partial<ILayerBatch>;
  }) => {
    const response = await fetch(`/api/layers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(layerData),
    });
    if (!response.ok) {
      throw new Error("Failed to update layer");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteLayer = createAsyncThunk(
  "layers/deleteLayer",
  async (id: string) => {
    const response = await fetch(`/api/layers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete layer");
    }
    return id;
  },
);

interface LayersState {
  layers: ILayerBatch[];
  loading: boolean;
  error: string | null;
  selectedLayer: ILayerBatch | null;
}

const initialState: LayersState = {
  layers: [],
  loading: false,
  error: null,
  selectedLayer: null,
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    setSelectedLayer: (state, action: PayloadAction<ILayerBatch | null>) => {
      state.selectedLayer = action.payload
        ? JSON.parse(JSON.stringify(action.payload))
        : null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch layers
      .addCase(fetchLayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLayers.fulfilled, (state, action) => {
        state.loading = false;
        state.layers = action.payload.data || action.payload;
      })
      .addCase(fetchLayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch layers";
      })
      // Create layer
      .addCase(createLayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLayer.fulfilled, (state, action) => {
        state.loading = false;
        state.layers.push(action.payload);
      })
      .addCase(createLayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create layer";
      })
      // Update layer
      .addCase(updateLayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLayer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.layers.findIndex(
          (layer) => layer._id.toString() === action.payload._id.toString(),
        );
        if (index !== -1) {
          state.layers[index] = action.payload;
        }
      })
      .addCase(updateLayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update layer";
      })
      // Delete layer
      .addCase(deleteLayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLayer.fulfilled, (state, action) => {
        state.loading = false;
        state.layers = state.layers.filter(
          (layer) => layer._id.toString() !== action.payload,
        );
      })
      .addCase(deleteLayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete layer";
      });
  },
});

export const { setSelectedLayer, clearError } = layersSlice.actions;
export default layersSlice.reducer;
