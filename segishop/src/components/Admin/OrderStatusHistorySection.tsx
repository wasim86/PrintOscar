import React, { useState, useEffect } from 'react';
import { OrderStatusTimelineDto, StatusMilestoneDto, OrderStatusHistoryDto, adminOrdersApi } from '../../services/admin-orders-api';

interface OrderStatusHistorySectionProps {
  orderId: number;
}

const OrderStatusHistorySection: React.FC<OrderStatusHistorySectionProps> = ({ orderId }) => {
  const [timeline, setTimeline] = useState<OrderStatusTimelineDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'history'>('timeline');

  useEffect(() => {
    loadOrderTimeline();
  }, [orderId]);

  const loadOrderTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const timelineData = await adminOrdersApi.getOrderTimeline(orderId);
      setTimeline(timelineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order timeline');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMilestoneIcon = (milestone: StatusMilestoneDto) => {
    if (milestone.isCompleted) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (milestone.isCurrent) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status History</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status History</h3>
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          <p>{error}</p>
          <button 
            onClick={loadOrderTimeline}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status History</h3>
        <p className="text-gray-500">No status history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Status History</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'timeline'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Order: {timeline.orderNumber}</p>
        <p className="text-sm">
          Current Status: 
          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(timeline.currentStatus)}`}>
            {timeline.currentStatus}
          </span>
        </p>
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {timeline.milestones.map((milestone, index) => (
            <div key={milestone.status} className="flex items-start space-x-4">
              {getMilestoneIcon(milestone)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${milestone.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {milestone.label}
                  </h4>
                  {milestone.completedAt && (
                    <span className="text-xs text-gray-500">
                      {formatDate(milestone.completedAt)}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${milestone.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {milestone.description}
                </p>
                {milestone.completedBy && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated by: {milestone.completedBy}
                  </p>
                )}
                {milestone.notes && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    "{milestone.notes}"
                  </p>
                )}
              </div>
              {index < timeline.milestones.length - 1 && (
                <div className="absolute left-4 mt-8 w-0.5 h-6 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {timeline.statusHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No status changes recorded yet.</p>
          ) : (
            timeline.statusHistory
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((history) => (
                <div key={history.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.fromStatus)}`}>
                        {history.fromStatus}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.toStatus)}`}>
                        {history.toStatus}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(history.createdAt)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {history.changedBy && (
                      <p>Changed by: <span className="font-medium">{history.changedBy}</span></p>
                    )}
                    {history.changeReason && (
                      <p>Reason: <span className="font-medium">{history.changeReason}</span></p>
                    )}
                    {history.customerNotified && (
                      <p className="text-green-600">
                        ✓ Customer notified {history.notificationMethod && `via ${history.notificationMethod}`}
                      </p>
                    )}
                    {history.notes && (
                      <p className="italic bg-gray-50 p-2 rounded mt-2">
                        "{history.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatusHistorySection;
