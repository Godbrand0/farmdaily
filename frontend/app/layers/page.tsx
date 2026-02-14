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
  fetchLayers,
  createLayer,
  updateLayer,
} from "@/lib/slices/layersSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function LayersPage() {
  const dispatch = useAppDispatch();
  const { layers, loading, error } = useAppSelector((state) => state.layers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<any>(null);
  const [formData, setFormData] = useState({
    batchName: "",
    numberOfBirds: "",
    cageNumber: "",
    dateStocked: "",
  });

  useEffect(() => {
    dispatch(fetchLayers() as any);
  }, [dispatch]);

  const handleAddLayer = () => {
    const dataToSubmit = {
      ...formData,
      numberOfBirds: parseInt(formData.numberOfBirds),
      dateStocked: new Date(formData.dateStocked),
    };
    dispatch(createLayer(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      batchName: "",
      numberOfBirds: "",
      cageNumber: "",
      dateStocked: "",
    });
  };

  const handleEditLayer = () => {
    if (selectedLayer) {
      const dataToSubmit = {
        ...formData,
        numberOfBirds: parseInt(formData.numberOfBirds),
        dateStocked: new Date(formData.dateStocked),
      };
      dispatch(
        updateLayer({ id: selectedLayer._id, layerData: dataToSubmit }) as any,
      );
      setIsEditModalOpen(false);
      setSelectedLayer(null);
      setFormData({
        batchName: "",
        numberOfBirds: "",
        cageNumber: "",
        dateStocked: "",
      });
    }
  };

  const openEditModal = (layer: any) => {
    setSelectedLayer(layer);
    setFormData({
      batchName: layer.batchName,
      numberOfBirds: layer.numberOfBirds.toString(),
      cageNumber: layer.cageNumber,
      dateStocked: new Date(layer.dateStocked).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (layer: any) => {
    setSelectedLayer(layer);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: "batchName", title: "Batch Name" },
    { key: "numberOfBirds", title: "Number of Birds" },
    { key: "cageNumber", title: "Cage Number" },
    { key: "dateStocked", title: "Date Stocked" },
    { key: "currentBirdsAlive", title: "Current Birds Alive" },
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

  const renderRow = (layer: any) => ({
    ...layer,
    dateStocked: new Date(layer.dateStocked).toLocaleDateString(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Layers Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage layer batches and track their performance
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Layer Batch
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Layer Batches</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={layers.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Layer Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Layer Batch"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="batchName"
                className="block text-sm font-medium text-gray-700"
              >
                Batch Name
              </label>
              <Input
                id="batchName"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                placeholder="Enter batch name"
              />
            </div>
            <div>
              <label
                htmlFor="numberOfBirds"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Birds
              </label>
              <Input
                id="numberOfBirds"
                name="numberOfBirds"
                type="number"
                value={formData.numberOfBirds}
                onChange={handleInputChange}
                placeholder="Enter number of birds"
              />
            </div>
            <div>
              <label
                htmlFor="cageNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Cage Number
              </label>
              <Input
                id="cageNumber"
                name="cageNumber"
                value={formData.cageNumber}
                onChange={handleInputChange}
                placeholder="Enter cage number"
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLayer}>Add Layer Batch</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Layer Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Layer Batch"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editBatchName"
                className="block text-sm font-medium text-gray-700"
              >
                Batch Name
              </label>
              <Input
                id="editBatchName"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                placeholder="Enter batch name"
              />
            </div>
            <div>
              <label
                htmlFor="editNumberOfBirds"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Birds
              </label>
              <Input
                id="editNumberOfBirds"
                name="numberOfBirds"
                type="number"
                value={formData.numberOfBirds}
                onChange={handleInputChange}
                placeholder="Enter number of birds"
              />
            </div>
            <div>
              <label
                htmlFor="editCageNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Cage Number
              </label>
              <Input
                id="editCageNumber"
                name="cageNumber"
                value={formData.cageNumber}
                onChange={handleInputChange}
                placeholder="Enter cage number"
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditLayer}>Update Layer Batch</Button>
            </div>
          </div>
        </Modal>

        {/* View Layer Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Layer Batch Details"
        >
          {selectedLayer && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Batch Name
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedLayer.batchName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Number of Birds
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedLayer.numberOfBirds}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Cage Number
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedLayer.cageNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date Stocked
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedLayer.dateStocked).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Current Birds Alive
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedLayer.currentBirdsAlive}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedLayer.createdAt).toLocaleDateString()}
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
