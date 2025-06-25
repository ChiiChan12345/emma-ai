"use client";
import React, { useState, useEffect } from 'react';
import { Brain, BarChart3, Zap, MessageSquare, Users, Globe } from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  position: { x: number; y: number };
  color: string;
  glowColor: string;
}

const capabilities: Capability[] = [
  {
    id: 'prediction',
    title: 'AI Churn Prediction',
    description: 'Identify at-risk customers weeks before they churn with 95% accuracy',
    icon: Brain,
    position: { x: 10, y: 15 },
    color: 'text-blue-600',
    glowColor: 'shadow-blue-500/50'
  },
  {
    id: 'health',
    title: 'Real-Time Health Scoring',
    description: 'Monitor customer health across 50+ signals with live dashboards',
    icon: BarChart3,
    position: { x: 90, y: 20 },
    color: 'text-green-600',
    glowColor: 'shadow-green-500/50'
  },
  {
    id: 'automation',
    title: 'Automated Campaigns',
    description: 'Set up intelligent communication workflows',
    icon: Zap,
    position: { x: 95, y: 50 },
    color: 'text-purple-600',
    glowColor: 'shadow-purple-500/50'
  },
  {
    id: 'communication',
    title: 'Smart Communications',
    description: 'AI-generated personalized messages that resonate',
    icon: MessageSquare,
    position: { x: 10, y: 80 },
    color: 'text-orange-600',
    glowColor: 'shadow-orange-500/50'
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Centralized customer insights for your entire team',
    icon: Users,
    position: { x: 5, y: 50 },
    color: 'text-red-600',
    glowColor: 'shadow-red-500/50'
  },
  {
    id: 'integrations',
    title: 'Seamless Integrations',
    description: 'Connect with your existing tools and platforms',
    icon: Globe,
    position: { x: 90, y: 85 },
    color: 'text-indigo-600',
    glowColor: 'shadow-indigo-500/50'
  }
];

