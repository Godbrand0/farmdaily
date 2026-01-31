import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IExpense } from "../../models/Expense";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({
    category,
    relatedUnitId,
  }: { category?: string; relatedUnitId?: string } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (relatedUnitId) params.append("relatedUnitId", relatedUnitId);

    const response = await fetch(`/api/expenses?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    const data = await response.json();
    return data;
  },
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData: Partial<IExpense>) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
      throw new Error("Failed to create expense");
    }
    const data = await response.json();
    return data;
  },
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({
    id,
    expenseData,
  }: {
    id: string;
    expenseData: Partial<IExpense>;
  }) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
      throw new Error("Failed to update expense");
    }
    const data = await response.json();
    return data;
  },
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }
    return id;
  },
);

interface ExpenseState {
  expenses: IExpense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expenses";
      })
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create expense";
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(
          (expense) => expense._id.toString() === action.payload._id.toString(),
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update expense";
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(
          (expense) => expense._id.toString() !== action.payload,
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete expense";
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
