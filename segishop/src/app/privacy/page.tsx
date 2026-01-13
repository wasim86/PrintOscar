'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  Shield, 
  Users, 
  MessageCircle,
  Image,
  Cookie,
  Globe,
  Share2,
  Clock,
  UserCheck,
  Send
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us.
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Who We Are */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Who we are</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> Our website address is: <Link href="https://printoscar.com" className="text-orange-600 hover:text-orange-700">https://printoscar.com</Link>.
              </p>
            </div>
          </section>

          {/* Comments */}
          <section>
            <div className="flex items-center mb-4">
              <MessageCircle className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
              </p>
              <p className="text-gray-700 leading-relaxed">
                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <Link href="https://automattic.com/privacy/" className="text-orange-600 hover:text-orange-700">https://automattic.com/privacy/</Link>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
              </p>
            </div>
          </section>

          {/* Media */}
          <section>
            <div className="flex items-center mb-4">
              <Image className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Media</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Cookie className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
              </p>
            </div>
          </section>

          {/* Embedded content from other websites */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Embedded content from other websites</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
              </p>
            </div>
          </section>

          {/* Who we share your data with */}
          <section>
            <div className="flex items-center mb-4">
              <Share2 className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Who we share your data with</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> If you request a password reset, your IP address will be included in the reset email.
              </p>
            </div>
          </section>

          {/* How long we retain your data */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How long we retain your data</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
              </p>
            </div>
          </section>

          {/* What rights you have over your data */}
          <section>
            <div className="flex items-center mb-4">
              <UserCheck className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">What rights you have over your data</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
              </p>
            </div>
          </section>

          {/* Where your data is sent */}
          <section>
            <div className="flex items-center mb-4">
              <Send className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Where your data is sent</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong className="font-semibold">Suggested text:</strong> Visitor comments may be checked through an automated spam detection service.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
