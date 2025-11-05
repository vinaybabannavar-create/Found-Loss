import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Settings,
  Bell,
  Trash2,
  Save,
  Edit3
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically update the user profile via API
      // For now, we'll just show a success message
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            {user?.full_name}
          </h1>
          <p className="text-slate-600">Manage your Found&Loss profile and settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="text-emerald-600" size={20} />
                    <span>Profile Information</span>
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 size={14} className="mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="full_name" className="form-label">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="form-label">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="form-label">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                {/* Account Created */}
                <div>
                  <Label className="form-label">
                    <Calendar size={16} className="inline mr-2" />
                    Member Since
                  </Label>
                  <p className="text-slate-600 mt-1">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="text-slate-600" size={20} />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info('Notification settings coming soon!')}
                >
                  <Bell size={16} className="mr-2" />
                  Notification Preferences
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info('Privacy settings coming soon!')}
                >
                  <Shield size={16} className="mr-2" />
                  Privacy & Security
                </Button>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => toast.info('Account deletion requires contacting support')}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Items Posted</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Items Resolved</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">People Helped</span>
                  <span className="font-semibold">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600 mb-3">
                    Have questions or need assistance? We're here to help!
                  </p>
                  <a
                    href="mailto:support@foundloss.com"
                    className="text-emerald-600 hover:text-emerald-700 block"
                  >
                    📧 Contact Support
                  </a>
                  <a
                    href="/how-to-use"
                    className="text-emerald-600 hover:text-emerald-700 block"
                  >
                    📖 How to Use Guide
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;