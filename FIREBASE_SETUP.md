# 🔥 Firebase Setup Guide

This guide will help you configure Firebase for the Presupuesto Familiar application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "presupuesto-familiar")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register your app with a nickname (e.g., "Presupuesto Familiar Web")
3. Do NOT check "Also set up Firebase Hosting" (unless you want to deploy)
4. Click **"Register app"**

## Step 3: Get Your Configuration

Firebase will show you a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**Copy this configuration!** You'll need it in the next step.

## Step 4: Configure the Application

1. Open the file `js/app.js` in your code editor
2. Find the `firebaseConfig` object (around line 3)
3. Replace the placeholder values with YOUR configuration from Step 3

```javascript
// BEFORE (placeholder)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    ...
};

// AFTER (your real config)
const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "presupuesto-familiar-123.firebaseapp.com",
    ...
};
```

## Step 5: Enable Authentication

1. In Firebase Console, go to **Authentication** in the left menu
2. Click **"Get started"**
3. Select **"Email/Password"** as the sign-in method
4. Enable the first option (Email/Password)
5. Click **"Save"**

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** in the left menu
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a Cloud Firestore location (preferably closest to your users)
5. Click **"Enable"**

## Step 7: Configure Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with the content from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /envelopes/{envelopeId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /goals/{goalId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test the Application

1. Start a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

2. Open your browser and navigate to `http://localhost:8000`

3. Try registering a new account

4. If everything works, you should:
   - Be able to register
   - See the mode selection screen
   - Access the dashboard
   - Create envelopes
   - Add transactions

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Double-check that you copied the correct API key from Firebase Console.

### Error: "Missing or insufficient permissions"
**Solution**: Make sure you published the Firestore security rules correctly.

### Error: "Firebase: Error (auth/operation-not-allowed)"
**Solution**: Enable Email/Password authentication in Firebase Console.

### Can't see data in Firestore
**Solution**: 
1. Make sure you're authenticated
2. Check the browser console for errors
3. Verify the security rules are published

## Production Deployment

When deploying to production:

1. **Change Firestore rules to production mode**:
   - Remove test mode expiration
   - Add more restrictive validation rules

2. **Enable app check** (optional but recommended):
   - Protects your app from abuse
   - Go to Firebase Console > App Check

3. **Set up custom domain** (if using Firebase Hosting):
   - Firebase Console > Hosting > Add custom domain

4. **Enable backup** (recommended):
   - Firestore > Backups

## Useful Commands

### Deploy to Firebase Hosting (optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in your project
firebase init

# Deploy
firebase deploy
```

## Cost Considerations

Firebase offers a generous free tier:

- **Authentication**: Free for all providers
- **Firestore**: 
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage

This is more than enough for personal use and small applications.

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

---

**Note**: Keep your Firebase configuration secure. Never commit sensitive credentials to public repositories.
