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
  fetchMortalityRecords,
  createMortalityRecord,
  deleteMortalityRecord,
} from "@/lib/slices/mortalitySlice";
import { fetchLayers } from "@/lib/slices/layersSlice";
import { fetchFishUnits } from "@/lib/slices/fishUnitsSlice";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function MortalityPage() {
  const dispatch = useAppDispatch();
  const { mortalityRecords, loading, error } = useAppSelector(
    (state) => state.mortality,
  );
  const { layers } = useAppSelector((state) => state.layers);
  const { fishUnits } = useAppSelector((state) => state.fishUnits);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMortality, setSelectedMortality] = useState<any>(null);
  const [formData, setFormData] = useState({
    livestockType: "Layer" as "Layer" | "Catfish",
    referenceId: "",
    numberDead: "",
    cause: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(fetchMortalityRecords({}) as any);
    dispatch(fetchLayers() as any);
    dispatch(fetchFishUnits() as any);
  }, [dispatch]);

  const handleAddMortality = () => {
    const dataToSubmit = {
      ...formData,
      numberDead: parseInt(formData.numberDead),
      date: new Date(formData.date),
      // Convert string ID to ObjectId type for the API
      referenceId: formData.referenceId as any,
    };
    dispatch(createMortalityRecord(dataToSubmit) as any);
    setIsAddModalOpen(false);
    setFormData({
      livestockType: "Layer" as "Layer" | "Catfish",
      referenceId: "",
      numberDead: "",
      cause: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleEditMortality = () => {
    if (selectedMortality) {
      const dataToSubmit = {
        ...formData,
        numberDead: parseInt(formData.numberDead),
        date: new Date(formData.date),
      };
      // Note: Update functionality would need to be implemented in the API and slice
      // For now, we'll just close the modal
      setIsEditModalOpen(false);
      setSelectedMortality(null);
      setFormData({
        livestockType: "Layer" as "Layer" | "Catfish",
        referenceId: "",
        numberDead: "",
        cause: "",
        date: new Date().toISOString().split("T")[0],
      });
      setIsEditModalOpen(false);
      setSelectedMortality(null);
      setFormData({
        livestockType: "Layer" as "Layer" | "Catfish",
        referenceId: "",
        numberDead: "",
        cause: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const openEditModal = (mortality: any) => {
    setSelectedMortality(mortality);
    setFormData({
      livestockType: mortality.livestockType,
      referenceId: mortality.referenceId,
      numberDead: mortality.numberDead.toString(),
      cause: mortality.cause,
      date: new Date(mortality.date).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (mortality: any) => {
    setSelectedMortality(mortality);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getReferenceName = (livestockType: string, referenceId: string) => {
    if (livestockType === "Layer") {
      const layer = layers.find((l: any) => l._id === referenceId);
      return layer
        ? `${layer.batchName} - ${layer.cageNumber}`
        : "Unknown Batch";
    } else {
      const fishUnit = fishUnits.find((f: any) => f._id === referenceId);
      return fishUnit
        ? `${fishUnit.unitType} ${fishUnit.unitNumber}`
        : "Unknown Unit";
    }
  };

  const columns = [
    { key: "livestockType", title: "Livestock Type" },
    { key: "referenceId", title: "Reference" },
    { key: "numberDead", title: "Number Dead" },
    { key: "cause", title: "Cause" },
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

  const renderRow = (mortality: any) => ({
    ...mortality,
    referenceId: getReferenceName(
      mortality.livestockType,
      mortality.referenceId,
    ),
    date: new Date(mortality.date).toLocaleDateString(),
  });

  const totalDeaths = mortalityRecords.reduce(
    (sum: number, record: any) => sum + record.numberDead,
    0,
  );
  const layerDeaths = mortalityRecords
    .filter((record: any) => record.livestockType === "Layer")
    .reduce((sum: number, record: any) => sum + record.numberDead, 0);
  const fishDeaths = mortalityRecords
    .filter((record: any) => record.livestockType === "Catfish")
    .reduce((sum: number, record: any) => sum + record.numberDead, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Mortality Records
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track livestock mortality across the farm
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Record Mortality
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
                Total Deaths
              </h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-red-600">
                {totalDeaths}
              </div>
              <p className="text-sm text-gray-500">All livestock</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Layer Deaths
              </h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-orange-600">
                {layerDeaths}
              </div>
              <p className="text-sm text-gray-500">Bird mortality</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Fish Deaths</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-blue-600">
                {fishDeaths}
              </div>
              <p className="text-sm text-gray-500">Fish mortality</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Mortality Records
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
                data={mortalityRecords.map(renderRow)}
                className="min-w-full divide-y divide-gray-200"
              />
            )}
          </CardBody>
        </Card>

        {/* Add Mortality Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Mortality"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="livestockType"
                className="block text-sm font-medium text-gray-700"
              >
                Livestock Type
              </label>
              <select
                id="livestockType"
                name="livestockType"
                value={formData.livestockType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Layer">Layer</option>
                <option value="Catfish">Catfish</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="referenceId"
                className="block text-sm font-medium text-gray-700"
              >
                {formData.livestockType === "Layer"
                  ? "Layer Batch"
                  : "Fish Unit"}
              </label>
              <select
                id="referenceId"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">
                  Select a{" "}
                  {formData.livestockType === "Layer"
                    ? "layer batch"
                    : "fish unit"}
                </option>
                {formData.livestockType === "Layer"
                  ? layers.map((layer: any) => (
                      <option key={layer._id} value={layer._id}>
                        {layer.batchName} - {layer.cageNumber}
                      </option>
                    ))
                  : fishUnits.map((fishUnit: any) => (
                      <option key={fishUnit._id} value={fishUnit._id}>
                        {fishUnit.unitType} {fishUnit.unitNumber}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="numberDead"
                className="block text-sm font-medium text-gray-700"
              >
                Number Dead
              </label>
              <Input
                id="numberDead"
                name="numberDead"
                type="number"
                value={formData.numberDead}
                onChange={handleInputChange}
                placeholder="Enter number dead"
              />
            </div>
            <div>
              <label
                htmlFor="cause"
                className="block text-sm font-medium text-gray-700"
              >
                Cause
              </label>
              <Input
                id="cause"
                name="cause"
                value={formData.cause}
                onChange={handleInputChange}
                placeholder="Enter cause of death"
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
              <Button onClick={handleAddMortality}>Record Mortality</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Mortality Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Mortality Record"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editLivestockType"
                className="block text-sm font-medium text-gray-700"
              >
                Livestock Type
              </label>
              <select
                id="editLivestockType"
                name="livestockType"
                value={formData.livestockType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Layer">Layer</option>
                <option value="Catfish">Catfish</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editReferenceId"
                className="block text-sm font-medium text-gray-700"
              >
                {formData.livestockType === "Layer"
                  ? "Layer Batch"
                  : "Fish Unit"}
              </label>
              <select
                id="editReferenceId"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">
                  Select a{" "}
                  {formData.livestockType === "Layer"
                    ? "layer batch"
                    : "fish unit"}
                </option>
                {formData.livestockType === "Layer"
                  ? layers.map((layer: any) => (
                      <option key={layer._id} value={layer._id}>
                        {layer.batchName} - {layer.cageNumber}
                      </option>
                    ))
                  : fishUnits.map((fishUnit: any) => (
                      <option key={fishUnit._id} value={fishUnit._id}>
                        {fishUnit.unitType} {fishUnit.unitNumber}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="editNumberDead"
                className="block text-sm font-medium text-gray-700"
              >
                Number Dead
              </label>
              <Input
                id="editNumberDead"
                name="numberDead"
                type="number"
                value={formData.numberDead}
                onChange={handleInputChange}
                placeholder="Enter number dead"
              />
            </div>
            <div>
              <label
                htmlFor="editCause"
                className="block text-sm font-medium text-gray-700"
              >
                Cause
              </label>
              <Input
                id="editCause"
                name="cause"
                value={formData.cause}
                onChange={handleInputChange}
                placeholder="Enter cause of death"
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
              <Button onClick={handleEditMortality}>Update Record</Button>
            </div>
          </div>
        </Modal>

        {/* View Mortality Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Mortality Record Details"
        >
          {selectedMortality && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Livestock Type
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedMortality.livestockType}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reference</h3>
                <p className="text-sm text-gray-900">
                  {getReferenceName(
                    selectedMortality.livestockType,
                    selectedMortality.referenceId,
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Number Dead
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedMortality.numberDead}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cause</h3>
                <p className="text-sm text-gray-900">
                  {selectedMortality.cause}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedMortality.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedMortality.createdAt).toLocaleDateString()}
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
