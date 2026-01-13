'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Cart } from '@/components/Cart/Cart';
import {
  Award,
  Users,
  Heart,
  Leaf,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function AboutPage() {
  const [activeGallery, setActiveGallery] = useState<'factory' | 'products'>('factory');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative h-screen bg-black overflow-hidden">
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

              {/* LEFT */}
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
                  🏆 Premium Trophies • Awards • Medals
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  About
                  <span className="block text-orange-500">Print Oscar</span>
                </h1>

                <p className="text-xl text-gray-200 mb-8">
                  We design and manufacture premium trophies, medals, cups and
                  custom awards that celebrate success in sports, academics,
                  corporates and special events.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveGallery('factory')}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      activeGallery === 'factory'
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-orange-600'
                    }`}
                  >
                    🏭 Our Factory
                  </button>

                  <button
                    onClick={() => setActiveGallery('products')}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      activeGallery === 'products'
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-orange-600'
                    }`}
                  >
                    🏆 Our Products
                  </button>
                </div>
              </div>

              {/* RIGHT VIDEO */}
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <video
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    ref={(el) => {
                      if (el) {
                        isVideoPlaying ? el.play() : el.pause();
                      }
                    }}
                  >
                    <source
                      src="https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_30fps.mp4"
                      type="video/mp4"
                    />
                  </video>

                  {!isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
                      >
                        <Play className="h-8 w-8 text-black ml-1" />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="bg-white p-2 rounded-full"
                    >
                      {isVideoPlaying ? <Pause /> : <Play />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-white p-2 rounded-full"
                    >
                      {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Print Oscar was founded with a vision to create world-class trophies
              and awards that honour achievements. From local schools to
              international events, our awards stand as symbols of excellence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              <div>
                <Award className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver premium quality trophies that inspire pride and motivation.
                </p>
              </div>

              <div>
                <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Our Values</h3>
                <p className="text-gray-600">
                  Precision, quality materials, elegant design and customer satisfaction.
                </p>
              </div>

              <div>
                <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Our Clients</h3>
                <p className="text-gray-600">
                  Schools, sports clubs, corporates, institutions and event organizers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              {activeGallery === 'factory' ? 'Manufacturing Unit' : 'Our Trophy Collection'}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5',
                'https://m.media-amazon.com/images/I/71MwGGVGrgL.jpg',
                'https://cdn2.awards.com/products/9301658z-plaque-awards-merano-plaque-gold-.jpg',
                'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
                'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
                'https://images.unsplash.com/photo-1562077772-3bd90403f7f0',
                'https://images.unsplash.com/photo-1599058917212-d750089bc07e',
                'https://images.unsplash.com/photo-1517649763962-0c623066013b',
                'https://images.unsplash.com/photo-1520975916090-3105956dac38',
                'https://images.unsplash.com/photo-1552674605-db6ffd4facb5'
              ].map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow">
                  <img
                    src={img}
                    alt="Print Oscar Trophy"
                    className="w-full h-56 object-cover hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">
            Celebrate Every Achievement With Print Oscar
          </h2>
          <p className="text-lg mb-8">
            Premium trophies & awards crafted to perfection.
          </p>
          <Link href="/products">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold">
              View Our Collection
            </button>
          </Link>
        </section>
      </main>

      <Footer />
      <Cart />
    </div>
  );
}
