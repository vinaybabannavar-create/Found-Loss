import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Search,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back to Found&Loss!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 flex items-center justify-center p-4">
      <div className="gradient-mesh absolute inset-0"></div>
      
      <div className="glass-card w-full max-w-md p-8 animate-fade-up relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Found&Loss</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome Back!</h2>
          <p className="text-slate-600">Sign in to continue finding what's lost</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
              data-testid="login-email-input"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="form-label">
              <Lock size={16} className="inline mr-2" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                data-testid="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg"
            data-testid="login-submit-btn"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <LogIn className="mr-2" size={18} />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600 mb-2 font-semibold">Demo Account (Optional):</p>
          <div className="text-xs text-slate-600 space-y-1">
            <p><strong>Email:</strong> demo@foundloss.com</p>
            <p><strong>Password:</strong> demo123</p>
            <p className="text-xs text-slate-500 mt-2">Use these credentials to explore the platform</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center">
          <Link
            to="/how-to-use"
            className="text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Learn how Found&Loss works
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;