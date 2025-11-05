import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
  Package,
  Palette,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactMethod, setContactMethod] = useState('');
  const [message, setMessage] = useState('');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/items/${id}`);
      setItem(response.data);
      
      // Set default message based on item type
      if (response.data.type === 'found') {
        setMessage(`Hi! I believe this ${response.data.title} might be mine. I lost it around ${response.data.location}. Could we arrange to meet so I can claim it? Thank you so much for finding it!`);
      } else {
        setMessage(`Hi! I found your ${response.data.title} near ${response.data.location}. I have it safe with me. Please let me know how we can arrange for you to get it back!`);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast.error('Failed to load item details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!contactMethod) {
      toast.error('Please select a contact method');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setContacting(true);
    try {
      const response = await axios.post(`${API_URL}/contact-owner`, {
        item_id: item.id,
        contact_method: contactMethod,
        message: message
      });

      if (response.data.success) {
        const contactInfo = response.data.contact_info;
        
        // Handle different contact methods
        if (contactMethod === 'email') {
          const emailUrl = `mailto:${contactInfo.email}?subject=Regarding ${item.type} item: ${item.title}&body=${encodeURIComponent(message)}`;
          window.open(emailUrl, '_blank');
          toast.success('Email client opened! Please send the email.');
        } else if (contactMethod === 'whatsapp') {
          const whatsappUrl = `https://wa.me/${contactInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          toast.success('WhatsApp opened! Please send the message.');
        } else if (contactMethod === 'sms') {
          const smsUrl = `sms:${contactInfo.phone}?body=${encodeURIComponent(message)}`;
          window.open(smsUrl, '_blank');
          toast.success('SMS client opened! Please send the message.');
        }
        
        setIsContactDialogOpen(false);
      }
    } catch (error) {
      console.error('Error contacting owner:', error);
      toast.error('Failed to initiate contact. Please try again.');
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Item not found</h1>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-display font-bold text-slate-900">
                    {item.title}
                  </CardTitle>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    item.type === 'found' ? 'status-found' : 'status-lost'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image */}
                {item.image_url && (
                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <FileText className="mr-2 text-slate-600" size={18} />
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                        <Package className="mr-2 text-slate-600" size={16} />
                        Category
                      </h4>
                      <p className="text-slate-600">{item.category}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                        <Palette className="mr-2 text-slate-600" size={16} />
                        Color
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full bg-slate-500 border border-slate-300`}></div>
                        <span className="text-slate-600">{item.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                        <MapPin className="mr-2 text-slate-600" size={16} />
                        Location
                      </h4>
                      <p className="text-slate-600">{item.location}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                        <Calendar className="mr-2 text-slate-600" size={16} />
                        Date Posted
                      </h4>
                      <p className="text-slate-600">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="text-emerald-600" size={20} />
                  <span>Contact {item.type === 'found' ? 'Finder' : 'Owner'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">
                  {item.type === 'found' 
                    ? 'This item was found and is waiting to be claimed by its owner.'
                    : 'The owner is looking for this lost item.'}
                </p>

                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className={`w-full ${item.type === 'found' ? 'btn-primary' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'}`}>
                      <MessageCircle className="mr-2" size={16} />
                      {item.type === 'found' ? 'Contact Finder' : 'I Found This!'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Contact {item.type === 'found' ? 'Finder' : 'Owner'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="form-label">
                          Choose contact method *
                        </Label>
                        <Select value={contactMethod} onValueChange={setContactMethod}>
                          <SelectTrigger className="form-input">
                            <SelectValue placeholder="Select how to contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center space-x-2">
                                <Mail size={16} />
                                <span>Email</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="whatsapp">
                              <div className="flex items-center space-x-2">
                                <MessageCircle size={16} />
                                <span>WhatsApp</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="sms">
                              <div className="flex items-center space-x-2">
                                <Phone size={16} />
                                <span>SMS/Text</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="form-label">
                          Your message *
                        </Label>
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="form-input min-h-[120px]"
                          placeholder="Write your message..."
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsContactDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleContact}
                          disabled={contacting}
                          className="flex-1 btn-primary"
                        >
                          {contacting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Contacting...
                            </div>
                          ) : (
                            <>
                              <Send size={16} className="mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Mail size={14} />
                      <span>{item.contact_email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone size={14} />
                      <span>{item.contact_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    💡 <strong>Tip:</strong> Meet in a safe, public location when exchanging items. 
                    Verify ownership before completing the handover.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Similar Items */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Related Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    to={item.type === 'found' ? '/browse-lost' : '/browse-found'}
                    className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Browse {item.type === 'found' ? 'Lost' : 'Found'} Items
                  </Link>
                  <Link
                    to={`/browse-${item.type}?category=${item.category}`}
                    className="text-slate-600 hover:text-slate-800 text-sm flex items-center"
                  >
                    <Package size={14} className="mr-1" />
                    More in {item.category}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;