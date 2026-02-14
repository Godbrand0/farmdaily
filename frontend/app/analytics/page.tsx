"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { fetchLayers } from "@/lib/slices/layersSlice";
import { fetchFishUnits } from "@/lib/slices/fishUnitsSlice";
import { fetchEggProduction } from "@/lib/slices/eggProductionSlice";
import { fetchHarvests } from "@/lib/slices/harvestSlice";
import { fetchExpenses } from "@/lib/slices/expenseSlice";
import { fetchMortalityRecords } from "@/lib/slices/mortalitySlice";

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { layers } = useAppSelector((state) => state.layers);
  const { fishUnits } = useAppSelector((state) => state.fishUnits);
  const { eggProduction } = useAppSelector((state) => state.eggProduction);
  const { harvests } = useAppSelector((state) => state.harvest);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { mortalityRecords } = useAppSelector((state) => state.mortality);

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(fetchLayers() as any);
    dispatch(fetchFishUnits() as any);
    dispatch(fetchEggProduction() as any);
    dispatch(fetchHarvests() as any);
    dispatch(fetchExpenses({}) as any);
    dispatch(fetchMortalityRecords({}) as any);
  }, [dispatch]);

  // Calculate analytics metrics
  const totalLayers = layers.reduce(
    (sum, layer) => sum + layer.currentBirdsAlive,
    0,
  );
  const totalFish = fishUnits.reduce(
    (sum, unit) => sum + unit.currentFishAlive,
    0,
  );

  const filteredEggProduction = eggProduction.filter(
    (record) =>
      new Date(record.date) >= new Date(dateRange.start) &&
      new Date(record.date) <= new Date(dateRange.end),
  );
  const totalEggs = filteredEggProduction.reduce(
    (sum, record) => sum + record.eggsCollected,
    0,
  );
  const avgEggProduction =
    totalLayers > 0 ? (totalEggs / totalLayers).toFixed(2) : 0;

  const filteredHarvests = harvests.filter(
    (harvest) =>
      new Date(harvest.harvestDate) >= new Date(dateRange.start) &&
      new Date(harvest.harvestDate) <= new Date(dateRange.end),
  );
  const totalRevenue = filteredHarvests.reduce(
    (sum, harvest) => sum + harvest.totalIncome,
    0,
  );
  const totalHarvestWeight = filteredHarvests.reduce(
    (sum, harvest) => sum + harvest.totalWeightKg,
    0,
  );

  const filteredExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date) >= new Date(dateRange.start) &&
      new Date(expense.date) <= new Date(dateRange.end),
  );
  const totalExpensesAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const netProfit = totalRevenue - totalExpensesAmount;

  const filteredMortality = mortalityRecords.filter(
    (record) =>
      new Date(record.date) >= new Date(dateRange.start) &&
      new Date(record.date) <= new Date(dateRange.end),
  );
  const totalDeaths = filteredMortality.reduce(
    (sum, record) => sum + record.numberDead,
    0,
  );
  const layerDeaths = filteredMortality
    .filter((record) => record.livestockType === "Layer")
    .reduce((sum, record) => sum + record.numberDead, 0);
  const fishDeaths = filteredMortality
    .filter((record) => record.livestockType === "Catfish")
    .reduce((sum, record) => sum + record.numberDead, 0);

  // Expense breakdown by category
  const expensesByCategory = filteredExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Mortality causes breakdown
  const mortalityByCause = filteredMortality.reduce(
    (acc, record) => {
      acc[record.cause] = (acc[record.cause] || 0) + record.numberDead;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Farm Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track performance metrics and financial analytics
          </p>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Date Range</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Current Livestock
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Layers:</span>
                  <span className="text-sm font-medium">{totalLayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fish:</span>
                  <span className="text-sm font-medium">{totalFish}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Egg Production
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Eggs:</span>
                  <span className="text-sm font-medium">{totalEggs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Avg/Bird:</span>
                  <span className="text-sm font-medium">
                    {avgEggProduction}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Financial Summary
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Revenue:</span>
                  <span className="text-sm font-medium text-green-600">
                    ${totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expenses:</span>
                  <span className="text-sm font-medium text-red-600">
                    ${totalExpensesAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Net Profit:</span>
                  <span
                    className={`text-sm font-medium ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${netProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Mortality</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Deaths:</span>
                  <span className="text-sm font-medium">{totalDeaths}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Layers:</span>
                  <span className="text-sm font-medium">{layerDeaths}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fish:</span>
                  <span className="text-sm font-medium">{fishDeaths}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Expense Breakdown
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Object.entries(expensesByCategory).map(
                  ([category, amount]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-700">{category}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(amount / totalExpensesAmount) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          ${amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardBody>
          </Card>

          {/* Mortality Causes */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Mortality Causes
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Object.entries(mortalityByCause).map(([cause, count]) => (
                  <div
                    key={cause}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700">{cause}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(count / totalDeaths) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Harvest Summary */}
        {filteredHarvests.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Harvest Summary
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredHarvests.length}
                  </div>
                  <p className="text-sm text-gray-500">Total Harvests</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalHarvestWeight.toFixed(0)} kg
                  </div>
                  <p className="text-sm text-gray-500">Total Weight</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    $
                    {filteredHarvests.length > 0
                      ? (totalRevenue / filteredHarvests.length).toFixed(2)
                      : 0}
                  </div>
                  <p className="text-sm text-gray-500">Avg Revenue/Harvest</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
}
