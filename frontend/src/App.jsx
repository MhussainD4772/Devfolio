import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase.js';
import { useEffect, useState } from 'react';
import EmailAuthModal from './EmailAuthModal';
import './App.css'
import './animations.css';

function App() {
  const [user, setUser] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // ADD THIS LINE TO TEST CONNECTION
  console.log('Supabase connected:', supabase);
  
  // Log user data when user changes
  useEffect(() => {
    if (user) {
      console.log('Current user data:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at
      });
    }
  }, [user]);

  // Handle GitHub OAuth sign in
  const handleGitHubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      alert('Error: ' + error.message);
    }
  };

  // Handle email sign in
  const handleEmailSignIn = async (email, password) => {
    try {
      console.log('Attempting signin with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      console.log('Signin response:', { data, error });
      
      if (error) throw error;
      
      console.log('Signin successful:', data.user);
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  // Handle email sign up
  const handleEmailSignUp = async (email, password) => {
    try {
      console.log('Attempting signup with:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            email_confirmed: true
          }
        }
      });
      
      console.log('Signup response:', { data, error });
      
      if (error) throw error;
      
      // Check if user was created successfully
      if (data.user) {
        console.log('User created:', data.user);
        alert('Account created successfully! You can now sign in.');
      } else {
        alert('Account created! Please sign in with your email and password.');
      }
      
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  // Add this function to handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add this useEffect to check user status
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Devfolio</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user.user_metadata?.full_name || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200/20 rounded-full blur-2xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 
              className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in"
            >
              Build Your
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Developer Portfolio
              </span>
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in stagger-1"
            >
              Create stunning portfolios that showcase your skills, projects, and experience. 
              Stand out to employers and land your dream job.
            </p>

            {user ? (
              // User is signed in
              <div 
                className="space-y-6 animate-fade-in stagger-2"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl max-w-md mx-auto">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">Account Verified</p>
                      <p className="text-green-600 text-sm">Ready to create your portfolio</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/create"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Portfolio
                </Link>
              </div>
            ) : (
              // User is not signed in
              <div 
                className="space-y-6 animate-fade-in stagger-2"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 shadow-xl max-w-lg mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h3>
                  <p className="text-gray-600 mb-6">Join thousands of developers building amazing portfolios</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleGitHubSignIn}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Continue with GitHub
                    </button>
                    
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      Continue with Email
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Authentication Modal */}
      <EmailAuthModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSignIn={handleEmailSignIn}
        onSignUp={handleEmailSignUp}
      />
    </div>
  );
}

export default App;