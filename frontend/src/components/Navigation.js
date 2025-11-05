import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  PlusCircle,
  Search,
  Menu,
  User,
  LogOut,
  FileText,
  Eye,
  HelpCircle
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/post-found', label: 'Post Found', icon: PlusCircle },
    { path: '/post-lost', label: 'Post Lost', icon: PlusCircle },
    { path: '/browse-found', label: 'Browse Found', icon: Search },
    { path: '/browse-lost', label: 'Browse Lost', icon: Search },
    { path: '/my-items', label: 'My Items', icon: FileText },
    { path: '/how-to-use', label: 'How to Use', icon: HelpCircle },
  ];

  const NavLink = ({ item, mobile = false, onClick = () => {} }) => {
    const IconComponent = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`
          flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }
          ${mobile ? 'w-full' : ''}
        `}
      >
        <IconComponent size={20} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={16} />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">
              Found&Loss
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.full_name || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-6">
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user?.full_name}</p>
                        <p className="text-sm text-slate-600">{user?.email}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          item={item}
                          mobile={true}
                          onClick={() => setIsOpen(false)}
                        />
                      ))}
                    </div>

                    {/* Profile & Logout */}
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                      >
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;