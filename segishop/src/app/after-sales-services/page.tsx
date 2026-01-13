'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import {
  Wrench,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Package,
  Star,
  Phone,
  MessageCircle,
  Info
} from 'lucide-react';

export default function AfterSalesServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">After Sales Services</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Wrench className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">After Sales Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium after-sales support for all your PrintOscar handmade products. We're here to help maintain and repair your items.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Repair Information */}
          <section>
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Important Repair Information</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                In the event of the impossibility to repair or replace any parts covered by the "Types of repairs covered by PrintOscar" list, particularly when the parts needed are unavailable.
              </p>
            </div>
          </section>

          {/* After Sales Repair Inquiry */}
          <section>
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">After Sales Repair Inquiry</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We kindly ask you to provide us the following information in your After Sales Repair Inquiry email to <Link href="mailto:sales@printoscar.com" className="text-orange-600 hover:text-orange-700 font-medium">sales@printoscar.com</Link>:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li>
                  <strong>Photos of the damaged item.</strong> This includes a photo of the whole item, a close-up of the damaged area from multiple angles. As an optional step, you can also upload a video of the item to give us an even better view of the item's defect(s).
                </li>
                <li>
                  <strong>The order number.</strong> You can find this in your order confirmation email, or in the "My Orders" section of our website Account.
                </li>
                <li>
                  <strong>The item name.</strong> You can find this in your order confirmation email, or in the "My Orders" section of our website.
                </li>
                <li>
                  <strong>The email address associated with the order number.</strong>
                </li>
              </ol>
            </div>
          </section>

          {/* After Sales Customization Inquiry */}
          <section>
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">After Sales Customization Inquiry</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We kindly ask you to provide us the following information in your After Sales Customization Inquiry email to <Link href="mailto:sales@printoscar.com" className="text-orange-600 hover:text-orange-700 font-medium">sales@printoscar.com</Link>:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li>
                  <strong>Photos of the PrintOscar original item and a full description of the customization or alteration.</strong> As an optional step, you can also send inspiration photos or videos, an item that already have the desired alteration outcome.
                </li>
                <li>
                  <strong>The order number.</strong> You can find this in your order confirmation email, or in the "My Orders" section of our website Account.
                </li>
                <li>
                  <strong>The item name.</strong> You can find this in your order confirmation email, or in the "My Orders" section of our website.
                </li>
                <li>
                  <strong>The email address associated with the order number.</strong>
                </li>
              </ol>
            </div>
          </section>

          {/* Customer Value Statement */}
          <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  All our customers are regarded as a valued customer, even after the sale has taken place.
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  PrintOscar handmade accessories are cared for with the same level of After Sales support as luxury brand products. We offer a variety of maintenance and repair options to ensure that your PrintOscar handmade maintains beauty and function for its wearer for many years to come.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </section>

          {/* PrintOscar Handmades After Sales */}
          <section className="bg-gray-900 text-white rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-400 mb-4">AFTER SALES SERVICES</h2>
              <h3 className="text-2xl font-semibold mb-6">PrintOscar Handmades After Sales</h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Similar to most luxury groups, PrintOscar is pleased to offer After Sale Service for PrintOscar Handmades. Let our team review your PrintOscar handmade items and communicate what is needed to give them:
              </p>
              
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>a refresh or repair</li>
                <li>an alteration/customization</li>
              </ul>

              <p className="text-gray-300 leading-relaxed">
                A bit of wear and tear? A split zip? A popped strap? Popped out one of the grommets in your bag? Is the leather getting worn or suede scuffed? Would you like to add a crossbody option? We can offer many repair and customization services for PrintOscar handmades ranging from: binding, piping, hardware replacement, sealing lifted leather, stitching, metal replating and more.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Also similar to luxury groups or wig makers or artisans, PrintOscar offers these part repair or replacement services at a fee. It is free to submit an item for virtual review, but payment is required if you choose to move forward with the initial repair or replacement assessment or quote. It is important to note that without physical inspection of your item, we cannot determine all labor hours or parts that might be needed in order to restore your item and address your inquiry. Our fees start at $55.
              </p>

              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-orange-400 mr-3" />
                  <h4 className="text-lg font-semibold text-orange-400">Repair Timeline</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  How long a repair, replacement, or customization takes depends on the severity of the damage, complexity of the request, and our queue of orders. It can also take a varied period of time depending on whether we have the relevant parts in stock. Repairs can take several months.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Repairs Covered */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Types of repairs covered by PrintOscar</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                An After Sale Service Inquiry can be made when you have received an item in a new condition, but a covered repair or replacement fault or defect developed after some time of use. It only applies to items that have been worn (i.e. with tags no longer attached), and it has been less than 24 months since you received the item.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4">Covered Repairs Include:</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Repair or replacement of damaged metal parts (e.g. chains, clasps, eyelets, screws, rivets, carabiners, ring or chain links, press studs, magnets and other hardware)</li>
                  <li>Repair or replacement of bag handles, straps, leather tongue flaps and tabs</li>
                  <li>Repair or replacement of seams or zippers</li>
                  <li>Repair or replacement of decorative detailing/ornaments</li>
                </ol>
              </div>
            </div>
          </section>

          {/* What's Not Covered */}
          <section>
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">PrintOscar After Sale Services can't guarantee repairs for the following</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                (this list is not comprehensive):
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <ul className="list-disc list-inside text-gray-700 space-y-3">
                  <li>
                    <strong>The repair or replacement of handmades that have been improperly stored or used</strong> (e.g. there is accidental damage or wear and tear; the item has been dropped or been subject to impact; the item has been used negligently or abnormally).
                  </li>
                  <li>
                    <strong>The repair or replacement of damages caused by external events,</strong> such as fire and floods.
                  </li>
                  <li>
                    <strong>The repair or replacement of items that have been subject to alterations by a 3rd party other than PrintOscar.</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Things to Consider About Handmades */}
          <section>
            <div className="flex items-center mb-6">
              <Info className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Things to consider about PrintOscar Handmades After Sales</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">
              {/* Content */}
              <div className="order-1 lg:order-2 space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    PrintOscar doesn't offer a warranty for any period nor for any item. For a fee, PrintOscar will
                    evaluate whether a repair or replacement or customization is possible for items proven to
                    have been received by an owner for less than 24 months. Our repair or replacement service
                    does not cover wear and tear, tarnishing, lost items or item parts, unwanted knots and
                    tangles, allergic reactions, accidents, misuse, neglect, improper care, or the natural
                    breakdown of materials over time.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    We believe that all high-quality and one of a kind products are worth repairing rather than
                    retiring. We routinely have customers come to us with handmades that has been going strong
                    for years without needing repair, but we also have an After Sales Service repair program and
                    our loyal customers can utilize this service option.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    For all repairs and alterations, the customer will be responsible for shipping and costs to send
                    in the item for repair. PrintOscar will be responsible for shipping costs to send the repaired item
                    to the customer if the address is a US address. If the address is outside the US we will require a
                    minimum $65 shipping fee.
                  </p>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Contact us
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help with After Sales Services?</h3>
              <p className="text-gray-700 mb-6">
                Our customer service team is here to help you with any questions about repairs, customizations, or after-sales support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:sales@printoscar.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Form
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
