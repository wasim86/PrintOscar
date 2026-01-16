'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
export default function WeddingInvitationsPage() {
  // Simple form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for form submission would go here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/uploads/productImages/2024/12/couple-1536x1010.jpg"
              alt="Wedding Invitations Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg">
              Crafted for You
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 drop-shadow-md font-light">
                "You've come to our site because you're celebrating. A wedding. A new baby. A graduation. A holiday."
              </p>
              <p className="text-lg text-white/90 drop-shadow-md mb-10">
                We're glad you're here, because we offer personalized invitations and social stationery for these important events and many more.
              </p>
              <a 
                href="https://printoscar.carlsoncraft.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-gray-900 px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105"
              >
                Explore Now
              </a>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <p className="text-gray-500 mb-2 text-xl font-medium tracking-wide">Our Story</p>
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Your Celebration, Our Expertise</h3>
                <p className="text-gray-600 leading-relaxed font-light mb-8 text-lg">
                  At Oscar Printing, Banners & Trophies, we believe that every celebration deserves to be uniquely expressed. That's why we're committed to providing you with
                </p>
                <a 
                  href="https://printoscar.carlsoncraft.com/" 
                  className="inline-block border-b-2 border-gray-900 text-gray-900 pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors uppercase text-sm tracking-widest font-bold"
                >
                  Read More
                </a>
              </div>
              <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
                <Image
                  src="/uploads/productImages/2024/12/38600593_8597128-1024x1024.jpg"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-gray-500 mb-2">What Sets Us Apart</p>
              <h3 className="text-3xl md:text-4xl font-serif text-gray-900">Why Choose Us</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Card 1: On-Trend Designs */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="relative h-64 w-full">
                   <Image
                    src="/uploads/productImages/2024/12/00_Blog_HolidayCardIdeas_SeasonsGreetingsGoldTypographyLettering.png"
                    alt="On-Trend Designs"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="p-8 text-center relative z-10 -mt-10 mx-4 bg-white rounded shadow-sm">
                  <h3 className="text-xl font-serif text-gray-900 mb-4">On-Trend Designs</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Our collection features the latest styles and trends in invitations and stationery.
                  </p>
                  <a href="https://printoscar.carlsoncraft.com/" className="text-yellow-600 uppercase text-xs font-bold tracking-widest hover:text-yellow-700">
                    Explore More
                  </a>
                </div>
              </div>

              {/* Card 2: Exceptional Quality */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="relative h-64 w-full">
                   <Image
                    src="/uploads/productImages/2024/12/03_Blog_ChristmasCardDesignTrends_Bows-1536x1024-1.png"
                    alt="Exceptional Quality"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="p-8 text-center relative z-10 -mt-10 mx-4 bg-white rounded shadow-sm">
                  <h3 className="text-xl font-serif text-gray-900 mb-4">Exceptional Quality</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    We use only the finest materials and employ state-of-the-art printing techniques to ensure your products are of the highest quality.
                  </p>
                  <a href="https://printoscar.carlsoncraft.com/" className="text-yellow-600 uppercase text-xs font-bold tracking-widest hover:text-yellow-700">
                    Explore More
                  </a>
                </div>
              </div>

              {/* Card 3: Personalized Service */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="relative h-64 w-full">
                   <Image
                    src="/uploads/productImages/2024/12/Greeting_1711799416.webp"
                    alt="Personalized Service"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="p-8 text-center relative z-10 -mt-10 mx-4 bg-white rounded shadow-sm">
                  <h3 className="text-xl font-serif text-gray-900 mb-4">Personalized Service</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    We understand that each occasion is special. Our team is dedicated to helping you find the perfect design and customize it to reflect your unique style.
                  </p>
                  <a href="https://printoscar.carlsoncraft.com/" className="text-yellow-600 uppercase text-xs font-bold tracking-widest hover:text-yellow-700">
                    Explore More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners / Bringing Your Vision to Life */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Text Column */}
              <div className="text-left">
                <p className="text-gray-500 mb-2">Partners</p>
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Bringing Your Vision to Life</h3>
                <p className="text-gray-600 leading-relaxed font-light mb-8 text-lg">
                  Browse through our Online Store and discover the perfect way to start your celebration. We're here to help you create lasting memories.
                </p>
                <a 
                  href="https://printoscar.carlsoncraft.com/" 
                  className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-yellow-700 transition-colors shadow-lg"
                >
                  Visit Store
                </a>
              </div>

              {/* Image 1 */}
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg group">
                <Image
                  src="/uploads/productImages/2024/12/38600593_8597128.jpg"
                  alt="Vision 1"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* Image 2 */}
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg group">
                <Image
                  src="/uploads/productImages/2024/12/11167647_20156-scaled.jpg"
                  alt="Vision 2"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
          {/* Background Image with Overlay */}
           <div className="absolute inset-0 z-0">
            <Image
              src="/uploads/productImages/2024/12/bg-2-1536x1536.jpg"
              alt="Contact Background"
              fill
              className="object-cover opacity-20"
            />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              
              {/* Contact Form (Left) */}
              <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-lg border border-white/20">
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name" 
                        className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email" 
                        required
                        className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <div>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={7}
                        placeholder="Message" 
                        className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-yellow-600 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-yellow-700 transition-colors w-full md:w-auto shadow-lg"
                    >
                      Send
                    </button>
                 </form>
              </div>

              {/* Contact Text (Right) */}
              <div className="text-left">
                <p className="text-gray-400 mb-2">Contact Us</p>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">Get in Touch</h3>
                <p className="text-gray-300 leading-relaxed font-light mb-8 text-lg">
                  We'd love to hear from you! Whether you have a question about an order, need design assistance, or simply want to learn more about our services, we're here to help.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
