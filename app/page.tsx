'use client';

import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, TrendingUp, Target, Clock, Star } from 'lucide-react';
import ScrollFloatText from './components/ScrollFloatText';
import InteractiveEmmaOrb from './components/InteractiveEmmaOrb';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Enhanced smooth scrolling with JavaScript
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Custom smooth scroll with easing
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          
          // Alternative method for better browser support
          const targetPosition = targetElement.offsetTop - 80; // Account for navigation height
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup event listeners
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  // Pricing values
  const monthlyPrices = { professional: 50, business: 150 };
  const yearlyPrices = { professional: 40, business: 120 }; // $40/mo and $120/mo billed yearly
  const yearlyTotals = { professional: 480, business: 1440 }; // 40*12, 120*12

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
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced SaaS Branding */}
      <section className="relative overflow-hidden bg-gray-900 py-24 lg:py-32">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
        
        {/* New Modern Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 25% 75%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)
            `
          }}></div>
        </div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>
        
        {/* Floating Elements - More Professional */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle Brand Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-32 right-24 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-24 right-20 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
          
          {/* Tech-inspired geometric elements */}
          <div className="absolute top-1/4 left-1/4 w-1 h-16 bg-gradient-to-b from-blue-400/30 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-12 bg-gradient-to-b from-purple-400/30 to-transparent animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-14 bg-gradient-to-b from-cyan-400/30 to-transparent animate-pulse delay-3000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollFloatText isHeading={true}>
              <h1 className="font-bold mb-6 leading-tight">
                <span className="text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Meet Emma
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Your AI Customer Success Partner
                </span>
              </h1>
            </ScrollFloatText>
            
            <ScrollFloatText delay={200}>
              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
                Stop churn before it starts. Boost retention by 40% with AI-powered insights.
              </p>
              <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto">
                Turn your customer data into revenue protection on autopilot.
              </p>
            </ScrollFloatText>

            {/* Key Benefits */}
            <ScrollFloatText delay={300}>
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-300 font-medium">95% Churn Prediction Accuracy*</span>
                </div>
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-300 font-medium">40% Increase in Retention*</span>
                </div>
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-300 font-medium">5-Minute Setup</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                *Based on internal testing and industry benchmarks. Results may vary.
              </p>
            </ScrollFloatText>
            
            <ScrollFloatText delay={400}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link href="#pricing" className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transform overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Start Free</span>
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1 relative" />
                </Link>
                <Link href="#features" className="group border-2 border-gray-600 text-gray-300 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 hover:border-purple-400 hover:text-white transition-all duration-300 hover:scale-105 transform flex items-center">
                  Watch Demo
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollFloatText>

            {/* Social Proof & Guarantees */}
            <ScrollFloatText delay={500}>
      <div className="text-center">
                <p className="text-sm text-gray-400 mb-6">
                  ✨ No credit card required • Free plan available • Cancel anytime
                </p>
                
                {/* Enterprise Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-400" />
                    <span className="text-sm font-medium">SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    <span className="text-sm font-medium">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="text-sm font-medium">GDPR Ready</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-400" />
                    <span className="text-sm font-medium">5-Minute Setup</span>
                  </div>
                </div>
              </div>
            </ScrollFloatText>
          </div>
        </div>
      </section>

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
                73% of customer churn is preventable with early intervention, but most teams are flying blind until it&apos;s too late.
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
      <div id="features">
        <InteractiveEmmaOrb />
      </div>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              The Customer Success Revolution
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

          {/* Early Adopter Program */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-semibold mb-4">Join Our Founding Customer Program</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get lifetime discounts, direct access to our product team, and help shape the future of AI-powered customer success.
            </p>
            <Link href="#pricing" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Claim Your Spot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-blue-200 text-sm mt-4 font-medium">
              🎯 First 100 clients get 50% lifetime discount + exclusive founder perks
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Start Free, Scale as You Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              No credit card required. Upgrade when you&apos;re ready to unlock advanced features.
            </p>
            {/* Monthly/Yearly Toggle Buttons */}
            <div className="flex justify-center mt-6">
              <div className="relative inline-flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
                <button
                  className={`relative px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform focus:outline-none ${
                    billingPeriod === 'monthly' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 z-10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setBillingPeriod('monthly')}
                  aria-pressed={billingPeriod === 'monthly'}
                >
                  Monthly
                </button>
                <div className="relative">
                  <button
                    className={`relative px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform focus:outline-none ${
                      billingPeriod === 'yearly'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 z-10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setBillingPeriod('yearly')}
                    aria-pressed={billingPeriod === 'yearly'}
                  >
                    Yearly
                  </button>
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap shadow-md z-20">
                    Save 20%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-200">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
                <p className="text-gray-600 mb-6">Forever</p>
                <Link href="#pricing" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Start Free
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">5 customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Health score tracking</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Email alerts</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Basic integrations</span>
                </li>
              </ul>
            </div>

            {/* Plus Plan */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-6 border-2 border-purple-800 transform scale-105 hover:scale-110 transition-all duration-300 animate-fade-in-up animation-delay-300 z-10">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                  <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 min-w-[150px] justify-center rounded-full text-sm font-bold shadow-lg animate-pulse-slow pointer-events-auto whitespace-nowrap">
                    <Star className="h-4 w-4 text-white drop-shadow mr-1" fill="white" stroke="white" />
                    Most Popular
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                  {billingPeriod === 'yearly' && (
                    <div className="flex flex-col items-center mb-1">
                      <div className="text-3xl font-bold text-gray-900">${yearlyTotals.professional}/yr</div>
                      <span className="mt-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">20% off</span>
                      <div className="text-sm text-gray-600">(${yearlyPrices.professional}/mo)</div>
                    </div>
                  )}
                  {billingPeriod === 'monthly' && (
                    <div className="text-3xl font-bold text-gray-900 mb-1">${monthlyPrices.professional}</div>
                  )}
                  <p className="text-gray-600 mb-6">
                    {billingPeriod === 'monthly'
                      ? 'per month'
                      : 'billed yearly'}
                  </p>
                  <Link href="#pricing" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 block text-center text-base shadow-lg hover:shadow-xl transform hover:scale-105">
                    Choose Professional
                  </Link>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">50 customers</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">AI churn prediction</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Automated outreach</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in-up animation-delay-400">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
                {billingPeriod === 'yearly' && (
                  <div className="flex flex-col items-center mb-1">
                    <div className="text-3xl font-bold text-gray-900">${yearlyTotals.business}/yr</div>
                    <span className="mt-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">20% off</span>
                    <div className="text-sm text-gray-600">(${yearlyPrices.business}/mo)</div>
                  </div>
                )}
                {billingPeriod === 'monthly' && (
                  <div className="text-3xl font-bold text-gray-900 mb-1">${monthlyPrices.business}</div>
                )}
                <p className="text-gray-600 mb-6">
                  {billingPeriod === 'monthly'
                    ? 'per month'
                    : 'billed yearly'}
                </p>
                <Link href="#pricing" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Choose Business
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">200 customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Advanced AI models</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Custom workflows</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
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
                <Link href="/contact?type=enterprise" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform block text-center text-sm">
                  Contact Sales
                </Link>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited customers</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Custom AI models</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">White-label options</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated CSM</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
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
                    <div className="text-3xl font-bold text-gray-900">$600</div>
                    <div className="text-left">
                      <div className="text-gray-600 line-through text-lg">$1,788</div>
                      <div className="text-green-700 font-semibold text-sm">Save 66%</div>
                    </div>
                  </div>
                  <Link href="#pricing" className="inline-block bg-gradient-to-r from-amber-700 to-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:from-amber-800 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Lifetime Access
                  </Link>
                </div>
                
                {/* Right side - Features */}
                <div className="grid md:grid-cols-3 gap-6 flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Everything Unlocked</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Unlimited customers</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">All AI features</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Custom workflows</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Premium Support</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Priority AI support</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">24/7 human support</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Direct developer access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Lifetime Benefits</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">Free future updates</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">No monthly fees ever</span>
                      </li>
                      <li className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="text-gray-800">VIP community access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4 text-xs text-gray-700">
                <p>💡 <strong>Smart Investment:</strong> Pays for itself in just 3 months compared to Business plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Stop Churn Before It Starts?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of CS teams using Emma AI to boost retention and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#pricing" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/auth/login" className="text-white hover:text-blue-100 font-semibold text-lg flex items-center border border-white/30 px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
          <p className="text-blue-100 text-sm mt-4">No credit card required • 5-minute setup • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">Emma AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered customer success platform that helps prevent churn and drive growth.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="/contact?type=support" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="/contact?type=feature" className="text-gray-400 hover:text-white transition-colors text-sm">Feature Requests</Link></li>
                <li><Link href="/contact?type=feedback" className="text-gray-400 hover:text-white transition-colors text-sm">Feedback</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">emmaaisaas@gmail.com</li>
                <li><Link href="/contact?type=enterprise" className="text-gray-400 hover:text-white transition-colors text-sm">Sales Inquiries</Link></li>
                <li><Link href="/contact?type=partnership" className="text-gray-400 hover:text-white transition-colors text-sm">Partnerships</Link></li>
                <li className="text-gray-400 text-sm">Response within 24 hours</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-8 mb-4 md:mb-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
              </div>
              <p className="text-gray-400 text-sm">&copy; 2024 Emma AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
