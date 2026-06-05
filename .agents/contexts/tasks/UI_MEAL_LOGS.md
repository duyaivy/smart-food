You are working on the SmartFoodAI React Native / Expo project.

Your task is to build ONLY the UI for the Meal Log feature. Do not implement backend logic, API mutation, authentication logic, or real data fetching unless reusable mock/static data is needed for preview.

Follow the current project structure exactly:

- Screens must be placed under the correct feature-first route structure, preferably:
  - `src/app/(tabs)/cooking/meal-log.tsx`
  - or the existing cooking/history route if the project already has one.

- Reusable UI pieces should be placed in:
  - `src/components/ui/`
  - or `src/components/meal-log/` if this folder already exists.

- Use the existing styling system: NativeWind / TailwindCSS and current UI components.
- Keep the style consistent with the current overview: local-first, mobile-first, responsive, clean, modern, and feature-first.

MealLog data fields to support visually:

```ts
type MealLog = {
  id: number;
  userId: number;
  note?: string | null;
  dishId?: number | null;
  totalKcal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  customName?: string | null;
  isCustom: boolean;
  tag?: string | null;
  createdAt: string;
  eatenAt: string;
};
```

Design requirements:

Create a beautiful Meal Log screen with:

1. Header section
   - Title: “Meal Log”
   - Subtitle showing today’s eating summary
   - Add meal button
   - Optional date selector / calendar button

2. Daily nutrition summary card
   - Total calories
   - Protein, carbs, fat
   - Use clean visual indicators such as progress bars, small stat cards, or circular summary
   - Must look good on mobile and tablet

3. Meal type filter tabs
   - All
   - Breakfast
   - Lunch
   - Dinner
   - Snack
   - Active tab should be visually clear

4. Meal log list
   - Group meals by eaten date
   - Each meal item should show:
     - Meal name
       - If `isCustom === true`, use `customName`
       - Otherwise show “Recipe meal” or a dish placeholder

     - Meal type badge
     - Calories
     - Protein / carbs / fat
     - Eaten time
     - Note preview if available
     - Custom tag badge if `tag` exists

   - Design should support empty notes and missing dishId gracefully

5. Empty state
   - Friendly icon or illustration placeholder
   - Text: “No meals logged yet”
   - CTA button: “Add your first meal”

6. Offline/local-first UI state
   - Add a small “Saved locally” or “Offline ready” hint somewhere subtle
   - Do not overemphasize networking
   - UI should imply data can still be viewed without internet

7. Responsive behavior
   - On mobile: single-column list
   - On tablet / web small screen: summary cards can become grid layout
   - Avoid fixed widths that break layout

8. Visual style
   - Modern food/nutrition app style
   - Rounded cards
   - Soft shadows
   - Clear spacing
   - Friendly colors
   - Use icons where appropriate
   - Avoid clutter
   - Keep UX simple and clean

Important constraints:

- Only build UI.
- Do not change global architecture.
- Do not rewrite unrelated files.
- Do not break existing navigation.
- Do not introduce unnecessary new libraries.
- Use TypeScript.
- Use current project conventions.
- Use existing UI components where available.
- If mock data is needed, create it locally inside the screen or a small mock file.
- Make the UI production-quality and consistent with the SmartFoodAI overview.
- Run type-check/lint if available and fix UI-related issues only.

Expected result:

A polished Meal Log interface that fits naturally inside the SmartFoodAI Cooking / History feature and visually represents meal history, nutrition summary, custom meals, recipe meals, notes, tags, and offline-ready local-first behavior.
