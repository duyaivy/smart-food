# SmartFoodAI - Mobile App Overview

**Project:** SmartFoodAI  
**Type:** React Native / Expo Mobile Application  
**Focus:** Local-first, feature-rich, responsive for mobile, tablet, and web

---

## 1. Core Philosophy

- **Local-first:** Minimize network calls, store key data locally using `MMKV` / `AsyncStorage`.
- **Feature-first navigation:** Use stack or tab navigation per feature, each with its own layout.
- **Responsive Design:** All screens optimized for mobile, tablet, and small web screens.
- **Offline-first support:** Core features remain accessible without active internet.
- **Push Notifications & SSE:** Receive real-time updates and device events (smart scale, IoT).

---

## 2. Main Features

### 2.1 Home / Dashboard

- Overview for user’s daily schedule and suggested meals
- Visual summaries of fridge contents and recent meals
- Quick navigation to all major app sections

### 2.2 Smart Scale / IoT

- Connects to smart scales via backend
- Fetches real-time weight and heartbeat data
- Supports SSE and push notifications for instant updates

### 2.3 Discover Recipes

- Stores cooking recipes with detailed ingredient information (protein, carbs, fat, calories, etc.)
- Supports SSE from server to show predicted ingredients when the smart scale is connected
- Recipe search and categorization

### 2.4 Virtual Fridge

- Users can add raw ingredients
- Stores and organizes ingredients
- Tracks usage and quantity to assist in meal planning

### 2.5 Smart Recommendations

- Users input personal data: weight goals, TDEE, diet preferences
- Sends data to backend for AI-based meal recommendations
- Returns suggestions and pushes updates to user in-app

### 2.6 Cooking & History

- Users can cook suggested or custom meals
- Cooking history recorded by date
- Supports review of past meals and ingredients used
- Smart suggestions dynamically adjust based on user history

### 2.7 Authentication & Profile

- Sign up / login with Google OAuth2 supported
- Edit personal information
- Option to use app as guest with limited access
- Persistent local authentication using MMKV

---

## 3. Folder Structure

```txt
src/
├── api/
├── app/
│   ├── (stacks)/
│   │   ├── auth/
│   │   ├── cooking/
│   │   ├── discover/
│   │   ├── fridge/
│   │   ├── profile/
│   │   └── search/
│   ├── (tabs)/
│   │   ├── cooking/
│   │   ├── discover/
│   │   ├── fridge/
│   │   ├── profile/
│   │   ├── _layout.tsx
│   │   └── index.tsx
├── components/
│   ├── settings/
│   └── ui/
├── constants/
├── lib/
│   ├── auth/
│   ├── common/
│   ├── hooks/
│   └── i18n/
├── models/
├── schemas/
├── translations/
├── .env
├── app.config.ts
└── package.json
```

## 4. Libraries & Tech Stack

- **Core:** React Native 0.79, Expo SDK 53, React 19
- **State Management:** `zustand`, `react-query-kit`
- **Forms & Validation:** `react-hook-form`, `zod`
- **UI / Animations:** `ShadcnUI`, `Moti`, `TailwindCSS`, `NativeWind`
- **Media & Devices:** `Expo Camera`, `Expo Notifications`, `Expo File System`, `Expo Image`
- **Localization:** `i18next`, `react-i18next`
- **Storage:** `MMKV`, `AsyncStorage`
- **Networking:** `axios`, SSE, push notifications
- **Testing & Lint:** `jest`, `eslint`, `typescript`

## 5. Scripts / Commands

# Start development

```
pnpm start

# Prebuild for Expo
pnpm prebuild

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run web version
pnpm web

# Build for different environments
pnpm run build:development:ios
pnpm run build:development:android
pnpm run build:staging:ios
pnpm run build:staging:android
pnpm run build:production:ios
pnpm run build:production:android

# Linting
pnpm lint
pnpm type-check

# Expo doctor
pnpm doctor
```

## 6. Architecture Principles

1. **Local-first:** Minimize network calls; store key data locally using MMKV / AsyncStorage.
2. **Feature-first navigation:** Tabs or stack navigation per feature.
3. **Responsive Design:** All screens optimized for mobile, tablet, and small web.
4. **Separation of Concerns:**
   - `api/` → network API calls
   - `lib/hooks/` → custom hooks
   - `components/ui/` → reusable UI components
   - `translations/` → localization JSON files
5. **SSE & Push Notifications:** Receive real-time updates from backend.
6. **Smart Device Integration:** Connect and monitor smart scales and IoT devices.
7. **Offline Support:** Core features accessible offline; local cache used wherever possible.
8. **Type Safety & Validation:** TypeScript + Zod
9. **Localization & i18n:** Multi-language support with dynamic switching.
10. **Testing & CI:** Jest + linting + type checks for production stability.
