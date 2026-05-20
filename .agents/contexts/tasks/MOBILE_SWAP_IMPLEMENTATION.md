# Task: Implement Smart Recommendation Dish Swap in React Native App

## 1. Context & Objective

We have updated the backend to support fetching alternative candidates for dishes in a recommendation meal and performing batch swapping.
Your task is to implement this functionality in the Mobile React Native application. This involves adding the network requests, creating a native modal for selecting replacement dishes, displaying skeleton loaders, rendering optimized lists, and updating the local recommendation cache.

---

## 2. API Specifications

### 2.1 Fetch Replacement Candidates

- **Method**: `POST`
- **Path**: `/recommendations/sub-recommendation`
- **Request Body**:
  ```json
  {
    "jobId": number,
    "dishIds": number[]
  }
  ```
- **Response**: An array of candidate lists grouped by original dish ID:
  ```json
  [
    {
      "originalDishId": 2,
      "recommendations": [
        {
          "id": 12,
          "name": "Cá lóc kho tộ",
          "calories": 250,
          "type": "MAIN_DISH",
          "images": ["https://cdn.example.com/ca-loc.jpg"],
          "missingIngredients": [
            { "ingredientId": 5, "unit": "GAM", "quantity": 150 }
          ]
        }
      ]
    }
  }
  ```

### 2.2 Submit Dish Swaps

- **Method**: `PUT`
- **Path**: `/recommendations/:jobId`
- **Request Body**:
  ```json
  {
    "day": number,
    "meal": "BREAKFAST" | "LUNCH" | "DINNER",
    "swaps": [
      {
        "originalDishId": number,
        "dishId": number,
        "role": "MAIN_DISH" | "VEGETABLE" | "SOUP",
        "name": string,
        "calories": number,
        "images": string[],
        "missingIngredient": [
          { "ingredientId": number, "unit": string, "quantity": number }
        ]
      }
    ]
  }
  ```
- **Response**: Returns the updated Recommendation object.

---

## 3. UI/UX Flow & Requirements

Based on the current Smart Recommendation interface ("Gợi ý thông minh"):

1. **Trigger Button**:
   - On the main recommendation screen, under each meal (e.g., "Bữa trưa"), there is a button named **"Món khác"** (Other dishes).
   - Clicking "Món khác" should open a Modal.

2. **Modal View**:
   - **Native Modal**: Use a native-based modal (e.g., standard React Native Modal or Expo Router Stack modal) for maximum performance rather than JavaScript-based heavy bottom sheets (Ref: `AGENTS.md` Rule 9.8).
   - **Loading State**: Show a skeleton loader inside the modal while the `POST /recommendations/sub-recommendation` query is pending.
   - **Accordion Structure**:
     - Render each original dish currently in the meal as an accordion section.
     - Each section displays the original dish name and a chevron arrow (`lucide-react-native` or similar) to collapse/expand.
     - When expanded, it renders a list of the 5 replacement candidates.
   - **Candidate List Selection**:
     - Render the candidates using optimized list rendering (e.g., `FlashList` or `FlatList` with memoized render items, Ref: `AGENTS.md` Section 2).
     - Render dish thumbnails using `expo-image` (Ref: `AGENTS.md` Rule 9.5).
     - Show each candidate's name, calories, and missing ingredients.
     - The user can select exactly one candidate to replace the original dish. The selected candidate should be highlighted.
     - The user can select swaps for multiple dishes in the same meal concurrently (e.g. swap both Món mặn and Món canh).
   - **Action Buttons**:
     - At the bottom of the modal, show a **"Xác nhận đổi món"** (Confirm Swap) button.
     - When clicked, invoke the `PUT /recommendations/:jobId` API call using the accumulated swaps.
     - On success, close the modal, show a success toast, and update the React Query cache or trigger a refetch of the recommendation data.

---

## 4. Mobile Architecture Guidelines (`AGENTS.md` alignment)

When writing the code, ensure you strictly adhere to the following mobile coding rules:

- **Core Rendering**:
  - Never use `&&` with values that can be `0` or empty strings. Use explicit booleans (e.g., `!!missingIngredients.length && ...`) or ternaries to prevent runtime crashes (Ref: `AGENTS.md` Rule 1.1).
  - Wrap all text strings inside `<Text>` components (Ref: `AGENTS.md` Rule 1.2).
- **List Performance**:
  - Avoid inline object creations in `renderItem` (styles, props) to maintain stable references and avoid breaking memoization. Pass primitives where possible or reference hoisted styles (Ref: `AGENTS.md` Rule 2.1).
  - Hoist callbacks to the root of lists using `useCallback` (Ref: `AGENTS.md` Rule 2.2).
- **State Management**:
  - Use Zustand selectors or React Query cache instead of passing deep prop chains or heavy Context objects to avoid triggering massive tree re-renders (Ref: `AGENTS.md` Rule 2.3 & 2.4).
- **Interactive Elements**:
  - Use `<Pressable>` instead of `<TouchableOpacity>` or other touchables for smooth touch states (Ref: `AGENTS.md` Rule 9.9).

---

## 5. Step-by-Step Implementation Plan

### Step 1: Register API Hooks

- Add network calls inside `src/api/recommendation.api.ts`.
- Define React Query hooks for:
  - `useGetSubRecommendations` (`mutation` or `query` triggered on modal open).
  - `useUpdateRecommendation` (`mutation` to submit swaps).

### Step 2: Build the Swap Modal Component

- Implement the native modal container with slide animation.
- Use a local state array (`selectedSwaps`) to track the list of swaps:
  ```typescript
  type SwapItem = {
    originalDishId: number;
    dishId: number;
    role: string;
    name: string;
    calories: number;
    images: string[];
    missingIngredient: any[];
  };
  ```
- Implement the accordion layout. Map original dishes to accordion headers.
- Show skeleton loading items while candidates are being fetched.

### Step 3: Implement Candidate Items & List Optimization

- For the expanded candidate panel, use a list to show the 5 options.
- Apply `memo` to the item component if not using the React Compiler.
- Display thumbnails via `<Image>` from `expo-image`.
- Highlight the selected dish using class names via NativeWind (e.g., `border-primary` or background color).

### Step 4: Handle Form Submission & Cache Update

- In the submit handler, call the mutation.
- On success, use `queryClient.setQueryData` to update the active recommendation job state so the main screen updates instantly without loading indicators.
- Close the modal and show a brief feedback message.
