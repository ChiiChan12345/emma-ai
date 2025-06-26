"use client";
import React, { useState } from 'react';
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

          {/* Central Emma AI Orb - Enhanced Modern Design */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 3 }}>
            <div className="relative">
              {/* Outer Orbital Ring - Perfectly aligned with main orb */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-400/20 animate-spin-slow">
                {/* Particles positioned correctly on the ring circumference */}
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" 
                     style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}></div>
                <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-purple-400/50" 
                     style={{ bottom: '-4px', left: '50%', transform: 'translateX(-50%)' }}></div>
              </div>
              
              {/* Secondary Orbital Ring - Perfectly aligned with main orb */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-88 h-88 rounded-full border border-purple-400/15 animate-reverse-spin">
                {/* Particles positioned correctly on the ring circumference */}
                <div className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse delay-500 shadow-lg shadow-cyan-400/50" 
                     style={{ top: '50%', right: '-5px', transform: 'translateY(-50%)' }}></div>
                <div className="absolute w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-1500 shadow-lg shadow-indigo-400/50" 
                     style={{ top: '50%', left: '-4px', transform: 'translateY(-50%)' }}></div>
              </div>
              
              {/* Outer Glow Ring - Enhanced and perfectly centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 via-cyan-500/40 to-indigo-500/40 animate-pulse blur-lg"></div>
              
              {/* Middle Energy Ring - Perfectly centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-76 h-76 rounded-full bg-gradient-conic from-blue-400/30 via-purple-400/30 via-cyan-400/30 via-indigo-400/30 to-blue-400/30 animate-spin blur-md"></div>
              
              {/* Inner Orb - Main Emma AI Circle (72x72 = w-72 h-72) */}
              <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-purple-900/90 shadow-2xl flex items-center justify-center overflow-hidden border border-white/10 backdrop-blur-xl">
                
                {/* Dynamic Animated Background Layers */}
                <div className="absolute inset-0 bg-gradient-conic from-blue-500/20 via-purple-500/20 via-cyan-500/20 via-indigo-500/20 to-blue-500/20 animate-spin-slow rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-400/10 to-purple-400/20 animate-pulse rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-transparent via-transparent to-indigo-400/15 animate-aurora rounded-full"></div>
                
                {/* Glass Morphism Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-white/5 to-transparent"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-transparent via-white/5 to-white/10"></div>
                
                {/* Inner Glow */}
                <div className="absolute inset-4 rounded-full bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent animate-pulse"></div>
                
                {/* Emma AI Text - Enhanced */}
                <div className="relative z-10 text-center">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 font-bold text-5xl mb-2 drop-shadow-2xl animate-text-shimmer">
                    Emma
                  </div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 text-3xl font-medium drop-shadow-xl">
                    AI
                  </div>
                  <div className="mt-2 text-blue-200/60 text-xs font-light tracking-widest uppercase">
                    Neural Engine
                  </div>
                </div>

                {/* Enhanced Floating Particles System */}
                <div className="absolute inset-0">
                  {/* Large particles */}
                  <div className="absolute top-12 left-16 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-80 animate-float shadow-lg shadow-blue-400/50"></div>
                  <div className="absolute top-20 right-18 w-3.5 h-3.5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-70 animate-float-delayed shadow-lg shadow-purple-400/50"></div>
                  <div className="absolute bottom-16 left-20 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-90 animate-float-slow shadow-lg shadow-cyan-400/50"></div>
                  <div className="absolute bottom-18 right-16 w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-80 animate-float shadow-lg shadow-indigo-400/50"></div>
                  
                  {/* Medium particles */}
                  <div className="absolute top-32 left-12 w-2 h-2 bg-white/80 rounded-full opacity-70 animate-float-delayed shadow-sm shadow-white/50"></div>
                  <div className="absolute bottom-12 right-32 w-2 h-2 bg-purple-200/70 rounded-full opacity-60 animate-float shadow-sm shadow-purple-200/40"></div>
                  <div className="absolute top-24 right-24 w-2 h-2 bg-cyan-200/80 rounded-full opacity-75 animate-float-slow shadow-sm shadow-cyan-200/50"></div>
                  <div className="absolute bottom-24 left-24 w-2 h-2 bg-blue-200/70 rounded-full opacity-80 animate-float shadow-sm shadow-blue-200/40"></div>
                  
                  {/* Small particles */}
                  <div className="absolute top-16 left-28 w-1.5 h-1.5 bg-white/60 rounded-full opacity-60 animate-float-delayed"></div>
                  <div className="absolute top-28 right-14 w-1 h-1 bg-purple-100/70 rounded-full opacity-50 animate-float"></div>
                  <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-cyan-100/80 rounded-full opacity-70 animate-float-slow"></div>
                  <div className="absolute bottom-32 right-20 w-1 h-1 bg-blue-100/60 rounded-full opacity-60 animate-float"></div>
                  
                  {/* Micro particles */}
                  <div className="absolute top-36 left-36 w-1 h-1 bg-white/40 rounded-full opacity-40 animate-float-delayed"></div>
                  <div className="absolute top-40 right-36 w-0.5 h-0.5 bg-purple-200/50 rounded-full opacity-50 animate-float"></div>
                  <div className="absolute bottom-36 left-40 w-1 h-1 bg-cyan-200/40 rounded-full opacity-45 animate-float-slow"></div>
                  <div className="absolute bottom-40 right-40 w-0.5 h-0.5 bg-blue-200/50 rounded-full opacity-40 animate-float"></div>
                </div>
                
                {/* Scanning Lines Effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-scan-vertical"></div>
                  <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-transparent via-blue-400/60 to-transparent animate-scan-horizontal"></div>
                </div>
                
                {/* Pulse Rings */}
                <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping opacity-40"></div>
                <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-ping opacity-30 animation-delay-1000"></div>
                <div className="absolute inset-4 rounded-full border border-cyan-400/20 animate-ping opacity-20 animation-delay-2000"></div>
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
            {/* Simple corner accents only - no overlapping text */}
            <div className="absolute top-4 left-4 w-16 h-px bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
            <div className="absolute top-4 left-4 w-px h-16 bg-gradient-to-b from-white/20 to-transparent animate-pulse"></div>
            
            <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-l from-blue-400/20 to-transparent animate-float"></div>
            <div className="absolute top-4 right-4 w-px h-16 bg-gradient-to-b from-blue-400/20 to-transparent animate-float"></div>
            
            <div className="absolute bottom-4 left-4 w-16 h-px bg-gradient-to-r from-green-400/20 to-transparent animate-float-delayed"></div>
            <div className="absolute bottom-4 left-4 w-px h-16 bg-gradient-to-t from-green-400/20 to-transparent animate-float-delayed"></div>
            
            <div className="absolute bottom-4 right-4 w-16 h-px bg-gradient-to-l from-purple-400/20 to-transparent animate-float-slow"></div>
            <div className="absolute bottom-4 right-4 w-px h-16 bg-gradient-to-t from-purple-400/20 to-transparent animate-float-slow"></div>
            
            {/* Subtle geometric shapes - positioned to avoid text */}
            <div className="absolute top-12 right-12 w-8 h-8 border border-white/10 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-12 left-12 w-6 h-6 border border-blue-400/15 rounded-full animate-pulse"></div>
            
            {/* Small floating particles - positioned to avoid text overlap */}
            <div className="absolute top-16 left-16 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-float"></div>
            <div className="absolute top-24 right-24 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-float-delayed"></div>
            <div className="absolute bottom-24 left-24 w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-35 animate-float-slow"></div>
            <div className="absolute bottom-16 right-16 w-2 h-2 bg-cyan-400 rounded-full opacity-45 animate-float"></div>
            
            {/* AI Features Text - Spread across almost the entire div area */}
            {/* Top row - spread wide */}
            <div className="absolute top-1/6 left-1/6 text-blue-400/60 text-lg font-bold animate-float select-none">
              95% Accuracy
            </div>
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 text-cyan-400/55 text-xl font-semibold animate-float-delayed select-none">
              Real-time Analytics
            </div>
            <div className="absolute top-1/6 right-1/6 text-purple-400/60 text-lg font-bold animate-float-slow select-none">
              Smart Automation
            </div>
            
            {/* Upper middle row */}
            <div className="absolute top-1/3 left-1/8 text-green-400/55 text-base font-semibold animate-float select-none">
              AI-Powered
            </div>
            <div className="absolute top-1/4 left-1/3 text-orange-400/50 text-lg font-medium animate-float-delayed select-none">
              24/7 Monitoring
            </div>
            <div className="absolute top-1/4 right-1/3 text-pink-400/50 text-lg font-medium animate-float-slow select-none">
              Predictive
            </div>
            <div className="absolute top-1/3 right-1/8 text-indigo-400/55 text-base font-semibold animate-float select-none">
              Enterprise Ready
            </div>
            
            {/* Middle row - wide spread */}
            <div className="absolute top-1/2 left-1/12 text-teal-400/50 text-base font-medium animate-float-delayed select-none">
              Machine Learning
            </div>
            <div className="absolute top-2/5 left-1/4 text-rose-400/55 text-lg font-semibold animate-float-slow select-none">
              Natural Language
            </div>
            <div className="absolute top-2/5 right-1/4 text-sky-400/55 text-lg font-semibold animate-float select-none">
              Cloud Native
            </div>
            <div className="absolute top-1/2 right-1/12 text-lime-400/50 text-base font-medium animate-float-delayed select-none">
              API First
            </div>
            
            {/* Lower middle row */}
            <div className="absolute top-3/5 left-1/8 text-blue-300/55 text-base font-semibold animate-pulse select-none">
              3x ROI
            </div>
            <div className="absolute top-2/3 left-1/3 text-purple-300/50 text-lg font-medium animate-float select-none">
              50% Faster
            </div>
            <div className="absolute top-2/3 right-1/3 text-green-300/50 text-lg font-medium animate-float-delayed select-none">
              99.9% Uptime
            </div>
            <div className="absolute top-3/5 right-1/8 text-orange-300/55 text-base font-semibold animate-float-slow select-none">
              SOC 2 Certified
            </div>
            
            {/* Bottom row - spread wide */}
            <div className="absolute bottom-1/6 left-1/6 text-emerald-400/60 text-lg font-bold animate-pulse select-none">
              +40% Retention
            </div>
            <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 text-violet-400/55 text-xl font-semibold animate-float select-none">
              Instant Insights
            </div>
            <div className="absolute bottom-1/6 right-1/6 text-amber-400/60 text-lg font-bold animate-float-delayed select-none">
              Zero Downtime
            </div>
            
            {/* Additional spread elements - fill more space */}
            <div className="absolute top-1/8 left-1/4 text-cyan-300/45 text-sm font-medium animate-float-slow select-none">
              Deep Learning
            </div>
            <div className="absolute top-1/8 right-1/4 text-pink-300/45 text-sm font-medium animate-float select-none">
              Auto-scaling
            </div>
            <div className="absolute top-3/8 left-1/10 text-indigo-300/45 text-sm font-medium animate-float-delayed select-none">
              Real-time
            </div>
            <div className="absolute top-3/8 right-1/10 text-teal-300/45 text-sm font-medium animate-float-slow select-none">
              Intelligent
            </div>
            <div className="absolute top-5/8 left-1/10 text-orange-300/45 text-sm font-medium animate-float select-none">
              Automated
            </div>
            <div className="absolute top-5/8 right-1/10 text-purple-300/45 text-sm font-medium animate-float-delayed select-none">
              Scalable
            </div>
            <div className="absolute bottom-1/8 left-1/4 text-green-300/45 text-sm font-medium animate-float-slow select-none">
              Secure
            </div>
            <div className="absolute bottom-1/8 right-1/4 text-blue-300/45 text-sm font-medium animate-float select-none">
              Reliable
            </div>
            
            {/* Corner elements - extend to edges */}
            <div className="absolute top-1/10 left-1/10 text-rose-300/40 text-xs font-light animate-float-delayed select-none">
              ML/AI
            </div>
            <div className="absolute top-1/10 right-1/10 text-cyan-300/40 text-xs font-light animate-float-slow select-none">
              NLP
            </div>
            <div className="absolute bottom-1/10 left-1/10 text-purple-300/40 text-xs font-light animate-float select-none">
              API
            </div>
            <div className="absolute bottom-1/10 right-1/10 text-amber-300/40 text-xs font-light animate-float-delayed select-none">
              SDK
            </div>
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