export default function InteractiveEmmaOrb() {
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Orb Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-bold text-white mb-6">
            AI-Powered Customer Success
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Emma AI combines predictive analytics, automation, and intelligent insights to help you retain more customers.
          </p>
        </div>

        {/* Interactive Orb Diagram */}
        <div className="relative w-full h-[800px] mx-auto">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {capabilities.map((capability) => {
              const centerX = 50;
              const centerY = 50;
              const isHovered = hoveredCapability === capability.id;
              
              return (
                <line
                  key={capability.id}
                  x1={`${centerX}%`}
                  y1={`${centerY}%`}
                  x2={`${capability.position.x}%`}
                  y2={`${capability.position.y}%`}
                  stroke={isHovered ? '#60a5fa' : '#6b7280'}
                  strokeWidth={isHovered ? '3' : '1.5'}
                  strokeDasharray={isHovered ? 'none' : '5,5'}
                  className="transition-all duration-300"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))' : 'none'
                  }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;10"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </svg>

          {/* Central Emma AI Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 3 }}>
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 w-72 h-72 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-30 animate-pulse blur-sm"></div>
              
              {/* Middle Ring */}
              <div className="absolute inset-4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-40 animate-spin-slow blur-sm"></div>
              
              {/* Inner Orb */}
              <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-2xl flex items-center justify-center overflow-hidden border border-white/20">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 animate-aurora rounded-full"></div>
                
                {/* Glass Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                
                {/* Emma AI Text */}
                <div className="relative z-10 text-center">
                  <div className="text-white font-bold text-4xl mb-3 drop-shadow-lg">Emma</div>
                  <div className="text-blue-100 text-2xl font-medium drop-shadow-md">AI</div>
                </div>

                {/* Enhanced Floating Particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-12 w-2 h-2 bg-white rounded-full opacity-70 animate-float"></div>
                  <div className="absolute top-16 right-14 w-2.5 h-2.5 bg-blue-200 rounded-full opacity-60 animate-float-delayed"></div>
                  <div className="absolute bottom-12 left-16 w-2 h-2 bg-purple-200 rounded-full opacity-80 animate-float-slow"></div>
                  <div className="absolute bottom-14 right-12 w-2 h-2 bg-indigo-200 rounded-full opacity-70 animate-float"></div>
                  <div className="absolute top-28 left-8 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-float-delayed"></div>
                  <div className="absolute bottom-8 right-28 w-1.5 h-1.5 bg-purple-100 rounded-full opacity-50 animate-float"></div>
                  <div className="absolute top-20 right-20 w-1 h-1 bg-cyan-200 rounded-full opacity-60 animate-float-slow"></div>
                  <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-100 rounded-full opacity-70 animate-float"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Capability Nodes */}
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            const isHovered = hoveredCapability === capability.id;
            
            return (
              <div
                key={capability.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${capability.position.x}%`,
                  top: `${capability.position.y}%`,
                  zIndex: 2
                }}
                onMouseEnter={() => setHoveredCapability(capability.id)}
                onMouseLeave={() => setHoveredCapability(null)}
              >
                {/* Capability Node */}
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <div className={`absolute inset-0 w-24 h-24 rounded-full transition-all duration-500 ${
                    capability.id === 'prediction' ? 'bg-blue-500/30' :
                    capability.id === 'health' ? 'bg-green-500/30' :
                    capability.id === 'automation' ? 'bg-purple-500/30' :
                    capability.id === 'communication' ? 'bg-orange-500/30' :
                    capability.id === 'collaboration' ? 'bg-red-500/30' :
                    'bg-indigo-500/30'
                  } ${isHovered ? 'animate-pulse scale-110 blur-sm' : 'blur-md opacity-60'}`}></div>
                  
                  {/* Middle Ring */}
                  <div className={`absolute inset-1 w-22 h-22 rounded-full transition-all duration-300 ${
                    capability.id === 'prediction' ? 'bg-blue-400/40' :
                    capability.id === 'health' ? 'bg-green-400/40' :
                    capability.id === 'automation' ? 'bg-purple-400/40' :
                    capability.id === 'communication' ? 'bg-orange-400/40' :
                    capability.id === 'collaboration' ? 'bg-red-400/40' :
                    'bg-indigo-400/40'
                  } ${isHovered ? 'animate-spin-slow blur-sm' : 'blur-sm opacity-50'}`}></div>
                  
                  {/* Main Circle */}
                  <div className={`relative w-24 h-24 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-500 border-2 overflow-hidden ${
                    capability.id === 'prediction' ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-300/50' :
                    capability.id === 'health' ? 'bg-gradient-to-br from-green-500 to-green-700 border-green-300/50' :
                    capability.id === 'automation' ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-300/50' :
                    capability.id === 'communication' ? 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-300/50' :
                    capability.id === 'collaboration' ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-300/50' :
                    'bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-300/50'
                  } ${isHovered ? 'scale-125 shadow-2xl' : 'hover:scale-110 shadow-xl'}`}>
                    
                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>
                    
                    {/* Animated Background Pattern */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
                      capability.id === 'prediction' ? 'bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20' :
                      capability.id === 'health' ? 'bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20' :
                      capability.id === 'automation' ? 'bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-purple-400/20' :
                      capability.id === 'communication' ? 'bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-400/20' :
                      capability.id === 'collaboration' ? 'bg-gradient-to-r from-red-400/20 via-pink-400/20 to-red-400/20' :
                      'bg-gradient-to-r from-indigo-400/20 via-blue-400/20 to-indigo-400/20'
                    } ${isHovered ? 'animate-aurora' : ''}`}></div>
                    
                    {/* Icon */}
                    <Icon className={`relative z-10 h-10 w-10 text-white transition-all duration-500 drop-shadow-lg ${isHovered ? 'scale-110 drop-shadow-2xl' : ''}`} />
                    
                    {/* Floating Particles */}
                    {isHovered && (
                      <div className="absolute inset-0">
                        <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-80 animate-float"></div>
                        <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-white/70 rounded-full opacity-60 animate-float-delayed"></div>
                        <div className="absolute bottom-3 left-2 w-1 h-1 bg-white/60 rounded-full opacity-70 animate-float-slow"></div>
                        <div className="absolute bottom-2 right-3 w-1 h-1 bg-white/80 rounded-full opacity-50 animate-float"></div>
                      </div>
                    )}
                    
                    {/* Pulse Ring */}
                    {isHovered && (
                      <div className={`absolute inset-0 rounded-full border-2 animate-ping opacity-60 ${
                        capability.id === 'prediction' ? 'border-blue-300' :
                        capability.id === 'health' ? 'border-green-300' :
                        capability.id === 'automation' ? 'border-purple-300' :
                        capability.id === 'communication' ? 'border-orange-300' :
                        capability.id === 'collaboration' ? 'border-red-300' :
                        'border-indigo-300'
                      }`}></div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Title */}
                <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`text-white font-semibold text-sm whitespace-nowrap px-4 py-2 rounded-full border transition-all duration-300 ${
                    isHovered 
                      ? 'bg-black/60 backdrop-blur-md border-white/40 shadow-lg scale-105' 
                      : 'bg-black/40 backdrop-blur-sm border-white/20 shadow-md'
                  }`}>
                    {capability.title}
                  </div>
                  
                  {/* Subtitle/Description on Hover */}
                  {isHovered && (
                    <div className="mt-2 text-xs text-gray-300 max-w-48 mx-auto leading-relaxed animate-fade-in-up">
                      {capability.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Background Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-float"></div>
            <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-float-delayed"></div>
            <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-35 animate-float-slow"></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-cyan-400 rounded-full opacity-45 animate-float"></div>
            <div className="absolute top-1/3 left-5 w-1 h-1 bg-orange-400 rounded-full opacity-60 animate-float-delayed"></div>
            <div className="absolute top-2/3 right-5 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-40 animate-float-slow"></div>
            
            {/* Ambient Text Features */}
            <div className="absolute top-1/6 left-1/8 text-white/10 text-6xl font-bold rotate-12 animate-pulse select-none">
              AI
            </div>
            <div className="absolute bottom-1/5 right-1/6 text-blue-400/15 text-4xl font-semibold -rotate-12 animate-float select-none">
              PREDICT
            </div>
            <div className="absolute top-2/5 right-1/8 text-purple-400/12 text-3xl font-medium rotate-45 animate-float-delayed select-none">
              AUTOMATE
            </div>
            <div className="absolute bottom-2/5 left-1/6 text-green-400/15 text-3xl font-medium -rotate-45 animate-float-slow select-none">
              ANALYZE
            </div>
            
            {/* Additional Large Text Elements */}
            <div className="absolute top-1/8 left-2/3 text-cyan-400/12 text-5xl font-bold rotate-6 animate-float select-none">
              EMMA
            </div>
            <div className="absolute bottom-1/8 left-1/5 text-orange-400/15 text-3xl font-semibold -rotate-12 animate-pulse select-none">
              INSIGHTS
            </div>
            <div className="absolute top-4/5 right-1/5 text-pink-400/12 text-3xl font-medium rotate-15 animate-float-delayed select-none">
              OPTIMIZE
            </div>
            <div className="absolute top-1/12 right-2/5 text-indigo-400/10 text-4xl font-bold -rotate-6 animate-float-slow select-none">
              SMART
            </div>
            <div className="absolute bottom-1/12 left-2/5 text-yellow-400/15 text-3xl font-semibold rotate-8 animate-pulse select-none">
              SCALE
            </div>
            
            {/* Technical Keywords */}
            <div className="absolute top-1/7 left-4/5 text-blue-300/20 text-2xl font-mono rotate-3 animate-float select-none">
              ML
            </div>
            <div className="absolute bottom-1/7 right-4/5 text-purple-300/18 text-2xl font-mono -rotate-3 animate-float-delayed select-none">
              NLP
            </div>
            <div className="absolute top-6/7 left-1/6 text-green-300/20 text-2xl font-mono rotate-6 animate-float-slow select-none">
              API
            </div>
            <div className="absolute bottom-6/7 right-1/6 text-cyan-300/18 text-2xl font-mono -rotate-6 animate-pulse select-none">
              SDK
            </div>
            
            {/* Floating Data Points */}
            <div className="absolute top-1/10 left-1/3 text-cyan-400/20 text-sm font-mono animate-float select-none">
              95% accuracy
            </div>
            <div className="absolute bottom-1/10 left-3/5 text-orange-400/20 text-sm font-mono animate-float-delayed select-none">
              real-time insights
            </div>
            <div className="absolute top-3/5 left-1/12 text-purple-400/20 text-sm font-mono animate-float-slow select-none">
              24/7 monitoring
            </div>
            <div className="absolute top-2/5 right-1/12 text-blue-400/20 text-sm font-mono animate-float select-none">
              instant alerts
            </div>
            
            {/* Additional Data Points */}
            <div className="absolute top-1/4 right-1/5 text-green-400/18 text-xs font-mono animate-float-delayed select-none">
              50+ data sources
            </div>
            <div className="absolute bottom-1/4 left-1/4 text-pink-400/18 text-xs font-mono animate-float-slow select-none">
              99.9% uptime
            </div>
            <div className="absolute top-3/4 left-1/3 text-indigo-400/18 text-xs font-mono animate-pulse select-none">
              enterprise ready
            </div>
            <div className="absolute bottom-3/4 right-1/3 text-yellow-400/18 text-xs font-mono animate-float select-none">
              GDPR compliant
            </div>
            <div className="absolute top-1/5 left-5/6 text-red-400/18 text-xs font-mono animate-float-delayed select-none">
              SOC 2 certified
            </div>
            <div className="absolute bottom-4/5 right-5/6 text-teal-400/18 text-xs font-mono animate-float-slow select-none">
              ISO 27001
            </div>
            
            {/* Success Metrics */}
            <div className="absolute top-3/5 left-1/5 text-emerald-400/20 text-sm font-semibold animate-float select-none">
              +40% retention
            </div>
            <div className="absolute bottom-2/5 right-1/7 text-violet-400/20 text-sm font-semibold animate-float-delayed select-none">
              -60% churn
            </div>
            <div className="absolute top-1/9 left-3/4 text-amber-400/20 text-sm font-semibold animate-float-slow select-none">
              3x ROI
            </div>
            <div className="absolute bottom-1/9 right-3/4 text-rose-400/20 text-sm font-semibold animate-pulse select-none">
              50% faster
            </div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-12 right-1/3 w-8 h-8 border border-white/10 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-12 left-1/3 w-6 h-6 border border-blue-400/15 rounded-full animate-pulse"></div>
            <div className="absolute top-2/3 left-12 w-4 h-8 bg-gradient-to-t from-purple-400/10 to-transparent animate-float"></div>
            <div className="absolute bottom-2/3 right-12 w-8 h-4 bg-gradient-to-r from-cyan-400/10 to-transparent animate-float-delayed"></div>
            
            {/* Additional Geometric Elements */}
            <div className="absolute top-1/4 right-12 w-3 h-12 bg-gradient-to-b from-orange-400/15 to-transparent animate-float-slow"></div>
            <div className="absolute bottom-1/4 left-12 w-12 h-3 bg-gradient-to-r from-green-400/15 to-transparent animate-pulse"></div>
            <div className="absolute top-1/8 left-1/4 w-6 h-6 border-2 border-pink-400/20 rotate-12 animate-float"></div>
            <div className="absolute bottom-1/8 right-1/4 w-8 h-8 border border-indigo-400/15 rounded-full animate-float-delayed"></div>
            <div className="absolute top-7/8 left-3/4 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-7/8 right-3/4 w-5 h-5 border border-teal-400/15 rotate-45 animate-float-slow"></div>
            
            {/* Dotted Patterns */}
            <div className="absolute top-1/3 left-1/8 w-2 h-2 bg-blue-400/25 rounded-full animate-float"></div>
            <div className="absolute top-1/3 left-1/8 w-2 h-2 bg-blue-400/25 rounded-full animate-float" style={{ marginLeft: '8px' }}></div>
            <div className="absolute top-1/3 left-1/8 w-2 h-2 bg-blue-400/25 rounded-full animate-float" style={{ marginLeft: '16px' }}></div>
            
            <div className="absolute bottom-1/3 right-1/8 w-1.5 h-1.5 bg-purple-400/25 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-1/3 right-1/8 w-1.5 h-1.5 bg-purple-400/25 rounded-full animate-float-delayed" style={{ marginRight: '6px' }}></div>
            <div className="absolute bottom-1/3 right-1/8 w-1.5 h-1.5 bg-purple-400/25 rounded-full animate-float-delayed" style={{ marginRight: '12px' }}></div>
            
            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-16 h-px bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
            <div className="absolute top-4 left-4 w-px h-16 bg-gradient-to-b from-white/20 to-transparent animate-pulse"></div>
            
            <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-l from-blue-400/20 to-transparent animate-float"></div>
            <div className="absolute top-4 right-4 w-px h-16 bg-gradient-to-b from-blue-400/20 to-transparent animate-float"></div>
            
            <div className="absolute bottom-4 left-4 w-16 h-px bg-gradient-to-r from-green-400/20 to-transparent animate-float-delayed"></div>
            <div className="absolute bottom-4 left-4 w-px h-16 bg-gradient-to-t from-green-400/20 to-transparent animate-float-delayed"></div>
            
            <div className="absolute bottom-4 right-4 w-16 h-px bg-gradient-to-l from-purple-400/20 to-transparent animate-float-slow"></div>
            <div className="absolute bottom-4 right-4 w-px h-16 bg-gradient-to-t from-purple-400/20 to-transparent animate-float-slow"></div>
            
            {/* Connection Lines */}
            <div className="absolute top-1/4 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/2 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/15 to-transparent animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-purple-400/10 to-transparent animate-float-delayed"></div>
            <div className="absolute top-1/2 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-green-400/15 to-transparent animate-float-slow"></div>
            
            {/* Additional Connection Lines */}
            <div className="absolute top-1/6 left-1/3 w-20 h-px bg-gradient-to-r from-transparent via-cyan-400/12 to-transparent animate-float"></div>
            <div className="absolute bottom-1/6 right-1/3 w-28 h-px bg-gradient-to-l from-transparent via-orange-400/12 to-transparent animate-float-delayed"></div>
            <div className="absolute top-5/6 left-2/3 w-px h-20 bg-gradient-to-t from-transparent via-pink-400/12 to-transparent animate-float-slow"></div>
            <div className="absolute bottom-5/6 right-2/3 w-px h-28 bg-gradient-to-b from-transparent via-indigo-400/12 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-24">
          <p className="text-xl text-gray-300 mb-8">
            Ready to transform your customer success strategy?
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Explore Emma AI
          </button>
        </div>
      </div>
    </section>
  );
} 