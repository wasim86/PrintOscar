'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Package,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  AdminShippingApi,
  AdminShippingZone,
  AdminShippingMethod,
  AdminShippingClass,
  AdminShippingClassCost,
  AdminShippingOverview
} from '@/services/admin-shipping-api';
import { ShippingZoneForm } from './Shipping/ShippingZoneForm';
import { ShippingZoneDetails } from './Shipping/ShippingZoneDetails';
import { ShippingMethodForm } from './Shipping/ShippingMethodForm';
import { ShippingMethodDetails } from './Shipping/ShippingMethodDetails';
import { ShippingClassForm } from './Shipping/ShippingClassForm';
import { ShippingClassDetails } from './Shipping/ShippingClassDetails';
import { ClassCostForm } from './Shipping/ClassCostForm';
import { ClassCostDetails } from './Shipping/ClassCostDetails';

interface ShippingManagementState {
  overview: AdminShippingOverview | null;
  zones: AdminShippingZone[];
  methods: AdminShippingMethod[];
  classes: AdminShippingClass[];
  classCosts: AdminShippingClassCost[];
  loading: boolean;
  error: string | null;
}

interface ZoneModalState {
  showForm: boolean;
  showDetails: boolean;
  editingZone: AdminShippingZone | null;
  selectedZoneId: number | null;
}

