import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  PlusCircle,
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Users,
  Mail,
  Smartphone,
  Eye,
  Shield,
  Clock,
  Star,
  Camera,
  Phone
} from 'lucide-react';

const HowToUse = () => {
  const foundSteps = [
    {
      step: 1,
      icon: PlusCircle,
      title: 'Create Your Post',
      description: 'Sign up and create a detailed post about the item you found',
      details: [
        'Take clear photos of the item',
        'Provide detailed description including color, brand, size',
        'Add the exact location where you found it',
        'Include your contact information'
      ]
    },
    {
      step: 2,
      icon: MapPin,
      title: 'Add Location Details',
      description: 'Specify where you found the item with precise location',
      details: [
        'Use the location picker to mark exact spot',
        'Add landmarks or reference points',
        'Mention the date and time you found it',
        'Include any relevant circumstances'
      ]
    },
    {
      step: 3,
      icon: MessageCircle,
      title: 'Wait for Contact',
      description: 'The owner will contact you directly through the platform',
      details: [
        'You\'ll receive notifications when someone contacts you',
        'Verify ownership before returning the item',
        'Arrange a safe meeting place',
        'Mark the item as returned when complete'
      ]
    }
  ];

  const lostSteps = [
    {
      step: 1,
      icon: Search,
      title: 'Search Existing Posts',
      description: 'First, search through found items to see if someone already posted your item',
      details: [
        'Use filters by category, color, and location',
        'Check recent posts in your area',
        'Use keywords related to your item',
        'Set up search alerts for new posts'
      ]
    },
    {
      step: 2,
      icon: PlusCircle,
      title: 'Post Your Lost Item',
      description: 'If not found, create a detailed post about your lost item',
      details: [
        'Provide detailed description and photos if available',
        'Add the location where you last had it',
        'Include when you noticed it was missing',
        'Add your contact information'
      ]
    },
    {
      step: 3,
      icon: Users,
      title: 'Connect with Finders',
      description: 'People who found your item will contact you directly',
      details: [
        'Respond promptly to contact attempts',
        'Provide additional proof of ownership if needed',
        'Arrange a safe meeting location',
        'Thank the finder and mark item as found'
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Send detailed messages with photos and information',
      benefits: ['Detailed communication', 'Photo sharing', 'Paper trail']
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick messaging with instant notifications',
      benefits: ['Instant messaging', 'Voice notes', 'Real-time chat']
    },
    {
      icon: Phone,
      title: 'SMS/Text',
      description: 'Direct text messages to phone number',
      benefits: ['Universal access', 'No app required', 'Simple and direct']
    }
  ];

  const tips = [
    {
      icon: Camera,
      title: 'Take Quality Photos',
      description: 'Clear, well-lit photos help identify items faster'
    },
    {
      icon: MapPin,
      title: 'Be Specific with Locations',
      description: 'Exact locations help narrow down search areas'
    },
    {
      icon: Clock,
      title: 'Act Quickly',
      description: 'Post items as soon as possible for better chances'
    },
    {
      icon: Shield,
      title: 'Stay Safe',
      description: 'Meet in public places and verify ownership'
    },
    {
      icon: Star,
      title: 'Be Detailed',
      description: 'More details help legitimate owners prove ownership'
    },
    {
      icon: Users,
      title: 'Be Responsive',
      description: 'Quick responses lead to successful reunions'
    }
  ];

  const StepCard = ({ step, isLast = false }) => {
    const IconComponent = step.icon;
    return (
      <div className="relative">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {step.step}
            </div>
          </div>
          <div className="flex-1">
            <Card className="item-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <IconComponent className="text-emerald-600" size={24} />
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-slate-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {!isLast && (
          <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-600"></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">
            How Found&Loss Works
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Simple steps to reunite people with their lost belongings and help build a caring community
          </p>
        </div>

        {/* Process Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="found" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="found" className="text-lg py-3">
                <PlusCircle className="mr-2" size={20} />
                I Found Something
              </TabsTrigger>
              <TabsTrigger value="lost" className="text-lg py-3">
                <Search className="mr-2" size={20} />
                I Lost Something
              </TabsTrigger>
            </TabsList>

            <TabsContent value="found">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Found an Item? Here's How to Help</h2>
                  <p className="text-slate-600">Follow these steps to help reunite someone with their lost item</p>
                </div>
                {foundSteps.map((step, index) => (
                  <StepCard key={step.step} step={step} isLast={index === foundSteps.length - 1} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lost">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Lost Something? Let's Find It</h2>
                  <p className="text-slate-600">Follow these steps to increase your chances of recovery</p>
                </div>
                {lostSteps.map((step, index) => (
                  <StepCard key={step.step} step={step} isLast={index === lostSteps.length - 1} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Contact Methods */}
        <Card className="glass-card mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 text-center">
              How to Contact Item Owners
            </CardTitle>
            <p className="text-slate-600 text-center">
              Choose the best method to reach out and arrange item return
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <div key={index} className="text-center p-6 bg-white rounded-xl border border-slate-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{method.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{method.description}</p>
                    <div className="space-y-1">
                      {method.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center justify-center text-xs text-slate-500">
                          <CheckCircle size={12} className="text-emerald-500 mr-1" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="glass-card mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 text-center">
              Pro Tips for Success
            </CardTitle>
            <p className="text-slate-600 text-center">
              Best practices to maximize your chances of successful reunions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-slate-200">
                    <IconComponent className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-slate-600">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Start Helping?
            </h2>
            <p className="text-slate-600 mb-6">
              Join our community and start making a difference today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="btn-primary text-lg px-8 py-3">
                  <Users className="mr-2" size={20} />
                  Join Now
                </Button>
              </Link>
              <Link to="/browse-found">
                <Button variant="outline" className="btn-secondary text-lg px-8 py-3">
                  <Eye className="mr-2" size={20} />
                  Browse Items
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowToUse;