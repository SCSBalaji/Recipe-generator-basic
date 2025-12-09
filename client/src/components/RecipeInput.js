import React, { useState } from 'react';

const RecipeInput = ({ onGenerateRecipe, loading }) => {
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (ingredients.trim() && !loading) {
      onGenerateRecipe(ingredients);
      // Clear input after submission
      setIngredients('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="recipe-input-container">
      <h2>🥗 Enter Your Ingredients</h2>
      <p>List the ingredients you have available, separated by commas or new lines.</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="ingredients-input"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., chicken, rice, tomatoes, garlic, onions, olive oil..."
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !ingredients.trim()}
        >
          {loading ? (
            <span className="loading-indicator">
              <span className="spinner"></span>
              Generating Recipe...
            </span>
          ) : (
            '🍽️ Generate Recipe'
          )}
        </button>
      </form>
    </div>
  );
};

export default RecipeInput;