export const ShippingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [state, setState] = useState<ShippingManagementState>({
    overview: null,
    zones: [],
    methods: [],
    classes: [],
    classCosts: [],
    loading: false,
    error: null
  });

  const [zoneModal, setZoneModal] = useState<ZoneModalState>({
    showForm: false,
    showDetails: false,
    editingZone: null,
    selectedZoneId: null
  });

  const [methodModal, setMethodModal] = useState({
    showForm: false,
    showDetails: false,
    editingMethod: null as AdminShippingMethod | null,
    selectedMethodId: null as number | null
  });

  const [classModal, setClassModal] = useState({
    showForm: false,
    showDetails: false,
    editingClass: null as AdminShippingClass | null,
    selectedClassId: null as number | null
  });

  const [costModal, setCostModal] = useState({
    showForm: false,
    showDetails: false,
    editingCost: null as AdminShippingClassCost | null,
    selectedCostId: null as number | null
  });

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Shipping statistics'
    },
    {
      id: 'zones',
      label: 'Shipping Zones',
      icon: MapPin,
      description: 'Geographic zones'
    },
    {
      id: 'methods',
      label: 'Shipping Methods',
      icon: Truck,
      description: 'Delivery methods'
    },
    {
      id: 'classes',
      label: 'Shipping Classes',
      icon: Package,
      description: 'Product categories'
    },
    {
      id: 'costs',
      label: 'Class Costs',
      icon: DollarSign,
      description: 'Pricing matrix'
    }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      switch (activeTab) {
        case 'overview':
          const overview = await AdminShippingApi.getOverview();
          setState(prev => ({ ...prev, overview }));
          break;
        case 'zones':
          const zonesResponse = await AdminShippingApi.getZones();
          setState(prev => ({ ...prev, zones: zonesResponse.zones }));
          break;
        case 'methods':
          const methodsResponse = await AdminShippingApi.getMethods();
          setState(prev => ({ ...prev, methods: methodsResponse.methods }));
          break;
        case 'classes':
          const classesResponse = await AdminShippingApi.getClasses();
          setState(prev => ({ ...prev, classes: classesResponse.classes }));
          break;
        case 'costs':
          const costsResponse = await AdminShippingApi.getClassCosts();
          setState(prev => ({ ...prev, classCosts: costsResponse.costs }));
          break;
      }
    } catch (error) {
      console.error('Error loading shipping data:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load data' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Zone management functions
  const handleCreateZone = () => {
    setZoneModal({
      showForm: true,
      showDetails: false,
      editingZone: null,
      selectedZoneId: null
    });
  };

  const handleEditZone = (zone: AdminShippingZone) => {
    setZoneModal({
      showForm: true,
      showDetails: false,
      editingZone: zone,
      selectedZoneId: zone.id
    });
  };

  const handleViewZone = (zoneId: number) => {
    setZoneModal({
      showForm: false,
      showDetails: true,
      editingZone: null,
      selectedZoneId: zoneId
    });
  };

  const handleDeleteZone = async (zoneId: number) => {
    try {
      const response = await AdminShippingApi.deleteZone(zoneId);
      if (response.success) {
        // Reload zones data
        if (activeTab === 'zones') {
          loadData();
        }
      } else {
        alert(response.message || 'Failed to delete shipping zone');
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      alert('An error occurred while deleting the zone');
    }
  };

  const handleCloseModals = () => {
    setZoneModal({
      showForm: false,
      showDetails: false,
      editingZone: null,
      selectedZoneId: null
    });
  };

  const handleZoneSaved = () => {
    // Reload zones data
    if (activeTab === 'zones') {
      loadData();
    }
  };

  // Method handlers
  const handleCreateMethod = () => {
    setMethodModal({
      showForm: true,
      showDetails: false,
      editingMethod: null,
      selectedMethodId: null
    });
  };

  const handleEditMethod = (method: AdminShippingMethod) => {
    setMethodModal({
      showForm: true,
      showDetails: false,
      editingMethod: method,
      selectedMethodId: method.id
    });
  };

  const handleViewMethod = (methodId: number) => {
    setMethodModal({
      showForm: false,
      showDetails: true,
      editingMethod: null,
      selectedMethodId: methodId
    });
  };

  const handleDeleteMethod = async (methodId: number) => {
    try {
      const response = await AdminShippingApi.deleteMethod(methodId);
      if (response.success) {
        // Reload methods data
        if (activeTab === 'methods') {
          loadData();
        }
      } else {
        alert(response.message || 'Failed to delete shipping method');
      }
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      alert('Failed to delete shipping method');
    }
  };

  const handleCloseMethodModals = () => {
    setMethodModal({
      showForm: false,
      showDetails: false,
      editingMethod: null,
      selectedMethodId: null
    });
  };

  const handleMethodSaved = () => {
    // Reload methods data
    if (activeTab === 'methods') {
      loadData();
    }
  };

  // Class handlers
  const handleCreateClass = () => {
    setClassModal({
      showForm: true,
      showDetails: false,
      editingClass: null,
      selectedClassId: null
    });
  };

  const handleEditClass = (shippingClass: AdminShippingClass) => {
    setClassModal({
      showForm: true,
      showDetails: false,
      editingClass: shippingClass,
      selectedClassId: shippingClass.id
    });
  };

  const handleViewClass = (classId: number) => {
    setClassModal({
      showForm: false,
      showDetails: true,
      editingClass: null,
      selectedClassId: classId
    });
  };

  const handleDeleteClass = async (classId: number) => {
    try {
      const response = await AdminShippingApi.deleteClass(classId);
      if (response.success) {
        // Reload classes data
        if (activeTab === 'classes') {
          loadData();
        }
      } else {
        alert(response.message || 'Failed to delete shipping class');
      }
    } catch (error) {
      console.error('Error deleting shipping class:', error);
      alert('Failed to delete shipping class');
    }
  };

  const handleCloseClassModals = () => {
    setClassModal({
      showForm: false,
      showDetails: false,
      editingClass: null,
      selectedClassId: null
    });
  };

  const handleClassSaved = () => {
    // Reload classes data
    if (activeTab === 'classes') {
      loadData();
    }
  };

  // Cost handlers
  const handleCreateCost = () => {
    setCostModal({
      showForm: true,
      showDetails: false,
      editingCost: null,
      selectedCostId: null
    });
  };

  const handleEditCost = (classCost: AdminShippingClassCost) => {
    setCostModal({
      showForm: true,
      showDetails: false,
      editingCost: classCost,
      selectedCostId: classCost.id
    });
  };

  const handleViewCost = (costId: number) => {
    setCostModal({
      showForm: false,
      showDetails: true,
      editingCost: null,
      selectedCostId: costId
    });
  };

  const handleDeleteCost = async (costId: number) => {
    try {
      const response = await AdminShippingApi.deleteClassCost(costId);
      if (response.success) {
        // Reload costs data
        if (activeTab === 'costs') {
          loadData();
        }
      } else {
        alert(response.message || 'Failed to delete class cost');
      }
    } catch (error) {
      console.error('Error deleting class cost:', error);
      alert('Failed to delete class cost');
    }
  };

  const handleCloseCostModals = () => {
    setCostModal({
      showForm: false,
      showDetails: false,
      editingCost: null,
      selectedCostId: null
    });
  };

  const handleCostSaved = () => {
    // Reload costs data
    if (activeTab === 'costs') {
      loadData();
    }
  };

  const renderOverview = () => {
    if (!state.overview) return null;

    const stats = [
      {
        title: 'Shipping Zones',
        value: state.overview.totalZones,
        active: state.overview.activeZones,
        icon: MapPin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Shipping Methods',
        value: state.overview.totalMethods,
        active: state.overview.activeMethods,
        icon: Truck,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        title: 'Shipping Classes',
        value: state.overview.totalClasses,
        active: state.overview.totalClassCosts,
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        title: 'Products Assigned',
        value: state.overview.productsWithShippingClass,
        active: state.overview.productsWithoutShippingClass,
        icon: Settings,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">
                      {stat.title === 'Products Assigned' 
                        ? `${stat.active} unassigned`
                        : `${stat.active} active`
                      }
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveTab('zones')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Manage Zones</p>
                <p className="text-sm text-gray-500">Configure shipping zones</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('methods')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Truck className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Shipping Methods</p>
                <p className="text-sm text-gray-500">Delivery options</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('classes')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Product Classes</p>
                <p className="text-sm text-gray-500">Categorize products</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('costs')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Manage Costs</p>
                <p className="text-sm text-gray-500">Set shipping rates</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shipping Calculation Service</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Zone Coverage</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-600">Complete</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product Assignment</span>
              <div className="flex items-center">
                {state.overview.productsWithoutShippingClass > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-600">
                      {state.overview.productsWithoutShippingClass} products need assignment
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">All products assigned</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMethods = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Shipping Methods</h3>
            <p className="text-sm text-gray-500">Manage delivery methods and their configurations</p>
          </div>
          <button
            onClick={handleCreateMethod}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </button>
        </div>

        {/* Methods Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Zones
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tax Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.methods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {method.methodType}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <MapPin className="h-3 w-3 mr-1" />
                        {method.zoneCount} zones
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        method.isTaxable
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.isTaxable ? 'Taxable' : 'Tax-free'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {method.isEnabled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewMethod(method.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditMethod(method)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Method"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${method.name}"?`)) {
                              handleDeleteMethod(method.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Method"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderClasses = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Shipping Classes</h3>
            <p className="text-sm text-gray-500">Manage product shipping classes and their cost configurations</p>
          </div>
          <button
            onClick={handleCreateClass}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </button>
        </div>

        {/* Classes Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cost Configs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.classes.map((shippingClass) => (
                  <tr key={shippingClass.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{shippingClass.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{shippingClass.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                        {shippingClass.slug}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Package className="h-3 w-3 mr-1" />
                        {shippingClass.productCount} products
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {shippingClass.classCosts.length} configs
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {new Date(shippingClass.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewClass(shippingClass.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditClass(shippingClass)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Class"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${shippingClass.name}"?`)) {
                              handleDeleteClass(shippingClass.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Class"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCosts = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Class Costs</h3>
            <p className="text-sm text-gray-500">Manage shipping costs for different classes in zones and methods</p>
          </div>
          <button
            onClick={handleCreateCost}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cost
          </button>
        </div>

        {/* Costs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.classCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{cost.shippingZoneName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{cost.shippingMethodName}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{cost.shippingClassName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">
                        {cost.costType === 'Percentage' ? `${cost.cost}%` : `$${cost.cost.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        cost.costType === 'Fixed'
                          ? 'bg-blue-100 text-blue-800'
                          : cost.costType === 'Percentage'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {cost.costType}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewCost(cost.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCost(cost)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Cost"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this cost configuration?')) {
                              handleDeleteCost(cost.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Cost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {state.classCosts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium mb-2">No class costs configured</p>
            <p className="text-sm text-gray-500 mb-4">
              Set up shipping costs for different product classes in various zones and methods
            </p>
            <button
              onClick={handleCreateCost}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Cost
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderZones = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Shipping Zones</h3>
            <p className="text-sm text-gray-500">Manage geographic shipping zones and their coverage areas</p>
          </div>
          <button
            onClick={handleCreateZone}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </button>
        </div>

        {/* Zones Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Regions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Methods
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{zone.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{zone.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <MapPin className="h-3 w-3 mr-1" />
                        {zone.regionCount} regions
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Truck className="h-3 w-3 mr-1" />
                        {zone.methodCount} methods
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {zone.isEnabled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewZone(zone.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Zone"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${zone.name}"?`)) {
                              handleDeleteZone(zone.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Zone"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            <span className="text-gray-600">Loading shipping data...</span>
          </div>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{state.error}</span>
          </div>
          <button 
            onClick={loadData}
            className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'zones':
        return renderZones();
      case 'methods':
        return renderMethods();
      case 'classes':
        return renderClasses();
      case 'costs':
        return renderCosts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shipping Management</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Configure shipping zones, methods, classes, and costs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto sm:overflow-visible">
            {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-400">{tab.description}</div>
                </div>
              </button>
            );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      {/* Modals */}
          <ShippingZoneForm
            zone={zoneModal.editingZone || undefined}
            isOpen={zoneModal.showForm}
            onClose={handleCloseModals}
            onSave={handleZoneSaved}
          />

          <ShippingZoneDetails
            zoneId={zoneModal.selectedZoneId}
            isOpen={zoneModal.showDetails}
            onClose={handleCloseModals}
            onEdit={handleEditZone}
            onDelete={handleDeleteZone}
          />

          <ShippingMethodForm
            method={methodModal.editingMethod || undefined}
            isOpen={methodModal.showForm}
            onClose={handleCloseMethodModals}
            onSave={handleMethodSaved}
          />

          <ShippingMethodDetails
            methodId={methodModal.selectedMethodId}
            isOpen={methodModal.showDetails}
            onClose={handleCloseMethodModals}
            onEdit={handleEditMethod}
            onDelete={handleDeleteMethod}
          />

          <ShippingClassForm
            shippingClass={classModal.editingClass || undefined}
            isOpen={classModal.showForm}
            onClose={handleCloseClassModals}
            onSave={handleClassSaved}
          />

          <ShippingClassDetails
            classId={classModal.selectedClassId}
            isOpen={classModal.showDetails}
            onClose={handleCloseClassModals}
            onEdit={handleEditClass}
            onDelete={handleDeleteClass}
          />

          <ClassCostForm
            classCost={costModal.editingCost || undefined}
            isOpen={costModal.showForm}
            onClose={handleCloseCostModals}
            onSave={handleCostSaved}
          />

          <ClassCostDetails
            costId={costModal.selectedCostId}
            isOpen={costModal.showDetails}
            onClose={handleCloseCostModals}
            onEdit={handleEditCost}
            onDelete={handleDeleteCost}
          />
      </div>
    </div>
  );
};
