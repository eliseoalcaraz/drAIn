"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Droplets, Target, Users, Code, Heart, FileText } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              About drAin
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold mb-6">AI-Driven Urban Flood Intelligence</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              drAin combines hydrological modeling, machine learning, and satellite data to help cities understand, predict, and manage urban flooding through actionable insights.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-6 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Key Features Grid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes drAin Unique</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">SWMM Integration</h3>
                  <p className="text-gray-600">Industry-standard hydrological modeling for accurate drainage network simulation</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Clustering</h3>
                  <p className="text-gray-600">K-means algorithms identify vulnerability patterns and weak points in drainage systems</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Citizen Engagement</h3>
                  <p className="text-gray-600">Real-time reporting and monitoring capabilities for community participation</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Story Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Our Story
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Born from Real-World Challenges</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  drAin emerged from a university research initiative at the <strong>University of the Philippines Cebu</strong>, driven by Computer Science students who witnessed the devastating impact of recurring floods in <strong>Mandaue City</strong>.
                </p>
                <p>
                  While traditional flood maps show <em>where</em> flooding occurs, drAin reveals <em>why</em>—identifying which drainage components are at risk and how infrastructure changes affect resilience.
                </p>
                <p>
                  We bridge the gap between academic research, AI innovation, and civic technology to deliver actionable flood intelligence.
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Our Vision</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Empower local governments with actionable flood data</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Enable citizens to report and monitor drainage conditions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Reduce hydrological study costs using AI and open data</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Promote open-source collaboration for urban resilience</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Principles */}
          <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Principles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">Built with open-source tools and public datasets</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reproducibility</h3>
                <p className="text-sm text-gray-600">Consistent simulation results you can trust</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Scalability</h3>
                <p className="text-sm text-gray-600">Adaptable to new cities and datasets</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">User-Centricity</h3>
                <p className="text-sm text-gray-600">Designed for experts and citizens alike</p>
              </div>
            </div>
          </section>

          {/* Contribution */}
          <section className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
              <p className="text-gray-700 mb-6">
                We welcome developers, researchers, and civic innovators to contribute to sustainable flood management.
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Contribution Areas:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Frontend UI</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Backend API</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Data Science</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Documentation</span>
                </div>
              </div>
            </div>

            <Card className="md:col-span-3 border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Fork the <a href="https://github.com/eliseoalcaraz/drAIn" target="_blank"><span className="font-bold underline decoration-blue-500 text-blue-500">repository</span></a> and set up your environment</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div className="flex-1">
                      <span className="block mb-1">Install dependencies:</span>
                      <code className="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs">pnpm install</code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div className="flex-1">
                      <span className="block mb-1">Run the backend:</span>
                      <code className="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs">uvicorn server:app --reload</code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Create a branch and submit a pull request</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Team & Contact */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
                <p className="text-gray-300 mb-6">
                  Developed and maintained by <strong>Team 2Ls</strong> from the University of the Philippines Cebu, Department of Computer Science.
                </p>
                <div className="space-y-4">
                  <a href="mailto:epalcaraz@up.edu.ph" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>epalcaraz@up.edu.ph</span>
                  </a>
                  <a href="mailto:kborbano@up.edu.ph" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>kborbano@up.edu.ph</span>
                  </a>
                  <a href="mailto:ccbayadog@up.edu.ph" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>ccbayadog@up.edu.ph</span>
                  </a>
                  <a href="mailto:najazul@up.edu.ph" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>najazul@up.edu.ph</span>
                  </a>
                  <a href="mailto:jpsandro@up.edu.ph" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>jpsandro@up.edu.ph</span>
                  </a>
                  
                  {/*
                  <a href="https://github.com/team-2Ls" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors">
                    <Github className="w-5 h-5" />
                    <span>github.com/eliseoalcaraz/drAIn</span> 
                  </a> */}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">License</h2>
                <p className="text-gray-700 mb-6">
                  This project is licensed under the <strong>MIT License</strong>. You are free to use, modify, and distribute the code with proper attribution.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <a href="/LICENSE" download>
                    View License
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2025 Team 2Ls, University of the Philippines Cebu. Building resilient cities through open-source innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}