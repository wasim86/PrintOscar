import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ShippingProvider } from "@/contexts/ShippingContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CookiesNotice } from "@/components/CookiesNotice";
import { NavigationLoader } from "@/components/Navigation";
import { TopFreeShippingBanner } from "@/components/FreeShippingBanner";
import SiteBannerClient from "@/components/SiteBannerClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrintOscar - Premium Organic Snacks & Handmade Goods | DC Metro",
  description: "Discover premium organic snacks and unique handmade goods in the DC Metro area. Quality products, local craftsmanship, and exceptional service since 2019.",
  icons: {
    icon: [
      { url: '/app-icon.ico', sizes: 'any' },
      { url: '/app-icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/app-apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/app-icon-192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/app-icon-512.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NavigationProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <WishlistProvider>
                  <ComparisonProvider>
                    <ShippingProvider>
                      <SiteBannerClient />
                      {children}
                      <CookiesNotice />
                      <NavigationLoader />
                    </ShippingProvider>
                  </ComparisonProvider>
                </WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
