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
  fetchHarvests,
  createHarvest,
  updateHarvest,
} from "@/lib/slices/harvestSlice";
import { fetchFishUnits } from "@/lib/slices/fishUnitsSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function HarvestPage() {
  const dispatch = useAppDispatch();
  const { harvests, loading, error } = useAppSelector((state) => state.harvest);
  const { fishUnits } = useAppSelector((state) => state.fishUnits);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<any>(null);
  const [formData, setFormData] = useState({
    fishUnitId: "",
    harvestDate: new Date().toISOString().split("T")[0],
    quantityHarvested: "",
    totalWeightKg: "",
    pricePerKg: "",
    harvestType: "Live" as "Live" | "Smoked",
    smokedQuantity: "",
  });

  useEffect(() => {
    dispatch(fetchHarvests() as any);
    dispatch(fetchFishUnits() as any);
  }, [dispatch]);

  const handleAddHarvest = () => {
    const quantityHarvested = parseInt(formData.quantityHarvested);
    const totalWeightKg = parseFloat(formData.totalWeightKg);
    const pricePerKg = parseFloat(formData.pricePerKg);

    const dataToSubmit = {
      ...formData,
      quantityHarvested,
      totalWeightKg,
      pricePerKg,
      smokedQuantity:
        formData.harvestType === "Smoked"
          ? parseInt(formData.smokedQuantity)
          : 0,
      harvestDate: new Date(formData.harvestDate),
      // Calculate average weight and total income
      averageWeightKg: totalWeightKg / quantityHarvested,
      totalIncome: totalWeightKg * pricePerKg,
      // Convert string ID to ObjectId type for the API
      fishUnitId: formData.fishUnitId as any,
    };

    dispatch(createHarvest(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      fishUnitId: "",
      harvestDate: new Date().toISOString().split("T")[0],
      quantityHarvested: "",
      totalWeightKg: "",
      pricePerKg: "",
      harvestType: "Live" as "Live" | "Smoked",
      smokedQuantity: "",
    });
  };

  const handleEditHarvest = () => {
    if (selectedHarvest) {
      const quantityHarvested = parseInt(formData.quantityHarvested);
      const totalWeightKg = parseFloat(formData.totalWeightKg);
      const pricePerKg = parseFloat(formData.pricePerKg);

      const dataToSubmit = {
        ...formData,
        quantityHarvested,
        totalWeightKg,
        pricePerKg,
        smokedQuantity:
          formData.harvestType === "Smoked"
            ? parseInt(formData.smokedQuantity)
            : 0,
        harvestDate: new Date(formData.harvestDate),
        // Calculate average weight and total income
        averageWeightKg: totalWeightKg / quantityHarvested,
        totalIncome: totalWeightKg * pricePerKg,
        // Convert string ID to ObjectId type for the API
        fishUnitId: formData.fishUnitId as any,
      };

      dispatch(
        updateHarvest({
          id: selectedHarvest._id,
          harvestData: dataToSubmit,
        }) as any,
      );
      setIsEditModalOpen(false);
      setSelectedHarvest(null);
      setFormData({
        fishUnitId: "",
        harvestDate: new Date().toISOString().split("T")[0],
        quantityHarvested: "",
        totalWeightKg: "",
        pricePerKg: "",
        harvestType: "Live" as "Live" | "Smoked",
        smokedQuantity: "",
      });
    }
  };

  const openEditModal = (harvest: any) => {
    setSelectedHarvest(harvest);
    setFormData({
      fishUnitId: harvest.fishUnitId,
      harvestDate: new Date(harvest.harvestDate).toISOString().split("T")[0],
      quantityHarvested: harvest.quantityHarvested.toString(),
      totalWeightKg: harvest.totalWeightKg.toString(),
      pricePerKg: harvest.pricePerKg.toString(),
      harvestType: harvest.harvestType,
      smokedQuantity: harvest.smokedQuantity?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (harvest: any) => {
    setSelectedHarvest(harvest);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFishUnitName = (fishUnitId: string) => {
    const fishUnit = fishUnits.find((f: any) => f._id === fishUnitId);
    return fishUnit
      ? `${fishUnit.unitType} ${fishUnit.unitNumber}`
      : "Unknown Unit";
  };

  const columns = [
    { key: "fishUnitId", title: "Fish Unit" },
    { key: "harvestDate", title: "Harvest Date" },
    { key: "quantityHarvested", title: "Quantity" },
    { key: "totalWeightKg", title: "Weight (kg)" },
    { key: "averageWeightKg", title: "Avg Weight (kg)" },
    { key: "totalIncome", title: "Income ($)" },
    { key: "harvestType", title: "Type" },
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

  const renderRow = (harvest: any) => ({
    ...harvest,
    fishUnitId: getFishUnitName(harvest.fishUnitId),
    harvestDate: new Date(harvest.harvestDate).toLocaleDateString(),
    totalWeightKg: harvest.totalWeightKg.toFixed(2),
    averageWeightKg: harvest.averageWeightKg.toFixed(2),
    totalIncome: harvest.totalIncome.toFixed(2),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Harvest Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track fish harvests and calculate revenue
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Record Harvest
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Harvest Records
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
                data={harvests.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Harvest Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record New Harvest"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fishUnitId"
                className="block text-sm font-medium text-gray-700"
              >
                Fish Unit
              </label>
              <select
                id="fishUnitId"
                name="fishUnitId"
                value={formData.fishUnitId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a fish unit</option>
                {fishUnits.map((fishUnit: any) => (
                  <option key={fishUnit._id} value={fishUnit._id}>
                    {fishUnit.unitType} {fishUnit.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="harvestDate"
                className="block text-sm font-medium text-gray-700"
              >
                Harvest Date
              </label>
              <Input
                id="harvestDate"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="quantityHarvested"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity Harvested
              </label>
              <Input
                id="quantityHarvested"
                name="quantityHarvested"
                type="number"
                value={formData.quantityHarvested}
                onChange={handleInputChange}
                placeholder="Enter quantity harvested"
              />
            </div>
            <div>
              <label
                htmlFor="totalWeightKg"
                className="block text-sm font-medium text-gray-700"
              >
                Total Weight (kg)
              </label>
              <Input
                id="totalWeightKg"
                name="totalWeightKg"
                type="number"
                step="0.01"
                value={formData.totalWeightKg}
                onChange={handleInputChange}
                placeholder="Enter total weight in kg"
              />
            </div>
            <div>
              <label
                htmlFor="pricePerKg"
                className="block text-sm font-medium text-gray-700"
              >
                Price Per kg ($)
              </label>
              <Input
                id="pricePerKg"
                name="pricePerKg"
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={handleInputChange}
                placeholder="Enter price per kg"
              />
            </div>
            <div>
              <label
                htmlFor="harvestType"
                className="block text-sm font-medium text-gray-700"
              >
                Harvest Type
              </label>
              <select
                id="harvestType"
                name="harvestType"
                value={formData.harvestType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Live">Live</option>
                <option value="Smoked">Smoked</option>
              </select>
            </div>
            {formData.harvestType === "Smoked" && (
              <div>
                <label
                  htmlFor="smokedQuantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Smoked Quantity
                </label>
                <Input
                  id="smokedQuantity"
                  name="smokedQuantity"
                  type="number"
                  value={formData.smokedQuantity}
                  onChange={handleInputChange}
                  placeholder="Enter smoked quantity"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddHarvest}>Record Harvest</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Harvest Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Harvest"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editFishUnitId"
                className="block text-sm font-medium text-gray-700"
              >
                Fish Unit
              </label>
              <select
                id="editFishUnitId"
                name="fishUnitId"
                value={formData.fishUnitId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a fish unit</option>
                {fishUnits.map((fishUnit: any) => (
                  <option key={fishUnit._id} value={fishUnit._id}>
                    {fishUnit.unitType} {fishUnit.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="editHarvestDate"
                className="block text-sm font-medium text-gray-700"
              >
                Harvest Date
              </label>
              <Input
                id="editHarvestDate"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="editQuantityHarvested"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity Harvested
              </label>
              <Input
                id="editQuantityHarvested"
                name="quantityHarvested"
                type="number"
                value={formData.quantityHarvested}
                onChange={handleInputChange}
                placeholder="Enter quantity harvested"
              />
            </div>
            <div>
              <label
                htmlFor="editTotalWeightKg"
                className="block text-sm font-medium text-gray-700"
              >
                Total Weight (kg)
              </label>
              <Input
                id="editTotalWeightKg"
                name="totalWeightKg"
                type="number"
                step="0.01"
                value={formData.totalWeightKg}
                onChange={handleInputChange}
                placeholder="Enter total weight in kg"
              />
            </div>
            <div>
              <label
                htmlFor="editPricePerKg"
                className="block text-sm font-medium text-gray-700"
              >
                Price Per kg ($)
              </label>
              <Input
                id="editPricePerKg"
                name="pricePerKg"
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={handleInputChange}
                placeholder="Enter price per kg"
              />
            </div>
            <div>
              <label
                htmlFor="editHarvestType"
                className="block text-sm font-medium text-gray-700"
              >
                Harvest Type
              </label>
              <select
                id="editHarvestType"
                name="harvestType"
                value={formData.harvestType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Live">Live</option>
                <option value="Smoked">Smoked</option>
              </select>
            </div>
            {formData.harvestType === "Smoked" && (
              <div>
                <label
                  htmlFor="editSmokedQuantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Smoked Quantity
                </label>
                <Input
                  id="editSmokedQuantity"
                  name="smokedQuantity"
                  type="number"
                  value={formData.smokedQuantity}
                  onChange={handleInputChange}
                  placeholder="Enter smoked quantity"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditHarvest}>Update Harvest</Button>
            </div>
          </div>
        </Modal>

        {/* View Harvest Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Harvest Details"
        >
          {selectedHarvest && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fish Unit</h3>
                <p className="text-sm text-gray-900">
                  {getFishUnitName(selectedHarvest.fishUnitId)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Harvest Date
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedHarvest.harvestDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Quantity Harvested
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.quantityHarvested}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Weight (kg)
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.totalWeightKg.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Average Weight (kg)
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.averageWeightKg.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Price Per kg ($)
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.pricePerKg.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Income ($)
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.totalIncome.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Harvest Type
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedHarvest.harvestType}
                </p>
              </div>
              {selectedHarvest.harvestType === "Smoked" && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Smoked Quantity
                  </h3>
                  <p className="text-sm text-gray-900">
                    {selectedHarvest.smokedQuantity}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedHarvest.createdAt).toLocaleDateString()}
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
