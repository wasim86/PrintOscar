'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  FileText, 
  Shield, 
  AlertCircle,
  MessageSquare,
  Link as LinkIcon,
  Globe,
  CheckCircle
} from 'lucide-react';

export default function TermsOfSalePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Terms & Conditions</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These terms and conditions outline the rules and regulations for the use of Oscar Printing’s Website.
          </p>
          <p className="text-sm text-gray-500 mt-4">Welcome to Oscar Printing</p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-10">
          
          {/* Introduction */}
          <section>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                These terms and conditions outline the rules and regulations for the use of Oscar Printing’s Website, located at <a href="https://printoscar.com/" className="text-orange-500 hover:text-orange-600">https://printoscar.com/</a>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing this website we assume you accept these terms and conditions. Do not continue to use <span className="font-medium">https://printoscar.com/</span> if you do not agree to take all of the terms and conditions stated on this page.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person log on this website and compliant to the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We employ the use of cookies. By accessing <span className="font-medium">https://printoscar.com/</span>, you agreed to use cookies in agreement with the Oscar Printing’s Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
              </p>
            </div>
          </section>

          {/* License */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">License</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Unless otherwise stated, Oscar Printing and/or its licensors own the intellectual property rights for all material on <span className="font-medium">https://printoscar.com/</span>. All intellectual property rights are reserved. You may access this from <span className="font-medium">https://printoscar.com/</span> for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">You must not:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Republish material from https://printoscar.com/</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sell, rent or sub-license material from https://printoscar.com/</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Reproduce, duplicate or copy material from https://printoscar.com/</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Redistribute content from https://printoscar.com/</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Comments */}
          <section>
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">User Comments</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Oscar Printing does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Oscar Printing, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                To the extent permitted by applicable laws, Oscar Printing shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Oscar Printing reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
              </p>
              
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">You warrant and represent that:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                You hereby grant Oscar Printing a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.
              </p>
            </div>
          </section>

          {/* Hyperlinking */}
          <section>
            <div className="flex items-center mb-4">
              <LinkIcon className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Hyperlinking to our Content</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed font-semibold">
                The following organizations may link to our Website without prior written approval:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Government agencies;</li>
                <li>Search engines;</li>
                <li>News organizations;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.
              </p>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                  We may consider and approve other link requests from the following types of organizations:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Commonly-known consumer and/or business information sources;</li>
                  <li>Dot.com community sites;</li>
                  <li>Associations or other groups representing charities;</li>
                  <li>Online directory distributors;</li>
                  <li>Internet portals;</li>
                  <li>Accounting, law and consulting firms; and</li>
                  <li>Educational institutions and trade associations.</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Oscar Printing; and (d) the link is in the context of general resource information.
              </p>

              <p className="text-gray-700 leading-relaxed">
                These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                <p className="text-gray-700 leading-relaxed">
                  If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Oscar Printing. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
                </p>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed font-semibold">
                  Approved organizations may hyperlink to our Website as follows:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>By use of our corporate name; or</li>
                  <li>By use of the uniform resource locator being linked to; or</li>
                  <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2 text-sm italic">
                  No use of Oscar Printing’s logo or other artwork will be allowed for linking absent a trademark license agreement.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions About Our Terms?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about these terms and conditions, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
