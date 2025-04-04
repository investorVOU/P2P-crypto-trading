import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white mb-8">About Our Platform</h1>
        
        <div className="prose prose-primary dark:prose-invert max-w-none">
          <p className="text-lg">
            P2P Trading is a secure peer-to-peer trading platform that enables users to buy and 
            sell cryptocurrencies directly with one another. Our escrow service ensures that all 
            trades are completed safely, protecting both buyers and sellers.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create a safe, accessible, and user-friendly environment for 
            cryptocurrency trading. We believe in empowering individuals worldwide to participate 
            in the digital economy by providing a reliable platform for peer-to-peer transactions.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
          <p>
            Our platform brings together buyers and sellers from around the world. Here's how it works:
          </p>
          
          <ol className="space-y-4 my-4">
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold mr-3">1</span>
              <div>
                <strong>Create an account</strong> - Sign up with your email address and verify your identity to start trading.
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold mr-3">2</span>
              <div>
                <strong>Browse offers</strong> - Find offers from other users that match your trading preferences, or create your own offer.
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold mr-3">3</span>
              <div>
                <strong>Secure escrow</strong> - When you start a trade, the cryptocurrency is held in escrow until both parties confirm the transaction.
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold mr-3">4</span>
              <div>
                <strong>Complete trade</strong> - After payment confirmation, the cryptocurrency is released from escrow to the buyer.
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold mr-3">5</span>
              <div>
                <strong>Rate your experience</strong> - After each trade, you can rate your trading partner to help build trust in the community.
              </div>
            </li>
          </ol>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Security Measures</h2>
          <p>
            Security is our top priority. We've implemented multiple layers of protection:
          </p>
          
          <ul className="space-y-2 my-4 list-disc pl-5">
            <li>Secure escrow system to prevent fraud</li>
            <li>Two-factor authentication for account protection</li>
            <li>Advanced encryption for all sensitive data</li>
            <li>User reputation system to build trust</li>
            <li>Dispute resolution process for handling conflicts</li>
            <li>24/7 system monitoring for suspicious activities</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Supported Cryptocurrencies</h2>
          <p>
            We currently support trading for the following cryptocurrencies:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mr-3"></div>
              <span className="font-medium">Bitcoin (BTC)</span>
            </div>
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
              <span className="font-medium">Ethereum (ETH)</span>
            </div>
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
              <span className="font-medium">Litecoin (LTC)</span>
            </div>
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-green-600 rounded-full mr-3"></div>
              <span className="font-medium">Bitcoin Cash (BCH)</span>
            </div>
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-blue-400 rounded-full mr-3"></div>
              <span className="font-medium">Ripple (XRP)</span>
            </div>
            <div className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-md">
              <div className="w-8 h-8 bg-orange-400 rounded-full mr-3"></div>
              <span className="font-medium">Dogecoin (DOGE)</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Join Our Community</h2>
          <p>
            Ready to start trading on our secure P2P platform? Create an account today and join our
            growing community of traders.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="btn btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
