import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import {
  MapPin,
  Camera,
  Mail,
  Phone,
  CheckCircle,
  ArrowLeft,
  Search,
  Package,
  Palette,
  FileText,
  Navigation,
  AlertCircle,
  Calendar
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const PostLost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '',
    location: '',
    latitude: null,
    longitude: null,
    contact_email: '',
    contact_phone: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Bags & Wallets', 'Keys', 
    'Documents', 'Books', 'Toys', 'Sports Equipment', 'Accessories', 
    'Glasses/Sunglasses', 'Watches', 'Other'
  ];

  const colors = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 
    'Purple', 'Pink', 'Brown', 'Gray', 'Silver', 'Gold', 'Multicolor'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          location: `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
        }));
        setUseCurrentLocation(true);
        setLocationLoading(false);
        toast.success('Current location added successfully');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationLoading(false);
        toast.error('Unable to get current location. Please enter manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.color) newErrors.color = 'Color is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Contact phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        type: 'lost'
      };

      await axios.post(`${API_URL}/items`, submitData);
      
      toast.success('Lost item reported successfully! We\'ll notify you if someone finds and posts your item.');
      navigate('/my-items');
    } catch (error) {
      console.error('Error posting item:', error);
      toast.error(error.response?.data?.detail || 'Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Search className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Report Lost Item</h1>
          </div>
          <p className="text-slate-600">
            Help us help you find your lost item by providing detailed information
          </p>
        </div>

        {/* Search Reminder Card */}
        <Card className="glass-card mb-6 border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Did you search first?</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Before posting, check if someone already found your item:
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/browse-found')}
                    className="text-xs"
                  >
                    <Search size={14} className="mr-1" />
                    Browse Found Items
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="text-amber-600" size={20} />
              <span>Lost Item Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="form-label">
                  <FileText size={16} className="inline mr-2" />
                  What did you lose? *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g., Black iPhone 13 with blue case"
                  data-testid="lost-title-input"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category & Color Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="form-label">
                    <Package size={16} className="inline mr-2" />
                    Category *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className={`form-input ${errors.category ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label className="form-label">
                    <Palette size={16} className="inline mr-2" />
                    Primary Color *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('color', value)}>
                    <SelectTrigger className={`form-input ${errors.color ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full bg-${color.toLowerCase()}-500`}></div>
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="form-label">
                  <FileText size={16} className="inline mr-2" />
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-input min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe your item in detail: brand, model, size, unique features, damages, engravings, etc."
                  data-testid="lost-description-input"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-sm text-slate-500 mt-1">
                  Tip: Include unique identifying features that only the true owner would know
                </p>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="form-label">
                  <MapPin size={16} className="inline mr-2" />
                  Where did you last have it? *
                </Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`form-input flex-1 ${errors.location ? 'border-red-500' : ''}`}
                      placeholder="e.g., Coffee shop on Main Street, University library"
                      data-testid="lost-location-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="px-4"
                    >
                      {locationLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      ) : (
                        <Navigation size={16} />
                      )}
                    </Button>
                  </div>
                  {useCurrentLocation && (
                    <p className="text-sm text-emerald-600 flex items-center">
                      <CheckCircle size={14} className="mr-1" />
                      Current location added
                    </p>
                  )}
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  <p className="text-sm text-slate-500">
                    Include nearby landmarks or the area where you think you lost it
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Mail size={18} className="mr-2 text-amber-600" />
                  Your Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email" className="form-label">
                      <Mail size={16} className="inline mr-2" />
                      Email Address *
                    </Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      className={`form-input ${errors.contact_email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                      data-testid="lost-email-input"
                    />
                    {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contact_phone" className="form-label">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className={`form-input ${errors.contact_phone ? 'border-red-500' : ''}`}
                      placeholder="+1 (555) 123-4567"
                      data-testid="lost-phone-input"
                    />
                    {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
                  </div>
                </div>
              </div>

              {/* Image Upload (Optional) */}
              <div>
                <Label htmlFor="image_url" className="form-label">
                  <Camera size={16} className="inline mr-2" />
                  Image URL (Optional - if you have a photo)
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-slate-500 mt-1">
                  If you have a photo of the item, upload it to a service like Imgur and paste the URL here
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                  data-testid="post-lost-submit-btn"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </div>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Report Lost Item
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="glass-card mt-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-amber-600" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">What happens next?</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Your lost item will be posted publicly for people to see</li>
                  <li>• Anyone who finds your item can contact you directly</li>
                  <li>• You'll receive notifications via email when someone contacts you</li>
                  <li>• Keep checking the found items section regularly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostLost;