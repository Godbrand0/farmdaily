"use client";

import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { fetchLayers } from "@/lib/slices/layersSlice";
import { fetchFishUnits } from "@/lib/slices/fishUnitsSlice";
import { fetchEggProduction } from "@/lib/slices/eggProductionSlice";
import { fetchHarvests } from "@/lib/slices/harvestSlice";
import { fetchExpenses } from "@/lib/slices/expenseSlice";
import { fetchMortalityRecords } from "@/lib/slices/mortalitySlice";
import { useRouter } from "next/navigation";
import {
  BuildingOfficeIcon,
  BeakerIcon,
  TagIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ChartBarIcon,
  CurrencyDollarIcon as DollarIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { layers } = useAppSelector((state) => state.layers);
  const { fishUnits } = useAppSelector((state) => state.fishUnits);
  const { eggProduction } = useAppSelector((state) => state.eggProduction);
  const { harvests } = useAppSelector((state) => state.harvest);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { mortalityRecords } = useAppSelector((state) => state.mortality);

  useEffect(() => {
    dispatch(fetchLayers() as any);
    dispatch(fetchFishUnits() as any);
    dispatch(fetchEggProduction() as any);
    dispatch(fetchHarvests() as any);
    dispatch(fetchExpenses({}) as any);
    dispatch(fetchMortalityRecords({}) as any);
  }, [dispatch]);

  // Calculate dashboard metrics
  const totalLayers = layers.reduce(
    (sum, layer) => sum + layer.currentBirdsAlive,
    0,
  );
  const totalFish = fishUnits.reduce(
    (sum, unit) => sum + unit.currentFishAlive,
    0,
  );

  // Get today's egg production
  const today = new Date().toISOString().split("T")[0];
  const todayEggProduction = eggProduction.filter(
    (record) => new Date(record.date).toISOString().split("T")[0] === today,
  );
  const todayEggs = todayEggProduction.reduce(
    (sum, record) => sum + record.eggsCollected,
    0,
  );

  // Calculate monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHarvests = harvests.filter(
    (harvest) => new Date(harvest.harvestDate) >= thirtyDaysAgo,
  );
  const monthlyRevenue = recentHarvests.reduce(
    (sum, harvest) => sum + harvest.totalIncome,
    0,
  );

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const quickActions = [
    {
      title: "Add Layer Batch",
      description: "Register a new layer batch",
      icon: BuildingOfficeIcon,
      color: "text-amber-500",
      path: "/layers?action=add",
    },
    {
      title: "Add Fish Unit",
      description: "Add new pond or cage",
      icon: BeakerIcon,
      color: "text-cyan-500",
      path: "/catfish?action=add",
    },
    {
      title: "Record Harvest",
      description: "Log a new harvest",
      icon: DollarIcon,
      color: "text-green-500",
      path: "/harvest?action=add",
    },
    {
      title: "Record Mortality",
      description: "Log livestock deaths",
      icon: ClipboardDocumentListIcon,
      color: "text-red-500",
      path: "/mortality?action=add",
    },
    {
      title: "Add Expense",
      description: "Record farm expenses",
      icon: BanknotesIcon,
      color: "text-purple-500",
      path: "/expenses?action=add",
    },
    {
      title: "View Analytics",
      description: "Farm performance metrics",
      icon: ChartBarIcon,
      color: "text-blue-500",
      path: "/analytics",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Farm Management System
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card hover className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Layers
              </CardTitle>
              <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">
                {totalLayers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Birds currently alive
              </p>
            </CardBody>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-amber-100 opacity-20 dark:bg-amber-900"></div>
          </Card>

          <Card hover className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Catfish
              </CardTitle>
              <BeakerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">
                {totalFish.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Fish currently alive
              </p>
            </CardBody>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-cyan-100 opacity-20 dark:bg-cyan-900"></div>
          </Card>

          <Card hover className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Eggs
              </CardTitle>
              <TagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">
                {todayEggs.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Eggs collected</p>
            </CardBody>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-yellow-100 opacity-20 dark:bg-yellow-900"></div>
          </Card>

          <Card hover className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">
                ${monthlyRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From harvest sales
              </p>
            </CardBody>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-green-100 opacity-20 dark:bg-green-900"></div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your farm efficiently
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-start space-y-3 justify-start text-left hover:bg-muted/50 transition-all duration-200"
                  onClick={() => navigateTo(action.path)}
                >
                  <div className={`p-2 rounded-md bg-muted ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
