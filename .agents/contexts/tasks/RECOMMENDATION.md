# Prompt for AI: SmartFoodAI Smart Recommendation UI

## Objective

Build the React Native interface for the **Smart Recommendation** feature in SmartFoodAI. The interface should follow the attached reference images and the existing React Native code structure.

---

## Functional Requirements

1. **Two UI states:**
   - **Before suggestions are available:** Show a friendly placeholder indicating that the system is calculating recommendations. Include a loading animation, visual feedback, or “thinking” indicators for user engagement.
   - **After suggestions are available:** Display the recommended meal plan with detailed nutritional info for each meal (breakfast, lunch, dinner) and each day in the plan.

2. **Data Flow & Behavior:**
   - User submits a recommendation request via the app.
   - The app posts to `POST {{base_url}}/recommendations/` and receives a `jobId`.
   - Display the "waiting for suggestion" UI while the recommendation is being processed.
   - Listen for a push notification or server-sent event indicating the recommendation is ready.
   - Fetch the final recommendation data using `GET /recommendations/:jobId` if the job is completed.
   - Store the `jobId` locally to handle cases where the user exits the app and returns later.
   - Ensure seamless handling of updates without memory leaks or unnecessary re-renders.

3. **Data Schema Example:**

```ts
interface MealStructure {
  breakfast: { mainDish: number; soup: number; vegetable: number };
  lunch: { mainDish: number; soup: number; vegetable: number };
  dinner: { mainDish: number; soup: number; vegetable: number };
}

interface RecommendationInput {
  planDays: number;
  startDate: string; // ISO date string
  mealStructure: MealStructure;
  goal: { targetKg: number };
}

interface Meal {
  name: string;
  type: 'mainDish' | 'soup' | 'vegetable';
  calories: number;
  protein: number;
  fat: number;
  carb: number;
}

interface DailyPlan {
  day: number;
  date: string;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
  };
  nutrition: {
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalCarb: number;
  };
}

interface RecommendationOutput {
  jobId: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  input: RecommendationInput;
  output: {
    plan: DailyPlan[];
    shoppingList: { quantity: string; ingredient: string }[];
  };
}
```

## UI Guidelines

- Follow the reference images provided.
- Use **ShadcnUI** and **Moti** for smooth animations.
- Use **FlashList** for meal list performance.
- Responsive for **mobile, tablet**.
- Show **total nutrition summary per day**.
- Allow **expanding/collapsing meals** for details (protein, carb, fat, calories).
- Include a **submit button** for requesting new suggestions.
- Highlight visually when a suggestion is **loading vs ready**.

---

## Architecture & Code Structure

- **Local-first:** Cache `jobId` and results using **MMKV / AsyncStorage / zustand**.
- **Navigation:** Use **stack or tab navigation** for recommendation screens.
- **Push notification:** Integrate using existing backend notification system.

---

## Performance Considerations

- **Prevent memory leaks:** Clean up listeners/subscriptions when component unmounts.
- **Minimize unnecessary renders:** Memoize meal items and nutrition summary components.
- Use **placeholder skeletons or animations** during async fetch.

---

## Deliverables

1. **RecommendationRequestScreen.tsx**
   - Form to submit user data (`planDays`, `startDate`, `mealStructure`, `goal`)
   - Loading / waiting UI

2. **RecommendationResultScreen.tsx**
   - Display **daily plan**, **nutrition**, and **shopping list**
   - Responsive layout for multiple screen sizes

3. **Supporting components**
   - `MealCard`, `DailySummary`, `LoadingPlaceholder`, `ExpandableMealList`

4. **Integration with backend**
   - `POST` request to create job
   - `GET` request to retrieve completed recommendation
   - Push notification subscription for job status updates

## Applicable Skills for Smart Recommendation UI

### Core Rendering (CRITICAL)

- `rendering-text-in-text-component.md` - Wrap strings in Text components
- `rendering-no-falsy-and.md` - Avoid falsy && operator in JSX

### List Performance (HIGH)

- `list-performance-virtualize.md` - Use virtualized lists (FlashList) for daily meal plans
- `list-performance-function-references.md` - Keep stable object references
- `list-performance-callbacks.md` - Hoist callbacks to list root
- `list-performance-inline-objects.md` - Avoid inline objects in renderItem
- `list-performance-item-memo.md` - Pass primitives for memoization
- `list-performance-item-expensive.md` - Keep list items lightweight
- `list-performance-images.md` - Use compressed images in lists
- `list-performance-item-types.md` - Use item types for heterogeneous lists

### Animation (HIGH)

- `animation-gpu-properties.md` - Animate transform/opacity instead of layout
- `animation-gesture-detector-press.md` - Use GestureDetector for press animations
- `animation-derived-value.md` - Prefer useDerivedValue over useAnimatedReaction

### Scroll Performance (HIGH)

- `scroll-position-no-state.md` - Never track scroll in useState

### Navigation (HIGH)

- `navigation-native-navigators.md` - Use native stack and native tabs

### React State (MEDIUM)

- `react-state-dispatcher.md` - Use functional setState updates
- `react-state-fallback.md` - State should represent user intent only
- `react-state-minimize.md` - Minimize state variables, derive values

### State Architecture (MEDIUM)

- `state-ground-truth.md` - State must represent ground truth

### User Interface (MEDIUM)

- `ui-expo-image.md` - Use expo-image for optimized images
- `ui-native-modals.md` - Use native Modal with formSheet
- `ui-pressable.md` - Use Pressable instead of TouchableOpacity
- `ui-measure-views.md` - Measuring view dimensions
- `ui-safe-area-scroll.md` - Use contentInsetAdjustmentBehavior
- `ui-scrollview-content-inset.md` - Use contentInset for dynamic spacing
- `ui-styling.md` - Modern styling patterns (gap, boxShadow, gradients)

### Design System (MEDIUM)

- `design-system-compound-components.md` - Use compound components
