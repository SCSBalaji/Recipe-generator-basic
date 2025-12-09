import React from 'react';

const RecipeDisplay = ({ recipes, loading }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="recipe-display-container">
        <h2>📖 Generated Recipes</h2>
        <div className="loading-recipes">
          <div className="spinner-large"></div>
          <p>Creating a delicious recipe for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-display-container">
      <h2>📖 Generated Recipes</h2>
      
      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <p>No recipes generated yet.</p>
          <p>Enter your ingredients and click "Generate Recipe" to get started!</p>
        </div>
      ) : (
        <div className="recipes-list">
          {loading && (
            <div className="recipe-card" style={{ opacity: 0.6 }}>
              <div className="loading-indicator" style={{ justifyContent: 'flex-start' }}>
                <span className="spinner"></span>
                <span>Generating new recipe...</span>
              </div>
            </div>
          )}
          
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>Recipe for: {recipe.ingredients}</h3>
              <p className="recipe-timestamp">
                🕐 {formatTimestamp(recipe.timestamp)}
                {recipe.source === 'huggingface' && ' • 🤖 AI Generated'}
                {recipe.source === 'fallback' && ' • 📝 Demo Recipe'}
              </p>
              <div className="recipe-content">
                {recipe.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeDisplay;
