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
  fetchFishUnits,
  createFishUnit,
  updateFishUnit,
} from "@/lib/slices/fishUnitsSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function CatfishPage() {
  const dispatch = useAppDispatch();
  const { fishUnits, loading, error } = useAppSelector(
    (state) => state.fishUnits,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFishUnit, setSelectedFishUnit] = useState<any>(null);
  const [formData, setFormData] = useState({
    unitType: "Pond" as "Pond" | "Cage",
    unitNumber: "",
    stockedQuantity: "",
    dateStocked: "",
    feedStageMM: "",
  });

  useEffect(() => {
    dispatch(fetchFishUnits() as any);
  }, [dispatch]);

  const handleAddFishUnit = () => {
    const dataToSubmit = {
      ...formData,
      stockedQuantity: parseInt(formData.stockedQuantity),
      feedStageMM: parseFloat(formData.feedStageMM),
      dateStocked: new Date(formData.dateStocked),
    };
    dispatch(createFishUnit(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      unitType: "Pond" as "Pond" | "Cage",
      unitNumber: "",
      stockedQuantity: "",
      dateStocked: "",
      feedStageMM: "",
    });
  };

  const handleEditFishUnit = () => {
    if (selectedFishUnit) {
      const dataToSubmit = {
        ...formData,
        stockedQuantity: parseInt(formData.stockedQuantity),
        feedStageMM: parseFloat(formData.feedStageMM),
        dateStocked: new Date(formData.dateStocked),
      };
      dispatch(
        updateFishUnit({
          id: selectedFishUnit._id,
          fishUnitData: dataToSubmit,
        }) as any,
      );
      setIsEditModalOpen(false);
      setSelectedFishUnit(null);
      setFormData({
        unitType: "Pond" as "Pond" | "Cage",
        unitNumber: "",
        stockedQuantity: "",
        dateStocked: "",
        feedStageMM: "",
      });
    }
  };

  const openEditModal = (fishUnit: any) => {
    setSelectedFishUnit(fishUnit);
    setFormData({
      unitType: fishUnit.unitType,
      unitNumber: fishUnit.unitNumber,
      stockedQuantity: fishUnit.stockedQuantity.toString(),
      dateStocked: new Date(fishUnit.dateStocked).toISOString().split("T")[0],
      feedStageMM: fishUnit.feedStageMM.toString(),
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (fishUnit: any) => {
    setSelectedFishUnit(fishUnit);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: "unitType", title: "Unit Type" },
    { key: "unitNumber", title: "Unit Number" },
    { key: "stockedQuantity", title: "Stocked Quantity" },
    { key: "currentFishAlive", title: "Current Fish Alive" },
    { key: "dateStocked", title: "Date Stocked" },
    { key: "feedStageMM", title: "Feed Stage (MM)" },
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

  const renderRow = (fishUnit: any) => ({
    ...fishUnit,
    dateStocked: new Date(fishUnit.dateStocked).toLocaleDateString(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Catfish Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage fish ponds and cages for catfish farming
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Fish Unit
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Fish Units</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={fishUnits.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Fish Unit Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Fish Unit"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="unitType"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Type
              </label>
              <select
                id="unitType"
                name="unitType"
                value={formData.unitType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Pond">Pond</option>
                <option value="Cage">Cage</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="unitNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Number
              </label>
              <Input
                id="unitNumber"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                placeholder="Enter unit number"
              />
            </div>
            <div>
              <label
                htmlFor="stockedQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Stocked Quantity
              </label>
              <Input
                id="stockedQuantity"
                name="stockedQuantity"
                type="number"
                value={formData.stockedQuantity}
                onChange={handleInputChange}
                placeholder="Enter stocked quantity"
              />
            </div>
            <div>
              <label
                htmlFor="dateStocked"
                className="block text-sm font-medium text-gray-700"
              >
                Date Stocked
              </label>
              <Input
                id="dateStocked"
                name="dateStocked"
                type="date"
                value={formData.dateStocked}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="feedStageMM"
                className="block text-sm font-medium text-gray-700"
              >
                Feed Stage (MM)
              </label>
              <Input
                id="feedStageMM"
                name="feedStageMM"
                type="number"
                step="0.1"
                value={formData.feedStageMM}
                onChange={handleInputChange}
                placeholder="Enter feed stage in millimeters"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddFishUnit}>Add Fish Unit</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Fish Unit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Fish Unit"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editUnitType"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Type
              </label>
              <select
                id="editUnitType"
                name="unitType"
                value={formData.unitType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Pond">Pond</option>
                <option value="Cage">Cage</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editUnitNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Number
              </label>
              <Input
                id="editUnitNumber"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                placeholder="Enter unit number"
              />
            </div>
            <div>
              <label
                htmlFor="editStockedQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Stocked Quantity
              </label>
              <Input
                id="editStockedQuantity"
                name="stockedQuantity"
                type="number"
                value={formData.stockedQuantity}
                onChange={handleInputChange}
                placeholder="Enter stocked quantity"
              />
            </div>
            <div>
              <label
                htmlFor="editDateStocked"
                className="block text-sm font-medium text-gray-700"
              >
                Date Stocked
              </label>
              <Input
                id="editDateStocked"
                name="dateStocked"
                type="date"
                value={formData.dateStocked}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="editFeedStageMM"
                className="block text-sm font-medium text-gray-700"
              >
                Feed Stage (MM)
              </label>
              <Input
                id="editFeedStageMM"
                name="feedStageMM"
                type="number"
                step="0.1"
                value={formData.feedStageMM}
                onChange={handleInputChange}
                placeholder="Enter feed stage in millimeters"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditFishUnit}>Update Fish Unit</Button>
            </div>
          </div>
        </Modal>

        {/* View Fish Unit Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Fish Unit Details"
        >
          {selectedFishUnit && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Unit Type</h3>
                <p className="text-sm text-gray-900">
                  {selectedFishUnit.unitType}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Unit Number
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedFishUnit.unitNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Stocked Quantity
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedFishUnit.stockedQuantity}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Current Fish Alive
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedFishUnit.currentFishAlive}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date Stocked
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedFishUnit.dateStocked).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Feed Stage (MM)
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedFishUnit.feedStageMM}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedFishUnit.createdAt).toLocaleDateString()}
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
