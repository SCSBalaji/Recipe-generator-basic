const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Generate a random session secret for development if not provided
const crypto = require('crypto');
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// Session configuration
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would typically save the user to database
    // For this workshop, we'll just use the profile directly
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null
    };
    return done(null, user);
  }
));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication Routes
// Google OAuth login - no prompt option to avoid re-asking for account after logout
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/error` : 'http://localhost:3000/error'
  }),
  (req, res) => {
    // Successful authentication, redirect to home
    res.redirect(process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/home` : 'http://localhost:3000/home');
  }
);

// Check authentication status
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Recipe Generation API Endpoint
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || ingredients.trim() === '') {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    // Check if Hugging Face token is configured
    if (!process.env.HUGGING_FACE_TOKEN) {
      // Return fallback dummy recipe for demo purposes
      return res.json({
        recipe: generateFallbackRecipe(ingredients),
        source: 'fallback'
      });
    }

    // Call Hugging Face API
    const response = await fetch('https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `ingredients: ${ingredients}`,
        parameters: {
          max_length: 512,
          num_return_sequences: 1
        }
      })
    });

    if (!response.ok) {
      // If API fails, return fallback recipe
      console.error('Hugging Face API error:', response.status);
      return res.json({
        recipe: generateFallbackRecipe(ingredients),
        source: 'fallback'
      });
    }

    const data = await response.json();
    
    // Parse the response from Hugging Face
    let recipeText = '';
    if (Array.isArray(data) && data.length > 0) {
      recipeText = data[0].generated_text || data[0];
    } else if (data.generated_text) {
      recipeText = data.generated_text;
    } else {
      recipeText = generateFallbackRecipe(ingredients);
    }

    res.json({
      recipe: recipeText,
      source: 'huggingface',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating recipe:', error);
    res.json({
      recipe: generateFallbackRecipe(req.body.ingredients),
      source: 'fallback',
      error: 'Using fallback recipe due to API error'
    });
  }
});

// Fallback recipe generator for demo purposes
function generateFallbackRecipe(ingredients) {
  const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
  
  const recipes = [
    {
      name: 'Quick Stir Fry',
      instructions: `1. Heat oil in a large pan or wok over high heat.
2. Add your ingredients (${ingredientList.join(', ')}) and stir-fry for 5-7 minutes.
3. Season with soy sauce, garlic, and ginger to taste.
4. Serve hot over rice or noodles.`
    },
    {
      name: 'Simple Soup',
      instructions: `1. Bring 4 cups of broth to a boil in a large pot.
2. Add chopped ${ingredientList.join(', ')}.
3. Simmer for 20-25 minutes until tender.
4. Season with salt, pepper, and herbs to taste.
5. Serve hot with crusty bread.`
    },
    {
      name: 'Easy Bake',
      instructions: `1. Preheat oven to 375°F (190°C).
2. Arrange ${ingredientList.join(', ')} in a baking dish.
3. Drizzle with olive oil and season with salt and pepper.
4. Bake for 25-30 minutes until golden and cooked through.
5. Let rest for 5 minutes before serving.`
    }
  ];

  const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  
  return `**${selectedRecipe.name}**\n\nIngredients: ${ingredientList.join(', ')}\n\n${selectedRecipe.instructions}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
