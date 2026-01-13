'use client';

import React, { useState } from 'react';
import { 
  Gift, 
  Copy, 
  Calendar, 
  Percent,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Tag
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  expiryDate: string;
  isUsed: boolean;
  isExpired: boolean;
  usageCount: number;
  maxUsage: number;
  category?: string;
}

export const CouponManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock coupons data
  const coupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME10',
      title: 'Welcome Discount',
      description: 'Get 10% off your first order',
      type: 'percentage',
      value: 10,
      minOrderAmount: 50,
      expiryDate: '2024-03-15',
      isUsed: false,
      isExpired: false,
      usageCount: 0,
      maxUsage: 1,
      category: 'Welcome'
    },
    {
      id: '2',
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free shipping on orders over $75',
      type: 'free_shipping',
      value: 0,
      minOrderAmount: 75,
      expiryDate: '2024-02-28',
      isUsed: false,
      isExpired: false,
      usageCount: 0,
      maxUsage: 3,
      category: 'Shipping'
    },
    {
      id: '3',
      code: 'SAVE25',
      title: '$25 Off',
      description: 'Save $25 on orders over $100',
      type: 'fixed',
      value: 25,
      minOrderAmount: 100,
      expiryDate: '2024-01-10',
      isUsed: true,
      isExpired: false,
      usageCount: 1,
      maxUsage: 1,
      category: 'Discount'
    },
    {
      id: '4',
      code: 'EXPIRED20',
      title: '20% Off Everything',
      description: 'Limited time offer - 20% off all items',
      type: 'percentage',
      value: 20,
      expiryDate: '2024-01-01',
      isUsed: false,
      isExpired: true,
      usageCount: 0,
      maxUsage: 1,
      category: 'Seasonal'
    }
  ];

  const [loyaltyPoints] = useState(850);
  const pointsToNextReward = 1000 - loyaltyPoints;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCouponIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-5 w-5 text-orange-600" />;
      case 'fixed':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'free_shipping':
        return <Gift className="h-5 w-5 text-blue-600" />;
      default:
        return <Tag className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% OFF`;
      case 'fixed':
        return `$${coupon.value} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return 'DISCOUNT';
    }
  };

  const getFilteredCoupons = () => {
    switch (activeTab) {
      case 'available':
        return coupons.filter(c => !c.isUsed && !c.isExpired);
      case 'used':
        return coupons.filter(c => c.isUsed);
      case 'expired':
        return coupons.filter(c => c.isExpired);
      default:
        return coupons;
    }
  };

  const filteredCoupons = getFilteredCoupons();

  const CouponCard = ({ coupon }: { coupon: Coupon }) => (
    <div className={`bg-white rounded-lg shadow-sm border-2 border-dashed overflow-hidden ${
      coupon.isUsed ? 'border-gray-300 opacity-75' : 
      coupon.isExpired ? 'border-red-300 opacity-75' : 
      'border-orange-300 hover:border-orange-400'
    } transition-colors`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              coupon.isUsed ? 'bg-gray-100' :
              coupon.isExpired ? 'bg-red-100' :
              'bg-orange-100'
            }`}>
              {getCouponIcon(coupon.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
              <p className="text-sm text-gray-500">{coupon.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${
              coupon.isUsed ? 'text-gray-500' :
              coupon.isExpired ? 'text-red-500' :
              'text-orange-600'
            }`}>
              {getCouponValue(coupon)}
            </div>
            {coupon.category && (
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-gray-600 bg-gray-100 mt-1">
                {coupon.category}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
          </div>
          
          {coupon.minOrderAmount && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Min. order: ${coupon.minOrderAmount}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-2" />
            <span>Used {coupon.usageCount} of {coupon.maxUsage} times</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono font-semibold text-gray-900">
              {coupon.code}
            </code>
            {coupon.isUsed && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {coupon.isExpired && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          
          {!coupon.isUsed && !coupon.isExpired && (
            <button
              onClick={() => handleCopyCode(coupon.code)}
              className="flex items-center px-3 py-1 text-sm text-orange-600 hover:text-orange-700 border border-orange-300 rounded hover:bg-orange-50 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1" />
              {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Coupons & Rewards</h2>
        <p className="text-gray-600 mt-1">Manage your discount codes and loyalty rewards</p>
      </div>

      {/* Loyalty Points Card */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Loyalty Points</h3>
            <p className="text-purple-100">Earn points with every purchase</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{loyaltyPoints}</div>
            <p className="text-purple-100 text-sm">Available Points</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress to next reward</span>
            <span>{pointsToNextReward} points to go</span>
          </div>
          <div className="w-full bg-purple-400 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(loyaltyPoints / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'available', label: 'Available', count: coupons.filter(c => !c.isUsed && !c.isExpired).length },
            { key: 'used', label: 'Used', count: coupons.filter(c => c.isUsed).length },
            { key: 'expired', label: 'Expired', count: coupons.filter(c => c.isExpired).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} coupons
          </h3>
          <p className="text-gray-500">
            {activeTab === 'available' && 'Check back later for new discount codes and offers.'}
            {activeTab === 'used' && 'Coupons you\'ve used will appear here.'}
            {activeTab === 'expired' && 'Expired coupons will be shown here.'}
          </p>
        </div>
      )}

      {/* Earn More Points Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earn More Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Make Purchases</h4>
            <p className="text-sm text-gray-500">Earn 1 point per $1 spent</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Write Reviews</h4>
            <p className="text-sm text-gray-500">Get 50 points per review</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Refer Friends</h4>
            <p className="text-sm text-gray-500">Earn 200 points per referral</p>
          </div>
        </div>
      </div>
    </div>
  );
};
