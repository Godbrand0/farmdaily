"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { Button } from "@/components/ui";
import { Modal } from "@/components/ui";
import { Input } from "@/components/ui";
import { Table } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
} from "@/lib/slices/expenseSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const { expenses, loading, error } = useAppSelector(
    (state) => state.expenses,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [formData, setFormData] = useState({
    category: "Feed" as "Feed" | "Medication" | "Maintenance" | "Labor",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    relatedUnitId: "",
  });

  useEffect(() => {
    dispatch(fetchExpenses({}) as any);
  }, [dispatch]);

  const handleAddExpense = () => {
    const dataToSubmit = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      // Convert string ID to ObjectId type for the API
      relatedUnitId: formData.relatedUnitId
        ? (formData.relatedUnitId as any)
        : undefined,
    };
    dispatch(createExpense(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      category: "Feed" as "Feed" | "Medication" | "Maintenance" | "Labor",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      relatedUnitId: "",
    });
  };

  const handleEditExpense = () => {
    if (selectedExpense) {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        // Only include relatedUnitId if it's provided
        ...(formData.relatedUnitId && {
          relatedUnitId: formData.relatedUnitId as any,
        }),
      };
      dispatch(
        updateExpense({
          id: selectedExpense._id,
          expenseData: dataToSubmit,
        }) as any,
      );
      setIsEditModalOpen(false);
      setSelectedExpense(null);
      setFormData({
        category: "Feed" as "Feed" | "Medication" | "Maintenance" | "Labor",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        relatedUnitId: "",
      });
    }
  };

  const openEditModal = (expense: any) => {
    setSelectedExpense(expense);
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      date: new Date(expense.date).toISOString().split("T")[0],
      relatedUnitId: expense.relatedUnitId || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (expense: any) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((expense: any) => expense.category === filterCategory)
    : expenses;

  const columns = [
    { key: "category", title: "Category" },
    { key: "amount", title: "Amount ($)" },
    { key: "description", title: "Description" },
    { key: "date", title: "Date" },
    {
      key: "actions",
      title: "Actions",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openViewModal(record)}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderRow = (expense: any) => ({
    ...expense,
    date: new Date(expense.date).toLocaleDateString(),
    amount: expense.amount.toFixed(2),
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum: number, expense: any) => sum + expense.amount,
    0,
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Expense Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track and manage farm expenses
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Total Expenses
              </h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">
                {filterCategory
                  ? `${filterCategory} expenses`
                  : "All categories"}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Filter by Category
              </h3>
            </CardHeader>
            <CardBody>
              <select
                value={filterCategory}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                <option value="Feed">Feed</option>
                <option value="Medication">Medication</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Labor">Labor</option>
              </select>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Expense Count
              </h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-blue-600">
                {filteredExpenses.length}
              </div>
              <p className="text-sm text-gray-500">Total records</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Expense Records
            </h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={filteredExpenses.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Expense Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Expense"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Feed">Feed</option>
                <option value="Medication">Medication</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Labor">Labor</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount ($)
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Expense Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Expense"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="editCategory"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Feed">Feed</option>
                <option value="Medication">Medication</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Labor">Labor</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount ($)
              </label>
              <Input
                id="editAmount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label
                htmlFor="editDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input
                id="editDescription"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label
                htmlFor="editDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <Input
                id="editDate"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditExpense}>Update Expense</Button>
            </div>
          </div>
        </Modal>

        {/* View Expense Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Expense Details"
        >
          {selectedExpense && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-sm text-gray-900">
                  {selectedExpense.category}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="text-sm text-gray-900">
                  ${selectedExpense.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedExpense.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedExpense.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedExpense.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
