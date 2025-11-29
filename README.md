# MintyFlow

MintyFlow is a comprehensive, free, and ad-supported finance management app built with React Native (Expo Router) for iOS and Android. Track your finances, investments, life insurance policies, and more - all in one modern, beautiful interface.

## Features

### Core Financial Management
- **Income & Expenses Tracking** - Quick add transactions with category support
- **Multi-Wallet Support** - Personal, Shared, and Secret (encrypted) wallets
- **Budgets & Goals** - Set budgets and track savings goals with progress indicators
- **Bills & EMI Tracker** - Never miss a payment with automatic reminders
- **Multi-Currency Support** - Account-level currency with optional conversion

### Investment Management
- **Track All Investments** - FD, RD, SIP, Mutual Funds, ETFs, Commodities, and more
- **Real-time Valuation** - Monitor current value, gains, and losses
- **Maturity Tracking** - Get notified when investments mature
- **Document Attachments** - Store investment documents securely

### Life Insurance
- **Policy Management** - Track all life insurance policies in one place
- **Premium Reminders** - Never miss a premium payment
- **Coverage Overview** - View total coverage across all policies
- **Nominee Management** - Store beneficiary information securely

### Advanced Features
- **Real-time Sync** - Firebase Realtime Database for instant sync across devices
- **Offline First** - SQLite local storage for offline access
- **Family Sharing** - Shared wallets for family collaboration
- **Biometric Security** - Face ID / Touch ID support
- **Dark Mode** - Beautiful light and dark themes
- **Split Bills** - Track shared expenses with friends and family
- **Push Notifications** - Reminders for bills, premiums, and important events

## Tech Stack

- **Framework**: React Native with Expo Router
- **Backend**: Firebase (Authentication, Realtime Database, Storage)
- **Offline Storage**: SQLite
- **Authentication**: Google Sign-In, Apple Sign-In
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Animations**: Lottie, Reanimated
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MintyFlow.git
   cd MintyFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase and authentication credentials:
   - Firebase configuration from [Firebase Console](https://console.firebase.google.com)
   - Google Sign-In credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Apple Sign-In configured in [Apple Developer Console](https://developer.apple.com)

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Add iOS and Android apps to your project

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable Google and Apple sign-in providers

3. **Set up Realtime Database**
   - Navigate to Realtime Database
   - Create a database in test mode
   - Update security rules as needed

4. **Configure Storage**
   - Navigate to Storage
   - Set up storage for document uploads
   - Configure security rules

5. **Get Configuration**
   - Copy your Firebase configuration
   - Add it to your `.env` file

## Google Sign-In Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add the credentials to `.env`:
   - Web Client ID
   - Android Client ID
   - iOS Client ID

## Apple Sign-In Setup (iOS only)

1. Go to [Apple Developer Console](https://developer.apple.com)
2. Register your app identifier
3. Enable "Sign In with Apple" capability
4. Configure in `app.json` (already done)

## Running the App

### Development Mode

```bash
# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on web
npx expo start --web
```

### Building for Production

#### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

## Project Structure

```
MintyFlow/
├── app/                      # App screens (Expo Router)
│   ├── (tabs)/              # Main tab navigation
│   │   ├── index.tsx        # Dashboard
│   │   ├── transactions.tsx # Transactions list
│   │   ├── add.tsx          # Add transaction
│   │   ├── investments.tsx  # Investments
│   │   └── profile.tsx      # User profile
│   ├── auth.tsx             # Authentication screen
│   ├── onboarding.tsx       # Onboarding carousel
│   └── _layout.tsx          # Root layout with providers
├── components/              # Reusable components
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── ThemeContext.tsx     # Theme management
├── services/                # Business logic
│   ├── auth/               # Authentication service
│   ├── firebase/           # Firebase services
│   └── notifications/      # Push notifications
├── lib/                     # Libraries and utilities
│   ├── database/           # SQLite database
│   └── storage/            # Local storage
├── types/                   # TypeScript type definitions
├── constants/              # App constants and configuration
├── utils/                   # Utility functions
└── config/                  # App configuration
    └── firebase.ts         # Firebase initialization
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Google Sign-In
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
```

## Key Features Implementation Status

- [x] Authentication (Google & Apple Sign-In)
- [x] Onboarding flow
- [x] Dashboard with statistics
- [x] Theme support (Light/Dark mode)
- [x] SQLite offline storage
- [x] Firebase integration
- [ ] Transaction CRUD operations
- [ ] Wallet management
- [ ] Budget tracking
- [ ] Goal tracking
- [ ] Bill & EMI reminders
- [ ] Investment tracking
- [ ] Life insurance management
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Document upload/storage
- [ ] Multi-currency support
- [ ] Split bills
- [ ] Analytics & reporting
- [ ] Data export (CSV/PDF)

## Security Features

- Google and Apple Sign-In only (no password storage)
- Biometric authentication (Face ID/Touch ID)
- Optional encrypted secret wallet
- Firebase Authentication
- Offline data encryption with SQLite

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mintyflow.com or open an issue on GitHub.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons from [Ionicons](https://ionic.io/ionicons)
- Firebase for backend services
- React Native community

---

Made with ❤️ by the MintyFlow Team
