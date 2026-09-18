# SmartFood AI 🥑

<p align="center">
  <img src="./assets/icon.png" alt="SmartFood AI Logo" width="120" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>Smart Fridge Management, IoT Smart Scale Integration & AI-Powered Personalized Nutrition Recommendation</strong>
</p>

<p align="center">
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-SDK%2053-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 53" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.79%20(New%20Arch)-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.79" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8" /></a>
  <a href="https://nativewind.dev"><img src="https://img.shields.io/badge/NativeWind-v4%20(Tailwind)-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind v4" /></a>
  <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/React%20Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query v5" /></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/Maintained%20with-pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" /></a>
</p>

---

## Badges

| Dimension | Status |
| :--- | :--- |
| **Mobile Core** | ![Expo](https://img.shields.io/badge/Expo-SDK%2053-blue?logo=expo) ![React Native](https://img.shields.io/badge/React%20Native-0.79-cyan?logo=react) ![Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-success) |
| **Code Quality** | ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript) ![ESLint](https://img.shields.io/badge/ESLint-v9-4B32C3?logo=eslint) ![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?logo=prettier) |
| **CI / CD** | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automated%20CI-2088FF?logo=githubactions) ![EAS Build](https://img.shields.io/badge/EAS%20Build-Ready-black?logo=expo) |
| **Testing** | ![Jest](https://img.shields.io/badge/Unit%20Tests-Jest-C21325?logo=jest) ![Maestro](https://img.shields.io/badge/E2E-Maestro-000000) |

---

## Short Description

> **SmartFood AI** is an intelligent mobile ecosystem that fuses **IoT Smart Scale hardware** with **AI-driven meal planning** to digitize household refrigerator management, automate real-time ingredient weighing and macro recognition, track personalized nutrition, and generate zero-waste meal plans tailored to individual health goals.

---

## Overview

In modern fast-paced living, household food tracking and healthy meal planning face critical challenges:
- **Food Spoilage & Waste**: Forgotten items stored in refrigerators often expire and are discarded unnoticed.
- **Nutritional Inaccuracy**: Manually logging ingredients and estimating portion weights, calories, and macronutrients (Protein, Carbs, Fat) is tedious and error-prone.
- **Daily Meal Dilemma**: Planning balanced meals while maximizing existing ingredients without repetitive grocery store trips requires significant effort.

**SmartFood AI** delivers an end-to-end, connected solution through four core pillars:
1. **Smart Fridge Inventory**: Real-time pantry tracking categorized by food types, monitoring expiration dates with push notifications to achieve zero food waste.
2. **IoT Smart Scale Integration**: Seamless QR-code device pairing and real-time Server-Sent Events (SSE) streaming that receives weights and AI-predicted nutritional breakdowns instantly when placing ingredients on the scale.
3. **AI Meal Planner & Swap Engine**: Generates balanced daily and weekly meal plans (Breakfast, Lunch, Dinner with Main dish, Soup, and Side dish structure) optimized against current fridge supplies and user health metrics (BMR, TDEE, target weight).
4. **Intelligent Nutrition Dashboard**: Provides clear visibility into daily caloric intake, remaining calories, macronutrient distributions, and historical cooking logs.

---

## Features

### 🧊 1. Smart Refrigerator Management
- **Ingredient Inventory**: Categorizes items into meat, poultry, seafood, produce, dry goods, seasonings, and frozen goods.
- **Freshness & Expiry Monitoring**: Visual indicators (fresh, expiring soon, expired) paired with push notifications before foods spoil.
- **Automated Stock Synchronization**: Automatically deducts ingredient quantities when meals are cooked, or adds items scanned from the IoT scale.

### ⚖️ 2. IoT Smart Scale & Real-Time Scanning
- **Instant QR Pairing**: Pairs the mobile app with the physical smart scale using camera scanning (`Device UID` and `API Key`).
- **Server-Sent Events (SSE) Streaming**: Listens for live scale events without polling, streaming data the moment food touches the scale plate.
- **AI Classification & Nutrition Estimate**: Automatically recognizes ingredient identity (`predictedConfidence`), weight (`weight`), and macro values (Calories, Protein, Carbs, Fat).
- **1-Click Actions**: Easily persist weighed items directly into the fridge inventory or log them into the daily meal diary.

### 🤖 3. AI Meal Planning & Flexible Dish Swapping
- **Multi-Day Planning (1–7 Days)**: Synthesizes complete daily meal structures aligned with daily target caloric intake and nutritional targets.
- **Fridge-First Optimization**: Recommends recipes that prioritize ingredients nearing expiration in the refrigerator to eliminate waste.
- **Dynamic Dish Swapping (`Swap Dish`)**: Replace individual dishes with nutritionally equivalent alternatives without breaking daily dietary balance.
- **Automated Shopping List**: Pinpoints missing ingredients (`missingIngredients`) needed for upcoming planned meals.

### 📊 4. Nutrition Tracking & Meal History
- **Live Calorie Dashboard**: Tracks real-time calorie burn targets, consumed calories, and remaining intake budget for the day.
- **Macronutrient Breakdown**: Displays percentage and gram distributions of Proteins, Fats, and Carbohydrates against user TDEE.
- **Cooking & Meal Logs**: Chronological timeline of past meals prepared, recipes used, and logged nutritional values.
- **Profile & Health Goals**: Calculates personalized BMR and TDEE based on physical characteristics, activity levels, and weight targets.

### 🍲 5. Recipe & Dish Discovery
- **Comprehensive Recipe Library**: Step-by-step culinary instructions, prep and cook times, difficulty levels, and full nutritional breakdowns.
- **Smart Ingredient Matching**: Filter dishes based on what is currently stocked in the refrigerator.

---

## Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                             SmartFood AI                               │
├────────────────────────────────────────────────────────────────────────┤
│  Client (Mobile)         │ React Native 0.79 · Expo SDK 53 · Expo Router│
│  Styling & UI            │ NativeWind v4 · Tailwind CSS · RN Primitives │
│  State & Offline Storage │ Zustand v5 · React Native MMKV               │
│  Data Fetching & Cache   │ TanStack React Query v5 · Axios              │
│  IoT & Real-time         │ Server-Sent Events (SSE) · Expo Camera / QR  │
│  Forms & Validation      │ React Hook Form · Zod                        │
│  Testing & Code Quality  │ Jest · Maestro E2E · ESLint · Prettier       │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Libraries & Tools:
- **Mobile Framework**: [React Native 0.79](https://reactnative.dev/) with New Architecture enabled, built on [Expo SDK 53](https://docs.expo.dev/) with Custom Dev Client.
- **Routing & Navigation**: [Expo Router v5](https://docs.expo.dev/router/introduction/) (File-based routing, Typed routes, Deep linking).
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (TailwindCSS 3.4), `tailwind-variants`, CSS variables.
- **UI Components & Icons**: `@rn-primitives`, `@gorhom/bottom-sheet`, [Lucide Icons](https://lucide.dev/), [FlashList](https://shopify.github.io/flash-list/).
- **Animations & UX**: [React Native Reanimated v3](https://docs.swmansion.com/react-native-reanimated/), [Moti](https://moti.fyi/), edge-to-edge support, custom splash screen.
- **State Management**: [Zustand v5](https://github.com/pmndrs/zustand) backed by [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) for high-performance synchronous local persistence.
- **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query/v5) with optimistic updates, cache invalidation, and automated retry mechanisms.
- **IoT & Network**: [Axios](https://axios-http.com/), `react-native-sse` (Server-Sent Events) for real-time scale feeds, `expo-camera` & `expo-image-picker` for QR code pairing and image capture.
- **Internationalization**: [i18next](https://www.i18next.com/) with English and Vietnamese support.
- **Code Quality**: [ESLint v9](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/) + [Lint-Staged](https://github.com/okonet/lint-staged), [Commitlint](https://commitlint.js.org/).

---

## Architecture

The system coordinates interactions across physical IoT hardware, the mobile application client, backend cloud services, and the AI engine:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                               IOT HARDWARE                                  │
│   ┌──────────────────────────┐             ┌────────────────────────────┐   │
│   │ Smart Scale (Load Cell)  │             │   IoT Camera Sensor        │   │
│   │ - Weighs food/ingredient │             │   - Captures food imagery  │   │
│   └────────────┬─────────────┘             └─────────────┬──────────────┘   │
│                │                                         │                  │
│                └────────────────────┬────────────────────┘                  │
│                                     ▼                                       │
│                       ┌───────────────────────────┐                         │
│                       │ QR Code Pairing Identifier│                         │
│                       │ (Device UID & API Key)    │                         │
│                       └─────────────┬─────────────┘                         │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │ (1) QR Scan Pairing
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SMARTFOOD AI MOBILE APP (CLIENT)                          │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      UI Presentation Layer                          │   │
│   │        Expo Router v5 (Tabs & Stacks) · NativeWind v4 (Tailwind)    │   │
│   └───────────────────▲─────────────────────────────▲───────────────────┘   │
│                       │                             │                       │
│   ┌───────────────────▼─────────────────────────────▼───────────────────┐   │
│   │                      State & Data Management                        │   │
│   │          Zustand Stores  ◄──────────────►  MMKV Local Storage       │   │
│   │          TanStack Query  ◄──────────────►  Query Cache / Retry      │   │
│   └───────────────────▲─────────────────────────────▲───────────────────┘   │
│                       │                             │                       │
│        (4) Live SSE   │                             │ (2) REST API Requests │
│            Stream In  │                             │     (JWT Auth)        │
│   ┌───────────────────┴──────────────┐     ┌────────┴───────────────────┐   │
│   │    SSE Client (react-native-sse) │     │    Axios HTTP Client       │   │
│   └───────────────────▲──────────────┘     └────────┬───────────────────┘   │
└───────────────────────┼─────────────────────────────┼───────────────────────┘
                        │                             │
                        │ Real-time Stream            │ HTTPS REST API
                        │                             ▼
┌───────────────────────┴─────────────────────────────────────────────────────┐
│                       BACKEND CLOUD SERVICES                                │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         API Gateway                                 │   │
│   │              Authentication · Rate Limiting · Routing               │   │
│   └───────────────────▲─────────────────────────────┬───────────────────┘   │
│                       │                             │                       │
│   ┌───────────────────┴──────────────┐     ┌────────┴───────────────────┐   │
│   │     IoT Device Gateway           │     │ Core Business Services     │   │
│   │   - Manages device streams       │     │ - Fridge & Inventory       │   │
│   │   - Dispatches SSE live events   │     │ - Meals & Nutrition Logs   │   │
│   └───────────────────▲──────────────┘     └────────┬───────────────────┘   │
└───────────────────────┼─────────────────────────────┼───────────────────────┘
                        │                             │
                        │ Inferences                  │ Data Queries
                        ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI & INTELLIGENCE ENGINE                             │
│                                                                             │
│   ┌──────────────────────────────┐       ┌──────────────────────────────┐   │
│   │  Computer Vision Model       │       │  AI Meal Recommender         │   │
│   │  - Food item classification  │       │  - TDEE/Calorie optimization │   │
│   │  - Confidence scoring        │       │  - Zero-waste fridge-first   │   │
│   │  - Weight & macro estimation │       │  - Flexible dish swap engine │   │
│   └──────────────────────────────┘       └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### End-to-End Data Flow:
1. **Device Pairing**: The user scans the physical scale's QR code using `expo-camera`, registering the `deviceUid` and `apiKey` to their profile.
2. **Real-time Weighing & Identification**: When an ingredient is placed on the scale, the sensor sends readings and images to the AI Vision model, which classifies the food item and calculates nutritional macros (Calories, Protein, Carbs, Fat).
3. **Live SSE Streaming**: The backend pushes the live scan result via Server-Sent Events (`react-native-sse`) straight to the app without client polling.
4. **Pantry Sync & Meal Recommendation**: The user saves items to their fridge with one tap. The AI Meal Recommender analyzes available fridge ingredients and user health targets (BMR/TDEE) to generate personalized zero-waste meal plans.

---

## Project Structure

The project follows a modular, feature-oriented structure aligned with Expo Router conventions:

```text
smart-food/
├── .agents/                 # AI subagent instructions and skill definitions
├── .github/
│   └── workflows/           # CI/CD workflows (EAS builds, tests, linting, releases)
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── assets/                  # App icons, splash screens, custom fonts (Be Vietnam Pro)
├── scripts/                 # Utility scripts for builds and validation
├── src/
│   ├── api/                 # API client layer (Axios instances, endpoints, types)
│   │   ├── auth.api.ts          # Authentication, OTP, passwords
│   │   ├── common/              # Axios configuration & interceptors
│   │   ├── dish.api.ts          # Recipes, cooking guides
│   │   ├── fridge.api.ts        # Refrigerator inventory endpoints
│   │   ├── ingredient.api.ts    # Ingredient catalog
│   │   ├── iot.api.ts           # IoT device pairing & stream URL retrieval
│   │   ├── meal.api.ts          # Meal history & meal log tracking
│   │   ├── nutrition.api.ts     # Daily/weekly nutrition analytics
│   │   ├── recommendation.api.ts# AI recommendation & dish swapping
│   │   └── user.api.ts          # User profiles & physical metrics
│   ├── app/                 # Expo Router file-based screens
│   │   ├── (stacks)/            # Stack navigation flows
│   │   │   ├── auth/            # Sign in, sign up, verify OTP, reset password
│   │   │   ├── discover/        # Dish details, ingredient instructions
│   │   │   ├── fridge/          # Ingredient detail and pantry modification
│   │   │   ├── profile/         # Settings, cooking history, IoT QR pairing
│   │   │   └── search/          # Global search screen
│   │   ├── (tabs)/              # Bottom tab navigation screens
│   │   │   ├── index.tsx        # Home screen (Daily nutrition overview)
│   │   │   ├── fridge/          # Smart fridge inventory tab
│   │   │   ├── discover/        # Dish & recipe discovery tab
│   │   │   ├── recommendation/  # AI meal recommendation tab
│   │   │   └── profile/         # User profile tab
│   │   ├── _layout.tsx          # Root provider hierarchy (Theme, QueryClient, Auth)
│   │   └── onboarding.tsx       # First-launch onboarding flow
│   ├── components/          # Modular UI components
│   │   ├── ui/                  # Atomic primitives (Button, Input, Card, Modal...)
│   │   └── ...                  # Feature-specific components
│   ├── constants/           # Color palettes, theme tokens, query keys, route paths
│   ├── lib/                 # Core utilities, stores, and custom hooks
│   │   ├── auth/                # Auth tokens, storage, session handlers
│   │   ├── hooks/               # Custom hooks, React Query hooks (queries, mutations)
│   │   ├── stores/              # Zustand global stores (fridge, iot, meal plan...)
│   │   └── utils/               # Formatters, date calculation, validation helpers
│   ├── models/              # TypeScript interfaces (IoT, Nutrition, Dish, User)
│   ├── schemas/             # Zod validation schemas for forms
│   └── translations/        # Multi-language localization dictionaries (.json)
├── app.config.ts            # Dynamic Expo configuration (multi-environment, plugins)
├── env.js                   # Zod-powered environment variable parser & validator
├── package.json             # Dependencies and project scripts
├── tailwind.config.js       # NativeWind / Tailwind CSS design tokens
└── tsconfig.json            # TypeScript compiler configuration
```

---

## Getting Started

### 📋 Prerequisites
- **Node.js**: LTS version `>= 20.x`
- **Package Manager**: [pnpm](https://pnpm.io/) `>= 9.x` *(Enforced via `npx only-allow pnpm`)*
- **Git**: Installed and configured
- **Mobile Development Environment**:
  - **Android**: Android Studio with Android SDK (API 34+), `ANDROID_HOME` configured, physical device with USB debugging or an emulator.
  - **iOS** *(macOS only)*: Xcode 16+, CocoaPods, iOS Simulator.
- **Watchman** *(macOS / Linux)*: Highly recommended (`brew install watchman`).

---

### 🚀 Installation & Running

#### 1. Clone the repository
```bash
git clone https://github.com/duyaivy/smart-food.git
cd smart-food
```

#### 2. Install dependencies
```bash
pnpm install
```

#### 3. Configure environment variables
Copy the development environment file:
```bash
cp .env.development .env
```
*(Update `API_URL` to your backend server address or local IP).*

#### 4. Run the development server

- **Start Metro Bundler**:
  ```bash
  pnpm start
  ```

- **Run on Android**:
  ```bash
  pnpm android
  ```

- **Run on iOS** *(macOS)*:
  ```bash
  pnpm ios
  ```

#### 5. Code Quality & Verification
```bash
# Run all checks (Linting + Type-check + Translation syntax + Tests)
pnpm check-all

# TypeScript verification
pnpm type-check

# ESLint verification
pnpm lint
```

---

## Environment Variables

The project enforces environment validation using **Zod** in `env.js`. Variables are split into two distinct execution tiers:

1. **Client Variables** (`_clientEnv`): Accessible within application source code (`src/`) via `import Env from '@env'`.
2. **Build-Time Variables** (`_buildTimeEnv`): Used exclusively during Expo build and configuration (`app.config.ts`, EAS Build).

### Variable Reference:

| Variable Name | Type | Target | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `APP_ENV` | `enum` | Client | Runtime environment (`development`, `staging`, `production`) | `development` |
| `API_URL` | `string` | Client | Base URL pointing to the Backend REST / SSE API gateway | `http://192.168.1.13:3000/v1` |
| `NAME` | `string` | Client | App display name | `SmartFood AI` |
| `SCHEME` | `string` | Client | App URI scheme for deep linking | `smartfood` |
| `BUNDLE_ID` | `string` | Client | iOS Bundle Identifier | `com.smartfood` |
| `PACKAGE` | `string` | Client | Android Application Package Name | `com.duyaivy.smartfood` |
| `VERSION` | `string` | Client | Application version (synced from `package.json`) | `8.0.0` |
| `SECRET_KEY` | `string` | Build-time | Secret encryption key for build-time processes | `my-secret-key` |
| `EAS_PROJECT_ID`| `string` | Build-time | Expo Application Services Project ID | `fb89be3d-...` |
| `EXPO_ACCOUNT_OWNER`| `string`| Build-time | Expo account owner username | `duyaivy` |

> 💡 **Tip**: Switch environments cleanly using the designated scripts:
> - **Staging**: `pnpm start:staging` or `pnpm android:staging`
> - **Production**: `pnpm start:production` or `pnpm android:production`

---

<p align="center">
  Developed for <strong>PBL5 Project</strong> · Department of Information Technology, Da Nang University of Science and Technology (DUT).
</p>
