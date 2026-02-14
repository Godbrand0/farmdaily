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
  fetchEggProduction,
  createEggProduction,
  updateEggProduction,
} from "@/lib/slices/eggProductionSlice";
import { fetchLayers } from "@/lib/slices/layersSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function EggProductionPage() {
  const dispatch = useAppDispatch();
  const { eggProduction, loading, error } = useAppSelector(
    (state) => state.eggProduction,
  );
  const { layers } = useAppSelector((state) => state.layers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEggProduction, setSelectedEggProduction] = useState<any>(null);
  const [formData, setFormData] = useState({
    layerBatchId: "",
    eggsCollected: "",
    damagedEggs: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(fetchEggProduction() as any);
    dispatch(fetchLayers() as any);
  }, [dispatch]);

  const handleAddEggProduction = () => {
    const dataToSubmit = {
      ...formData,
      eggsCollected: parseInt(formData.eggsCollected),
      damagedEggs: parseInt(formData.damagedEggs),
      date: new Date(formData.date),
      // Convert string ID to ObjectId type for the API
      layerBatchId: formData.layerBatchId as any,
    };
    dispatch(createEggProduction(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      layerBatchId: "",
      eggsCollected: "",
      damagedEggs: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleEditEggProduction = () => {
    if (selectedEggProduction) {
      const dataToSubmit = {
        ...formData,
        eggsCollected: parseInt(formData.eggsCollected),
        damagedEggs: parseInt(formData.damagedEggs),
        date: new Date(formData.date),
        // Convert string ID to ObjectId type for the API
        layerBatchId: formData.layerBatchId as any,
      };
      dispatch(
        updateEggProduction({
          id: selectedEggProduction._id,
          productionData: dataToSubmit,
        }) as any,
      );
      setIsEditModalOpen(false);
      setSelectedEggProduction(null);
      setFormData({
        layerBatchId: "",
        eggsCollected: "",
        damagedEggs: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const openEditModal = (eggProduction: any) => {
    setSelectedEggProduction(eggProduction);
    setFormData({
      layerBatchId: eggProduction.layerBatchId,
      eggsCollected: eggProduction.eggsCollected.toString(),
      damagedEggs: eggProduction.damagedEggs.toString(),
      date: new Date(eggProduction.date).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (eggProduction: any) => {
    setSelectedEggProduction(eggProduction);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getLayerBatchName = (layerBatchId: string) => {
    const layer = layers.find((l: any) => l._id === layerBatchId);
    return layer ? layer.batchName : "Unknown Batch";
  };

  const columns = [
    { key: "layerBatchId", title: "Layer Batch" },
    { key: "eggsCollected", title: "Eggs Collected" },
    { key: "damagedEggs", title: "Damaged Eggs" },
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

  const renderRow = (eggProduction: any) => ({
    ...eggProduction,
    layerBatchId: getLayerBatchName(eggProduction.layerBatchId),
    date: new Date(eggProduction.date).toLocaleDateString(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Egg Production
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track daily egg production from layer batches
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Record Egg Production
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
              Egg Production Records
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
                data={eggProduction.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Egg Production Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Egg Production"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="layerBatchId"
                className="block text-sm font-medium text-gray-700"
              >
                Layer Batch
              </label>
              <select
                id="layerBatchId"
                name="layerBatchId"
                value={formData.layerBatchId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a layer batch</option>
                {layers.map((layer: any) => (
                  <option key={layer._id} value={layer._id}>
                    {layer.batchName} - {layer.cageNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="eggsCollected"
                className="block text-sm font-medium text-gray-700"
              >
                Eggs Collected
              </label>
              <Input
                id="eggsCollected"
                name="eggsCollected"
                type="number"
                value={formData.eggsCollected}
                onChange={handleInputChange}
                placeholder="Enter number of eggs collected"
              />
            </div>
            <div>
              <label
                htmlFor="damagedEggs"
                className="block text-sm font-medium text-gray-700"
              >
                Damaged Eggs
              </label>
              <Input
                id="damagedEggs"
                name="damagedEggs"
                type="number"
                value={formData.damagedEggs}
                onChange={handleInputChange}
                placeholder="Enter number of damaged eggs"
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
              <Button onClick={handleAddEggProduction}>
                Record Production
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Egg Production Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Egg Production"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editLayerBatchId"
                className="block text-sm font-medium text-gray-700"
              >
                Layer Batch
              </label>
              <select
                id="editLayerBatchId"
                name="layerBatchId"
                value={formData.layerBatchId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a layer batch</option>
                {layers.map((layer: any) => (
                  <option key={layer._id} value={layer._id}>
                    {layer.batchName} - {layer.cageNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="editEggsCollected"
                className="block text-sm font-medium text-gray-700"
              >
                Eggs Collected
              </label>
              <Input
                id="editEggsCollected"
                name="eggsCollected"
                type="number"
                value={formData.eggsCollected}
                onChange={handleInputChange}
                placeholder="Enter number of eggs collected"
              />
            </div>
            <div>
              <label
                htmlFor="editDamagedEggs"
                className="block text-sm font-medium text-gray-700"
              >
                Damaged Eggs
              </label>
              <Input
                id="editDamagedEggs"
                name="damagedEggs"
                type="number"
                value={formData.damagedEggs}
                onChange={handleInputChange}
                placeholder="Enter number of damaged eggs"
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
              <Button onClick={handleEditEggProduction}>
                Update Production
              </Button>
            </div>
          </div>
        </Modal>

        {/* View Egg Production Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Egg Production Details"
        >
          {selectedEggProduction && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Layer Batch
                </h3>
                <p className="text-sm text-gray-900">
                  {getLayerBatchName(selectedEggProduction.layerBatchId)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Eggs Collected
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedEggProduction.eggsCollected}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Damaged Eggs
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedEggProduction.damagedEggs}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedEggProduction.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(
                    selectedEggProduction.createdAt,
                  ).toLocaleDateString()}
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
