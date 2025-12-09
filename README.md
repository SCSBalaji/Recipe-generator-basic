# 🍳 Recipe Generator - MERN Stack Application

A full-stack web application that generates creative recipes using AI. Users can authenticate via Google OAuth, input their available ingredients, and receive AI-generated recipes using the Hugging Face API.

## 📋 Features

- **Google OAuth Authentication**: Secure login using Google account
- **Ingredient Input**: Enter available ingredients to generate recipes
- **AI Recipe Generation**: Powered by Hugging Face's recipe generation model
- **Responsive Design**: Works on desktop and mobile devices
- **Session Management**: Stay logged in across sessions

## 🏗️ Project Structure

```
recipe-generator/
├── server/                  # Express.js backend
│   ├── index.js            # Main server file with OAuth & API routes
│   ├── package.json        # Server dependencies
│   └── .env.example        # Environment variables template
│
└── client/                  # React frontend
    ├── public/
    │   └── index.html      # HTML template
    └── src/
        ├── components/
        │   ├── Login.js        # Login page with Google OAuth
        │   ├── Home.js         # Main page with recipe functionality
        │   ├── RecipeInput.js  # Ingredient input component
        │   ├── RecipeDisplay.js # Recipe display component
        │   └── Error.js        # Authentication error page
        ├── App.js              # Router setup
        ├── App.css             # Application styles
        └── index.js            # React entry point
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account
- Hugging Face account

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/recipe-generator.git
cd recipe-generator
```

### Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add the following:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:5000/auth/google/callback`
8. Copy the **Client ID** and **Client Secret**

### Step 3: Get Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to **Settings** > **Access Tokens**
4. Click **New token** and create a token with read access
5. Copy the generated token

### Step 4: Configure Environment Variables

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:
   ```env
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

   # Hugging Face API Token
   HUGGING_FACE_TOKEN=your_hugging_face_token_here

   # Session Secret (generate a random string)
   SESSION_SECRET=your_random_session_secret_key

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

### Step 5: Install Dependencies

**Install server dependencies:**
```bash
cd server
npm install
```

**Install client dependencies:**
```bash
cd ../client
npm install
```

### Step 6: Run the Application

**Start the server (from server directory):**
```bash
cd server
npm start
```
The server will run on http://localhost:5000

**Start the client (from client directory in a new terminal):**
```bash
cd client
npm start
```
The client will run on http://localhost:3000

### Step 7: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Login with Google"
3. Authenticate with your Google account
4. Enter ingredients and generate recipes!

## 🔧 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiates Google OAuth flow |
| GET | `/auth/google/callback` | OAuth callback handler |
| GET | `/auth/user` | Get current user info |
| GET | `/auth/logout` | Logout user |

### Recipe Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-recipe` | Generate recipe from ingredients |

**Request Body:**
```json
{
  "ingredients": "chicken, rice, tomatoes, garlic"
}
```

**Response:**
```json
{
  "recipe": "Generated recipe text...",
  "source": "huggingface",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🎨 Component Architecture

```
App.js (Router)
├── Login.js
│   └── Google OAuth button
├── Home.js
│   ├── Header (Welcome message + Logout)
│   ├── RecipeInput.js (props: onGenerateRecipe, loading)
│   └── RecipeDisplay.js (props: recipes, loading)
└── Error.js
    └── Error message + Back to login
```

### Props Communication

- **RecipeInput** receives `onGenerateRecipe` callback and `loading` state
- **RecipeDisplay** receives `recipes` array and `loading` state
- Parent-to-child communication via props
- Child-to-parent communication via callbacks

## 🧪 Testing the Hugging Face API

Test the API directly using curl:

```bash
curl -X POST "https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "ingredients: chicken, rice, tomatoes", "parameters": {"max_length": 512}}'
```

## 🐛 Troubleshooting

### CORS Issues
- Ensure the server is running on port 5000
- Check that `CLIENT_URL` matches your React app URL
- The client's `package.json` has a proxy setting for development

### OAuth Not Working
- Verify your Google Cloud Console credentials
- Check that redirect URIs match exactly
- Ensure OAuth consent screen is configured

### Recipe Generation Fails
- Verify your Hugging Face token is valid
- Check the Hugging Face API status
- The app will use fallback recipes if the API fails

### Session Issues
- Clear browser cookies
- Ensure `SESSION_SECRET` is set
- Check that cookies are enabled in your browser

## 📚 Technologies Used

- **Frontend**: React 18, React Router 6
- **Backend**: Express.js, Node.js
- **Authentication**: Passport.js, Google OAuth 2.0
- **AI**: Hugging Face Inference API
- **Session Management**: express-session

## 🎯 Learning Objectives

This project demonstrates:
- ✅ React Hooks (useState, useEffect)
- ✅ Component architecture and props
- ✅ React Router navigation
- ✅ Express.js REST API
- ✅ OAuth 2.0 authentication flow
- ✅ External API integration
- ✅ Error handling
- ✅ Responsive CSS design

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!