import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import {
  FileText,
  MapPin,
  Calendar,
  Eye,
  PlusCircle,
  CheckCircle,
  Package,
  Trash2,
  Edit3,
  MessageCircle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching my items:', error);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      await axios.put(`${API_URL}/items/${itemId}/status`, {
        status: newStatus
      });
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      
      const statusText = newStatus === 'resolved' ? 'resolved' : 'reactivated';
      toast.success(`Item ${statusText} successfully!`);
    } catch (error) {
      console.error('Error updating item status:', error);
      toast.error('Failed to update item status');
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  const ItemCard = ({ item }) => (
    <Card className="item-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.type === 'found' ? 'status-found' : 'status-lost'
              }`}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'resolved' ? 'status-resolved' : 'bg-green-100 text-green-800'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <span className="text-xs text-slate-500 flex items-center">
                <Calendar size={12} className="mr-1" />
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
                <Package size={12} className="mr-1" />
                {item.category}
              </span>
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 bg-slate-500`}></div>
                {item.color}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/item/${item.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              <Eye size={14} className="mr-1" />
              View
            </Button>
          </Link>
          
          {item.status === 'active' ? (
            <Button
              size="sm"
              onClick={() => updateItemStatus(item.id, 'resolved')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle size={14} className="mr-1" />
              Mark Resolved
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateItemStatus(item.id, 'active')}
            >
              Reactivate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {type === 'found' ? (
          <PlusCircle className="text-slate-400" size={24} />
        ) : (
          <FileText className="text-slate-400" size={24} />
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        No {type} items yet
      </h3>
      <p className="text-slate-500 mb-6">
        {type === 'found' 
          ? "You haven't posted any found items yet" 
          : "You haven't reported any lost items yet"
        }
      </p>
      <div className="space-x-2">
        <Link to="/post-found">
          <Button className="btn-primary">
            <PlusCircle size={16} className="mr-2" />
            Post Found Item
          </Button>
        </Link>
        <Link to="/post-lost">
          <Button variant="outline">
            <FileText size={16} className="mr-2" />
            Report Lost Item
          </Button>
        </Link>
      </div>
    </div>
  );

  const getTabCount = (type) => {
    if (type === 'all') return items.length;
    if (type === 'found') return items.filter(item => item.type === 'found').length;
    if (type === 'lost') return items.filter(item => item.type === 'lost').length;
    if (type === 'resolved') return items.filter(item => item.status === 'resolved').length;
    return 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="h-12 bg-slate-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            My Posted Items
          </h1>
          <p className="text-slate-600">
            Manage all your found and lost item posts
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/post-found">
            <Button className="btn-primary">
              <PlusCircle size={16} className="mr-2" />
              Post Found
            </Button>
          </Link>
          <Link to="/post-lost">
            <Button variant="outline">
              <FileText size={16} className="mr-2" />
              Report Lost
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{items.length}</div>
            <div className="text-sm text-slate-600">Total Items</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {items.filter(item => item.type === 'found').length}
            </div>
            <div className="text-sm text-slate-600">Found Items</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {items.filter(item => item.type === 'lost').length}
            </div>
            <div className="text-sm text-slate-600">Lost Items</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.status === 'resolved').length}
            </div>
            <div className="text-sm text-slate-600">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">
            All ({getTabCount('all')})
          </TabsTrigger>
          <TabsTrigger value="found">
            Found ({getTabCount('found')})
          </TabsTrigger>
          <TabsTrigger value="lost">
            Lost ({getTabCount('lost')})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({getTabCount('resolved')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState type="all" />
          )}
        </TabsContent>

        <TabsContent value="found">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState type="found" />
          )}
        </TabsContent>

        <TabsContent value="lost">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState type="lost" />
          )}
        </TabsContent>

        <TabsContent value="resolved">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={64} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No resolved items</h3>
              <p className="text-slate-500">Items you mark as resolved will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      {items.length > 0 && (
        <Card className="glass-card mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-blue-600" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Managing Your Posts</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Mark items as "Resolved" when you've successfully returned/recovered them</li>
                  <li>• Reactivate items if they become available again</li>
                  <li>• View details to see contact attempts and manage communications</li>
                  <li>• Keep your posts updated for the best results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyItems;