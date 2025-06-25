'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Brain, Users, Zap, Shield, CheckCircle, TrendingUp, MessageSquare, Target, Star, Clock, Globe } from 'lucide-react';
import ScrollFloatText from './components/ScrollFloatText';
import { AuroraBackground } from './components/AuroraBackground';
import InteractiveEmmaOrb from './components/InteractiveEmmaOrb';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Emma AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <AuroraBackground className="py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollFloatText isHeading={true}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Stop Losing Customers to
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Preventable Churn</span>
              </h1>
            </ScrollFloatText>
            <ScrollFloatText delay={200}>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Emma AI predicts customer health, automates communications, and drives retention with intelligent insights. 
                Turn customer success into your competitive advantage.
              </p>
            </ScrollFloatText>
            <ScrollFloatText delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 transform relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Start Free Forever</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative" />
                </Link>
                <Link href="#demo" className="text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center border border-blue-200 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform bg-white shadow-sm">
                  See Emma in Action
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollFloatText>
            <ScrollFloatText delay={600}>
              <p className="text-sm text-gray-600 mt-4">No credit card required • Setup in 5 minutes</p>
            </ScrollFloatText>
          </div>
        </div>
      </AuroraBackground>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollFloatText isHeading={true}>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Customer Success Challenge
              </h2>
            </ScrollFloatText>
            <ScrollFloatText delay={200}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                73% of customer churn is preventable with early intervention, but most teams are flying blind until it's too late.
              </p>
            </ScrollFloatText>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollFloatText delay={100}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reactive Approach</h3>
                <p className="text-gray-600">By the time you notice churn signals, customers have already mentally checked out.</p>
              </div>
            </ScrollFloatText>
            
            <ScrollFloatText delay={200}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Processes</h3>
                <p className="text-gray-600">Customer success teams spend hours on repetitive tasks instead of building relationships.</p>
              </div>
            </ScrollFloatText>
            
            <ScrollFloatText delay={300}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scattered Data</h3>
                <p className="text-gray-600">Customer health insights are buried across multiple tools and spreadsheets.</p>
              </div>
            </ScrollFloatText>
          </div>
        </div>
      </section>

      {/* Interactive Emma Orb Features Section */}
      <InteractiveEmmaOrb />

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Join 1,000+ Customer Success Teams Fighting Churn
            </h2>
          </div>
          
          {/* Industry Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">73%</div>
              <p className="text-gray-600">of SaaS churn is preventable with early intervention</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <p className="text-gray-600">higher retention for companies using AI-driven customer success</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5x</div>
              <p className="text-gray-600">more expensive to acquire than retain customers</p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Enterprise-Grade Platform</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-medium">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-medium">GDPR Ready</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Early Adopter Program */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-semibold mb-4">Join Our Founding Customer Program</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get lifetime discounts, direct access to our product team, and help shape the future of AI-powered customer success.
            </p>
            <Link href="/auth/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Claim Your Spot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Start Free, Scale as You Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              No credit card required. Upgrade when you're ready to unlock advanced features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-200">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
                <p className="text-gray-600 mb-6">Forever</p>
                <Link href="/auth/signup" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Get Started
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Up to 5 customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Basic health scoring</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Email communications</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Core integrations</span>
                </li>
              </ul>
            </div>

            {/* Plus Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 relative shadow-xl transform scale-105 hover:scale-110 transition-all duration-300 animate-fade-in-up animation-delay-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse-slow">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$49</div>
                <p className="text-gray-600 mb-6">per month</p>
                <Link href="/auth/signup" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 block text-center text-base shadow-lg hover:shadow-xl transform hover:scale-105">
                  Choose Growth
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Up to 50 customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">AI churn prediction</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Automated campaigns</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-400">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scale</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$149</div>
                <p className="text-gray-600 mb-6">per month</p>
                <Link href="/auth/signup" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Choose Scale
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Up to 200 customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Advanced AI models</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Custom workflows</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-500">
      <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">Custom</div>
                <p className="text-gray-600 mb-6">pricing</p>
                <Link href="/auth/signup" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Contact Sales
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Custom AI models</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">White-label options</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated CSM</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">SLA guarantees</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Lifetime Plan - Special Offer */}
          <div className="mt-12 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-400 relative shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-600">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">🔥 LIMITED TIME</span>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Left side - Main offer */}
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Lifetime Access</h3>
                  <p className="text-gray-700 mb-3">Pay once, own forever. No monthly fees, ever.</p>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                    <div className="text-3xl font-bold text-gray-900">$500</div>
                    <div className="text-left">
                      <div className="text-gray-600 line-through text-lg">$1,788</div>
                      <div className="text-green-700 font-semibold text-sm">Save 72%</div>
                    </div>
                  </div>
                  <Link href="/auth/signup" className="inline-block bg-gradient-to-r from-amber-700 to-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:from-amber-800 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Lifetime Access
                  </Link>
                </div>
                
                {/* Right side - Features */}
                <div className="grid md:grid-cols-3 gap-6 flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Everything Unlocked</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Unlimited customers</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">All AI features</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Custom workflows</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Premium Support</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Priority AI support</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">24/7 human support</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Direct developer access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Lifetime Benefits</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Free future updates</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">No monthly fees ever</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">VIP community access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4 text-xs text-gray-700">
                <p>💡 <strong>Smart Investment:</strong> Pays for itself in just 3 months compared to Scale plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Customer Success?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customer success teams using Emma AI to prevent churn and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center">
              Start Free Forever
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/auth/login" className="text-white hover:text-blue-100 font-semibold text-lg flex items-center border border-white/30 px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
          <p className="text-blue-100 text-sm mt-4">No credit card required • Setup in 5 minutes • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">Emma AI</span>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Emma AI. All rights reserved.</p>
          </div>
      </div>
      </footer>
    </div>
  );
}
