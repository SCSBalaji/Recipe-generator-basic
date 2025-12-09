import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeInput from './RecipeInput';
import RecipeDisplay from './RecipeDisplay';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Verify user authentication on component mount
    const verifyAuth = async () => {
      try {
        const response = await fetch('/auth/user', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
        } else {
          // Not authenticated, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        navigate('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        // Clear local state and redirect to login
        setUser(null);
        setRecipes([]);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGenerateRecipe = async (ingredients) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ ingredients })
      });

      const data = await response.json();
      
      if (data.recipe) {
        // Add new recipe to the beginning of the list
        const newRecipe = {
          id: Date.now(),
          ingredients: ingredients,
          content: data.recipe,
          timestamp: data.timestamp || new Date().toISOString(),
          source: data.source
        };
        
        setRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      // Add error message as a recipe card
      const errorRecipe = {
        id: Date.now(),
        ingredients: ingredients,
        content: 'Sorry, there was an error generating the recipe. Please try again.',
        timestamp: new Date().toISOString(),
        source: 'error'
      };
      setRecipes(prevRecipes => [errorRecipe, ...prevRecipes]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="home-container">
        <div className="loading-recipes" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div className="spinner-large"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="welcome-message">
          👋 Welcome, <span>{user?.displayName || 'User'}</span>!
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <main className="home-content">
        <RecipeInput 
          onGenerateRecipe={handleGenerateRecipe} 
          loading={loading} 
        />
        <RecipeDisplay 
          recipes={recipes} 
          loading={loading} 
        />
      </main>
    </div>
  );
};

export default Home;
