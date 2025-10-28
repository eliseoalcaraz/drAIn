
"use client";

import React, { useState } from 'react';
import { Book, Database, Layers, Zap, Users, Code, GitBranch, Server, Cloud, Map, BarChart3, AlertCircle, CheckCircle, ChevronDown, ChevronRight, Play } from 'lucide-react';

type SectionID =
  | "overview"
  | "architecture"
  | "features"
  | "tech-stack"
  | "data-sources"
  | "simulation"
  | "users"
  | "deployment"
  | "limitations"
  | "demo";

interface ExpandedSections {
  [key: string]: boolean;
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState<SectionID>("overview");
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "features", label: "Core Features", icon: Zap },
    { id: "tech-stack", label: "Technology Stack", icon: Code },
    { id: "data-sources", label: "Data Sources", icon: Database },
    { id: "simulation", label: "Simulation Models", icon: BarChart3 },
    { id: "users", label: "User Stories", icon: Users },
    { id: "deployment", label: "Deployment", icon: Server },
    { id: "limitations", label: "Limitations", icon: AlertCircle },
    { id: "demo", label: "Demonstration", icon: Play }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">drAin</h1>
                <p className="text-sm text-slate-600">Technical Documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Cloud className="w-4 h-4" />
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 px-2">Contents</h2>
              <ul className="space-y-1">
                {sections.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => setActiveSection(id as SectionID)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Overview</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg text-slate-700 leading-relaxed">
                      <strong>drAin</strong> is an AI-driven vulnerability ranking and simulation platform that empowers cities to better understand and manage urban flooding. It integrates satellite-derived datasets with drainage network attributes to model stormwater flows under different scenarios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                      <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Data-Driven</h3>
                      <p className="text-sm text-slate-600">Powered by satellite data and AI clustering</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                      <Zap className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Interactive</h3>
                      <p className="text-sm text-slate-600">Real-time simulation and scenario testing</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                      <Users className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Collaborative</h3>
                      <p className="text-sm text-slate-600">Citizen reporting and admin management</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-1">Problem Statement</h4>
                        <p className="text-sm text-amber-800">
                          Mandaue City grapples with chronic urban flooding due to intensifying rainfall, rapid urbanization, and inadequate drainage infrastructure. Existing flood hazard maps show where floods happen but not why, failing to reveal which specific drainage components are vulnerable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'architecture' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">System Architecture</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Server className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">Frontend Layer</h3>
                          <p className="text-slate-600 text-sm mb-3">Next.js application with Turbopack build optimization, styled with Tailwind CSS</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Next.js</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">React</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Tailwind CSS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Code className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">Backend Layer</h3>
                          <p className="text-slate-600 text-sm mb-3">Python FastAPI for simulation processing and Supabase backend services</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Python FastAPI</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">SWMM</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">K-means ML</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Database className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">Data Layer</h3>
                          <p className="text-slate-600 text-sm mb-3">Supabase PostgreSQL database with real-time capabilities</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Supabase</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">PostgreSQL</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Cloud className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">Deployment</h3>
                          <p className="text-slate-600 text-sm mb-3">Distributed deployment across cloud platforms</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Vercel (Frontend)</span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">Railway (Backend)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'features' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Core Features</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Interactive Map',
                        icon: Map,
                        color: 'blue',
                        features: [
                          'City map with drainage system overlay',
                          'Zoom, satellite view, and position reset',
                          'Clickable reports with maintenance history',
                          'Component visibility controls'
                        ]
                      },
                      {
                        title: 'Overlay Analytics',
                        icon: BarChart3,
                        color: 'purple',
                        features: [
                          'Pie chart statistics for all components',
                          'Toggle visibility for inlets, outlets, drains, pipes',
                          'Bar graph showing report frequency',
                          'Customizable layout settings'
                        ]
                      },
                      {
                        title: 'Inventory Management',
                        icon: Database,
                        color: 'green',
                        features: [
                          'Sortable component tables',
                          'Search by component ID',
                          'Category switching (Inlet, Outlet, Drain, Pipes)',
                          'Mock 3D models for each component'
                        ]
                      },
                      {
                        title: 'Simulation Engine',
                        icon: Zap,
                        color: 'amber',
                        features: [
                          'Static model with pre-simulated data',
                          'Dynamic model with real-time adjustments',
                          'Vulnerability classification (No Risk to High)',
                          'What-if scenario analysis'
                        ]
                      },
                      {
                        title: 'Citizen Reporting',
                        icon: Users,
                        color: 'cyan',
                        features: [
                          'Image upload with embedded coordinates',
                          'Component type selection',
                          'Automatic node pinpointing',
                          'Time-based report filtering'
                        ]
                      },
                      {
                        title: 'Admin Dashboard',
                        icon: CheckCircle,
                        color: 'emerald',
                        features: [
                          'Maintenance history tracking',
                          'Report status updates (pending, in-progress, resolved)',
                          'User account linking to agencies',
                          'Privilege management'
                        ]
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSection(feature.title)}
                          className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                              <feature.icon className={`w-5 h-5 text-${feature.color}-600`} />
                            </div>
                            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                          </div>
                          {expandedSections[feature.title] ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections[feature.title] && (
                          <div className="px-5 pb-5 bg-slate-50">
                            <ul className="space-y-2">
                              {feature.features.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'tech-stack' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Technology Stack</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { category: 'Frontend', tech: 'Next.js', description: 'React framework with server-side rendering', color: 'blue' },
                      { category: 'Styling', tech: 'Tailwind CSS', description: 'Utility-first CSS framework', color: 'cyan' },
                      { category: 'Backend', tech: 'Python FastAPI', description: 'High-performance async API framework', color: 'green' },
                      { category: 'Backend Services', tech: 'Supabase', description: 'Real-time database and authentication', color: 'emerald' },
                      { category: 'Database', tech: 'PostgreSQL', description: 'Via Supabase cloud platform', color: 'purple' },
                      { category: 'Build Tool', tech: 'Turbopack', description: 'Next-gen bundler for fast builds', color: 'orange' },
                      { category: 'Frontend Deploy', tech: 'Vercel', description: 'Serverless deployment platform', color: 'slate' },
                      { category: 'Backend Deploy', tech: 'Railway', description: 'Cloud infrastructure for APIs', color: 'pink' }
                    ].map((item, idx) => (
                      <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-6 rounded-xl border border-${item.color}-200`}>
                        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">{item.category}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{item.tech}</h3>
                        <p className="text-sm text-slate-700">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'data-sources' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Data Sources</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>Primary Source:</strong> Datasets adapted from Quijano and Bañados (2023) - Integrated flood modeling for urban resilience planning in Mandaue City, Philippines
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { dataset: 'Rainfall', source: 'RIDF data from PAGASA via Quijano and Bañados (2023)', icon: Cloud },
                      { dataset: 'Elevation', source: 'LiDAR derived via Quijano and Bañados (2023)', icon: Map },
                      { dataset: 'Land Cover', source: 'Global Map of Local Climate Zones (Demuzere et al, 2022)', icon: Layers },
                      { dataset: 'Drainage Network', source: 'Quijano and Bañados (2023)', icon: GitBranch },
                      { dataset: 'Node Flooding', source: 'SWMM simulation derived', icon: BarChart3 },
                      { dataset: 'Subcatchments', source: 'Aggregated from drainage network data', icon: Database }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{item.dataset}</h3>
                          <p className="text-sm text-slate-600">{item.source}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Satellite Data Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Enhanced spatial accuracy with DEM',
                        'Real-world surface characteristics',
                        'Up-to-date precipitation measurements',
                        'Reduced data collection costs',
                        'Support for continuous model updates'
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'simulation' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Simulation Models</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <p className="text-slate-700">
                    drAin uses the Storm Water Management Model (SWMM) to simulate rainfall-runoff-flooding processes, combined with K-means clustering for vulnerability classification.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Static Model</h3>
                      <p className="text-sm text-slate-700 mb-4">
                        Pre-simulated rainfall-runoff analysis based on historical data and PAGASA RIDF curves.
                      </p>
                      <ul className="space-y-2">
                        {[
                          'Node flooding summaries',
                          'Predicted time to overflow',
                          'Vulnerability classifications',
                          'Multiple rainfall return periods',
                          'Color-coded vulnerability layers'
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Model</h3>
                      <p className="text-sm text-slate-700 mb-4">
                        Interactive on-demand simulations with real-time parameter adjustments.
                      </p>
                      <ul className="space-y-2">
                        {[
                          'Modify rainfall intensity & duration',
                          'Adjust node elevations',
                          'Change conduit dimensions',
                          'Alter flow capacity',
                          'Real-time vulnerability updates',
                          'What-if scenario analysis'
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-100 rounded-xl p-6 border border-slate-300">
                    <h4 className="font-semibold text-slate-900 mb-3">Vulnerability Classification</h4>
                    <p className="text-sm text-slate-700 mb-4">
                      K-means clustering algorithm classifies drainage assets based on:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-xs font-medium text-slate-700">No Risk</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-xs font-medium text-slate-700">Low Risk</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-xs font-medium text-slate-700">Medium Risk</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                        <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-xs font-medium text-slate-700">High Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">User Stories</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        role: 'City Engineer',
                        description: 'Identify vulnerable drainage components and prioritize maintenance schedules',
                        benefit: 'Efficient planning without manual network inspection'
                      },
                      {
                        role: 'Urban Planner',
                        description: 'Simulate infrastructure changes and evaluate design scenarios',
                        benefit: 'Ensure flood-resilient city development'
                      },
                      {
                        role: 'Disaster Risk Reduction',
                        description: 'Run rainfall simulations to predict overflow areas',
                        benefit: 'Prepare early warnings and allocate emergency resources'
                      },
                      {
                        role: 'Environmental Researcher',
                        description: 'Study urban flooding behavior through simulation outputs',
                        benefit: 'Explore correlations between urbanization and vulnerability'
                      },
                      {
                        role: 'Policy Maker',
                        description: 'Review visual maps and vulnerability reports',
                        benefit: 'Data-driven evidence for funding and infrastructure decisions'
                      },
                      {
                        role: 'Citizen',
                        description: 'Report drainage issues with real-time updates',
                        benefit: 'Enhanced situational awareness and faster maintenance response'
                      }
                    ].map((user, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{user.role}</h3>
                            <p className="text-sm text-slate-700 mb-2">{user.description}</p>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-green-700 font-medium">{user.benefit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'deployment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Deployment</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <div className="flex items-start gap-3">
                      <Cloud className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Live Demo Access</h3>
                        <p className="text-sm text-slate-700 mb-3">
                          The drAin platform is currently deployed and accessible for testing and demonstration purposes.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">URL:</span>
                            <code className="px-3 py-1 bg-white rounded border border-slate-300 text-sm text-blue-600">
                              https://project-drain.vercel.app/
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Test Credentials</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700 w-24">Username:</span>
                        <code className="px-4 py-2 bg-white rounded border border-slate-300 text-sm text-slate-900">
                          tester@gmail.com
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700 w-24">Password:</span>
                        <code className="px-4 py-2 bg-white rounded border border-slate-300 text-sm text-slate-900">
                          123password
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Vercel</h3>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">Frontend Deployment</p>
                      <ul className="space-y-2">
                        {[
                          'Next.js application hosting',
                          'Automatic deployments from Git',
                          'Global CDN distribution',
                          'Serverless functions',
                          'Built with Turbopack'
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Railway</h3>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">Backend Deployment</p>
                      <ul className="space-y-2">
                        {[
                          'Python FastAPI hosting',
                          'SWMM simulation processing',
                          'Automated scaling',
                          'Environment management',
                          'Integration with Supabase'
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'limitations' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Limitations & Future Work</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-amber-900 mb-2">Geographic Scope</h3>
                          <p className="text-sm text-amber-800">
                            Currently focused on Mandaue City due to data availability. However, the framework and methodology are scalable and can be adapted to other urban areas with compatible data sources.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Simulation Precision</h3>
                          <p className="text-sm text-blue-800">
                            Offers a simplified approach compared to high-end hydrodynamic software with detailed 3D visualizations. While this limits precision, it greatly enhances computational efficiency, cost-effectiveness, and accessibility for local governments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-purple-900 mb-2">Data Dependency</h3>
                          <p className="text-sm text-purple-800">
                            System accuracy depends on the quality and completeness of satellite data and drainage information available. Incomplete or outdated data may affect simulation reliability.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-cyan-900 mb-2">Clustering Interpretation</h3>
                          <p className="text-sm text-cyan-800">
                            K-means clustering provides relative vulnerability groupings that require expert interpretation for decision-making. Results should be validated by domain experts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-green-900 mb-2">User Participation</h3>
                          <p className="text-sm text-green-800">
                            Citizen reporting feature depends on consistent user participation and verified data submissions to maintain accuracy and effectiveness.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-300 mt-8">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      Future Development
                    </h3>
                    <p className="text-sm text-slate-700 mb-4">
                      Further development will involve collaboration with civil and environmental engineering experts to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Refine model parameters',
                        'Improve simulation accuracy',
                        'Enhance decision-support features',
                        'Expand to additional cities',
                        'Integrate real-time sensor data',
                        'Develop mobile applications'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'demo' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">System Demo</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6"></div>
                  </div>

                  {/* Demo Video Section */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Play className="w-6 h-6" />
                      Watch the Demo
                    </h3>
                    <p className="text-slate-300 mb-6">
                      See FloodSim in action: explore real-time flood simulations, vulnerability assessments, and interactive features.
                    </p>
                    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-slate-700" style={{ paddingBottom: '56.25%' }}>
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full" 
                        src="https://www.youtube.com/embed/nNgk9dVrgxM?si=2kIyrGv9e0vbDH0h" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>
                </div>)}

            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-600">
              <p>Built by Computer Science students from University of the Philippines - Cebu</p>
              <p className="mt-1">© 2024 drAin Project. All rights reserved.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}