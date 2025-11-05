import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Eye,
  MessageCircle,
  Filter,
  Calendar,
  Package
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const BrowseFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);

  const categories = [
    'all', 'Electronics', 'Jewelry', 'Clothing', 'Bags & Wallets', 'Keys', 
    'Documents', 'Books', 'Toys', 'Sports Equipment', 'Accessories', 
    'Glasses/Sunglasses', 'Watches', 'Other'
  ];

  useEffect(() => {
    fetchFoundItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory]);

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items?type=found&limit=50`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching found items:', error);
      toast.error('Failed to load found items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  };

  const ItemCard = ({ item }) => (
    <Card className="item-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="status-found">Found</span>
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
              View Details
            </Button>
          </Link>
          <Link to={`/item/${item.id}`} className="flex-1">
            <Button size="sm" className="btn-primary w-full">
              <MessageCircle size={14} className="mr-1" />
              Contact Owner
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
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
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
          Browse Found Items
        </h1>
        <p className="text-slate-600">
          Found something that belongs to you? Contact the finder directly.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="text-emerald-600" size={20} />
          <h3 className="font-semibold text-slate-900">Filter Items</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Search by item name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="form-input">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-slate-600">
          {filteredItems.length} found item{filteredItems.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search size={64} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No found items match your search</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search criteria or check back later</p>
          <Link to="/post-found">
            <Button className="btn-primary">
              Post a Found Item
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BrowseFound;