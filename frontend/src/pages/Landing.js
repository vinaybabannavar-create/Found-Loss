import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  MapPin,
  MessageCircle,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Eye,
  PlusCircle
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Search,
      title: 'Easy Search & Browse',
      description: 'Quickly find lost items or browse found items in your area with smart filtering.'
    },
    {
      icon: MapPin,
      title: 'Location Based',
      description: 'Post and find items based on precise locations with integrated mapping.'
    },
    {
      icon: MessageCircle,
      title: 'Direct Contact',
      description: 'Contact item owners directly via email, WhatsApp, or SMS instantly.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your personal information is protected and only shared when you choose to contact.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Items Reunited' },
    { number: '5K+', label: 'Active Users' },
    { number: '99%', label: 'Success Rate' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Search className="text-white" size={16} />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">Found&Loss</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/how-to-use" className="text-slate-600 hover:text-slate-900 font-medium">
                How it Works
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 py-20 lg:py-28">
        <div className="gradient-mesh absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-up">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-6">
              Reunite With Your
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Lost Items
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most efficient platform to post found items, search for lost belongings, and connect with their owners. Join thousands who have already reunited with their precious items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button className="btn-primary text-lg px-8 py-4 animate-pulse-glow" data-testid="get-started-btn">
                  Get Started Free
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button variant="outline" className="btn-secondary text-lg px-8 py-4">
                  <Eye className="mr-2" size={20} />
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-display font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">
              Why Choose Found&Loss?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We've built the most comprehensive platform for reuniting people with their lost items
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="glass-card p-8 text-center animate-fade-up hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-slate-600">Get started in minutes</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Sign Up & Post',
                description: 'Create your account and post details about found or lost items with location and photos.',
                icon: PlusCircle
              },
              {
                step: '02',
                title: 'Search & Browse',
                description: 'Browse through posted items or use our smart search to find what you\'re looking for.',
                icon: Search
              },
              {
                step: '03',
                title: 'Connect & Reunite',
                description: 'Contact item owners directly through email, WhatsApp, or SMS to arrange pickup.',
                icon: Users
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center animate-slide-left" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Find What's Lost?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who have successfully reunited with their belongings
          </p>
          <Link to="/signup">
            <Button className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-4 font-semibold">
              Start Your Journey Today
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Search className="text-white" size={16} />
                </div>
                <span className="font-display font-bold text-xl">Found&Loss</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Connecting people with their lost belongings through technology, community, and care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/how-to-use" className="block text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link to="/signup" className="block text-slate-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
                <Link to="/login" className="block text-slate-400 hover:text-white transition-colors">
                  Login
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="mailto:support@foundloss.com" className="block text-slate-400 hover:text-white transition-colors">
                  Contact Support
                </a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Found&Loss. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;