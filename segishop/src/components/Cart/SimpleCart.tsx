'use client';

import { useState } from 'react';

interface SimpleCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleCart: React.FC<SimpleCartProps> = ({ isOpen, onClose }) => {
  const [quantity1, setQuantity1] = useState(2);
  const [quantity2, setQuantity2] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  const price1 = 12.99;
  const price2 = 45.00;
  const subtotal = (price1 * quantity1) + (price2 * quantity2);
  const shipping = subtotal >= 75 ? 0 : 10;
  const tax = subtotal * 0.08;
  const discount = appliedCoupon ? subtotal * 0.10 : 0;
  const total = subtotal + shipping + tax - discount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRSTSEGI10') {
      setAppliedCoupon(true);
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
          padding: '20px',
          overflowY: 'auto',
          color: '#000000',
          fontFamily: 'Arial, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          borderBottom: '2px solid #000000', 
          paddingBottom: '15px', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ 
            color: '#000000', 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: 0
          }}>
            Your Cart (2)
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '30px',
              color: '#000000',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #1976d2'
        }}>
          <div style={{ color: '#000000', fontWeight: 'bold', marginBottom: '10px' }}>
            Free shipping progress: ${Math.max(75 - subtotal, 0).toFixed(2)} to go!
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#bbdefb',
            borderRadius: '4px'
          }}>
            <div style={{
              width: `${Math.min((subtotal / 75) * 100, 100)}%`,
              height: '8px',
              backgroundColor: '#1976d2',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        {/* Product 1 */}
        <div style={{
          border: '2px solid #000000',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5'
        }}>
          <h3 style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px', margin: '0 0 5px 0' }}>
            Organic Trail Mix
          </h3>
          <p style={{ color: '#000000', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            ${price1.toFixed(2)} each
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setQuantity1(Math.max(1, quantity1 - 1))}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px' }}>
                {quantity1}
              </span>
              <button 
                onClick={() => setQuantity1(quantity1 + 1)}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px' }}>
              ${(price1 * quantity1).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Product 2 */}
        <div style={{
          border: '2px solid #000000',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5'
        }}>
          <h3 style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px', margin: '0 0 5px 0' }}>
            Handmade Tote Bag
          </h3>
          <p style={{ color: '#000000', margin: '0 0 5px 0' }}>Blue Cotton</p>
          <p style={{ color: '#000000', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            ${price2.toFixed(2)} each
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setQuantity2(Math.max(1, quantity2 - 1))}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px' }}>
                {quantity2}
              </span>
              <button 
                onClick={() => setQuantity2(quantity2 + 1)}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px' }}>
              ${(price2 * quantity2).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Coupon Section */}
        <div style={{
          border: '2px solid #000000',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0'
        }}>
          <h3 style={{ color: '#000000', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            Coupon Code
          </h3>
          {!appliedCoupon ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter FIRSTSEGI10"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontSize: '16px',
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                onClick={applyCoupon}
                style={{
                  backgroundColor: '#4caf50',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Apply
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#c8e6c9',
              padding: '10px',
              borderRadius: '4px',
              border: '2px solid #4caf50'
            }}>
              <span style={{ color: '#000000', fontWeight: 'bold' }}>
                FIRSTSEGI10 applied! (-${discount.toFixed(2)})
              </span>
            </div>
          )}
        </div>

        {/* Totals */}
        <div style={{
          border: '3px solid #000000',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#e8e8e8'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>Subtotal:</span>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>Shipping:</span>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>Tax:</span>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>${tax.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>Discount:</span>
              <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ 
            borderTop: '2px solid #000000', 
            paddingTop: '10px',
            display: 'flex', 
            justifyContent: 'space-between' 
          }}>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '20px' }}>TOTAL:</span>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '20px' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            border: 'none',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Proceed to Checkout
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              backgroundColor: '#ffc107',
              color: '#000000',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              flex: 1
            }}>
              PayPal
            </button>
            <button style={{
              backgroundColor: '#212121',
              color: '#ffffff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              flex: 1
            }}>
              Amazon Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
