import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', items = [] } = await request.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Calculate item total if items are provided
    const hasItems = items && items.length > 0;
    const itemTotal = hasItems
      ? items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      : amount;

    // PayPal order creation payload
    const purchaseUnit: any = {
      amount: {
        currency_code: currency,
        value: amount.toFixed(2)
      }
    };

    // Only add breakdown and items if items are provided and totals match
    if (hasItems && Math.abs(itemTotal - amount) < 0.01) {
      purchaseUnit.amount.breakdown = {
        item_total: {
          currency_code: currency,
          value: itemTotal.toFixed(2)
        }
      };
      purchaseUnit.items = items.map((item: any) => ({
        name: item.name || 'Product',
        unit_amount: {
          currency_code: currency,
          value: item.price.toFixed(2)
        },
        quantity: item.quantity.toString()
      }));
    }

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [purchaseUnit],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'Segi Shop'
      }
    };

    // Get PayPal access token
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create PayPal order
    const orderResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      }
    );

    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('PayPal order creation failed:', {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        error: order,
        orderData: JSON.stringify(orderData, null, 2)
      });
      throw new Error(order.message || order.details?.[0]?.description || 'Failed to create PayPal order');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order
    });
  } catch (error: any) {
    console.error('PayPal order creation failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'PayPal order creation failed' 
      },
      { status: 500 }
    );
  }
}
