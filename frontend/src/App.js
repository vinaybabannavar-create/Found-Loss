import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "@/App.css";

// Import all pages
import Landing from "@/pages/Landing";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import HowToUse from "@/pages/HowToUse";
import PostFound from "@/pages/PostFound";
import PostLost from "@/pages/PostLost";
import BrowseFound from "@/pages/BrowseFound";
import BrowseLost from "@/pages/BrowseLost";
import ItemDetails from "@/pages/ItemDetails";
import MyItems from "@/pages/MyItems";
import Profile from "@/pages/Profile";
import Navigation from "@/components/Navigation";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

// Layout Component
const Layout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      {user && <Navigation />}
      <main className={user ? "pt-16" : ""}>
        {children}
      </main>
      <Toaster />
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <Landing />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/how-to-use" element={<HowToUse />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/post-found" element={
        <ProtectedRoute>
          <PostFound />
        </ProtectedRoute>
      } />
      <Route path="/post-lost" element={
        <ProtectedRoute>
          <PostLost />
        </ProtectedRoute>
      } />
      <Route path="/browse-found" element={
        <ProtectedRoute>
          <BrowseFound />
        </ProtectedRoute>
      } />
      <Route path="/browse-lost" element={
        <ProtectedRoute>
          <BrowseLost />
        </ProtectedRoute>
      } />
      <Route path="/item/:id" element={
        <ProtectedRoute>
          <ItemDetails />
        </ProtectedRoute>
      } />
      <Route path="/my-items" element={
        <ProtectedRoute>
          <MyItems />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;