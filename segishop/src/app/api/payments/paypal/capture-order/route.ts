import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    // Validate required fields
    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

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
      console.error('PayPal token error:', tokenData);
      throw new Error('Failed to get PayPal access token');
    }

    // Capture the payment
    const captureResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', {
        status: captureResponse.status,
        statusText: captureResponse.statusText,
        error: captureData,
        orderID
      });
      throw new Error(captureData.message || captureData.details?.[0]?.description || 'Failed to capture PayPal payment');
    }

    // Log successful capture for debugging
    console.log('PayPal payment captured successfully:', {
      orderID,
      captureID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      status: captureData.status,
      amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
    });

    return NextResponse.json({
      success: true,
      orderID,
      captureData,
      transactionID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      status: captureData.status
    });
  } catch (error: any) {
    console.error('PayPal capture failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'PayPal payment capture failed' 
      },
      { status: 500 }
    );
  }
}
