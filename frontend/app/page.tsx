'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { useAppSelector } from '@/lib/store';

export default function HomePage() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to the Farm Management System
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Total Layers</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-blue-600">1,250</div>
              <p className="text-sm text-gray-500">Birds currently alive</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Total Catfish</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-green-600">3,500</div>
              <p className="text-sm text-gray-500">Fish currently alive</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Today's Eggs</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-yellow-600">850</div>
              <p className="text-sm text-gray-500">Eggs collected</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-purple-600">$12,450</div>
              <p className="text-sm text-gray-500">From harvest sales</p>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">Add Layer Batch</h4>
                <p className="text-sm text-gray-500">Register a new layer batch</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">Add Fish Unit</h4>
                <p className="text-sm text-gray-500">Add new pond or cage</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">Record Harvest</h4>
                <p className="text-sm text-gray-500">Log a new harvest</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">Record Mortality</h4>
                <p className="text-sm text-gray-500">Log livestock deaths</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">Add Expense</h4>
                <p className="text-sm text-gray-500">Record farm expenses</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-500">Farm performance metrics</p>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
