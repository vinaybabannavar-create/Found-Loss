import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import {
  PlusCircle,
  Search,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  BarChart3,
  Users,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    foundItems: 0,
    lostItems: 0,
    myItems: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [myRecentItems, setMyRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all items for stats
      const [allItemsRes, myItemsRes] = await Promise.all([
        axios.get(`${API_URL}/items?limit=10`),
        axios.get(`${API_URL}/my-items`)
      ]);

      const allItems = allItemsRes.data;
      const myItems = myItemsRes.data;

      setStats({
        totalItems: allItems.length,
        foundItems: allItems.filter(item => item.type === 'found').length,
        lostItems: allItems.filter(item => item.type === 'lost').length,
        myItems: myItems.length
      });

      setRecentItems(allItems.slice(0, 6));
      setMyRecentItems(myItems.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card className="glass-card hover:scale-105 transition-transform duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={color} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ItemCard = ({ item, showOwner = false }) => (
    <Card className="item-card hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.type === 'found' ? 'status-found' : 'status-lost'
              }`}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center text-xs text-slate-500 space-x-3">
              <span className="flex items-center">
                <MapPin size={12} className="mr-1" />
                {item.location}
              </span>
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 bg-${item.color}-500`}></div>
                {item.color}
              </span>
            </div>
            {showOwner && (
              <p className="text-xs text-slate-500 mt-2">
                Posted by: {item.contact_email}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/item/${item.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              <Eye size={14} className="mr-1" />
              View
            </Button>
          </Link>
          {!showOwner && (
            <Link to={`/item/${item.id}`} className="flex-1">
              <Button size="sm" className="btn-primary w-full">
                <MessageCircle size={14} className="mr-1" />
                Contact
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="dashboard-loading">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="user-dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
          Welcome back, {user?.full_name}! 👋
        </h1>
        <p className="text-slate-600">
          Here's what's happening with lost and found items in your community
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={BarChart3}
          color="text-slate-600"
          description="All active posts"
        />
        <StatCard
          title="Found Items"
          value={stats.foundItems}
          icon={CheckCircle}
          color="text-emerald-600"
          description="Waiting for owners"
        />
        <StatCard
          title="Lost Items"
          value={stats.lostItems}
          icon={Search}
          color="text-amber-600"
          description="Looking for help"
        />
        <StatCard
          title="My Posts"
          value={stats.myItems}
          icon={Users}
          color="text-blue-600"
          description="Your contributions"
        />
      </div>

      {/* Quick Actions */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusCircle className="text-emerald-600" size={24} />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/post-found" className="group">
              <Button className="w-full btn-primary group-hover:scale-105 transition-transform" data-testid="post-found-btn">
                <PlusCircle size={18} className="mr-2" />
                Post Found Item
              </Button>
            </Link>
            <Link to="/post-lost" className="group">
              <Button variant="outline" className="w-full group-hover:scale-105 transition-transform" data-testid="post-lost-btn">
                <Search size={18} className="mr-2" />
                Report Lost Item
              </Button>
            </Link>
            <Link to="/browse-found" className="group">
              <Button variant="outline" className="w-full group-hover:scale-105 transition-transform">
                <Eye size={18} className="mr-2" />
                Browse Found
              </Button>
            </Link>
            <Link to="/browse-lost" className="group">
              <Button variant="outline" className="w-full group-hover:scale-105 transition-transform">
                <Search size={18} className="mr-2" />
                Browse Lost
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Community Items */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <TrendingUp className="text-emerald-600" size={20} />
                <span>Recent Community Posts</span>
              </span>
              <Link to="/browse-found">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <ItemCard key={item.id} item={item} showOwner={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Search size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No recent items found</p>
                <p className="text-sm">Be the first to post an item!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Items */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Calendar className="text-blue-600" size={20} />
                <span>My Recent Posts</span>
              </span>
              <Link to="/my-items">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myRecentItems.length > 0 ? (
              <div className="space-y-4">
                {myRecentItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <PlusCircle size={48} className="mx-auto mb-4 text-slate-300" />
                <p>You haven't posted any items yet</p>
                <div className="mt-4 space-x-2">
                  <Link to="/post-found">
                    <Button size="sm" className="btn-primary">Post Found Item</Button>
                  </Link>
                  <Link to="/post-lost">
                    <Button size="sm" variant="outline">Report Lost Item</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="glass-card mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">New to Found&Loss?</h3>
              <p className="text-slate-600">
                Learn how to make the most of our platform and help reunite people with their belongings.
              </p>
            </div>
            <Link to="/how-to-use">
              <Button variant="outline" className="btn-secondary">
                <Eye size={18} className="mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;