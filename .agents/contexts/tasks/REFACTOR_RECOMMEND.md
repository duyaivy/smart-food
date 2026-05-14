Please continue refactoring the Recommend feature.

Before making any changes, carefully read and strictly follow these files:

.agents/OVERVIEW.md
.agents/tasks/RECOMMENDATION.md
.agents/tasks/REFACTOR_RECOMMEND.md
.agents/skills/vercel-react-native-skills/AGENTS.md
.agents/skills/vercel-react-native-skills/SKILL.md

Also follow all relevant rules inside:

.agents/skills/vercel-react-native-skills/rules/

Treat the `.agents` directory as mandatory engineering guidelines. Do not ignore these rules.

General constraints:

- Preserve existing behavior unless the task explicitly asks for changes.
- Follow the existing project architecture and naming convention.
- Use clear, semantic, and consistent naming.
- Split UI into `_components` when needed.
- Keep screen files focused on composition.
- Move reusable logic into hooks, utils, constants, schemas, or types when appropriate.
- Remove unused imports, variables, components, hooks, libraries, and dead code.
- Avoid unnecessary re-renders.
- Avoid inline objects and inline functions inside render where possible.
- Use stable callbacks and derived values.
- Keep React Native performance best practices in mind.
- Do not use arbitrary JIT values unless there is no suitable design-system utility.

Tasks:

1. Replace broken state-based UI switching with Tabs

- Install and use the React Native Reusables Tabs component:

```bash
pnpm dlx @react-native-reusables/cli@latest add tabs
```

- Use this Tabs UI library instead of manually managing state for rendering UI sections such as:
  - `{/* Meal Structure */}`
  - `planDays`
  - any similar selectable UI section that currently changes value and immediately causes validation errors.

- The current behavior is broken: when selecting a different value, validation errors appear immediately.
- Refactor this flow so selection is handled by Tabs cleanly and does not trigger premature validation errors.
- Make sure Tabs values are typed properly.
- Use semantic names for tab values and handlers.
- Avoid names like `value`, `data`, `item` when a more meaningful name exists.

Example naming style:

- `selectedMealStructure`
- `selectedPlanDays`
- `handleMealStructureChange`
- `handlePlanDaysChange`

2. Refactor JIT mode / arbitrary class names in Recommend UI files

- Review all Recommend UI files.
- Replace unnecessary arbitrary Tailwind/JIT classes with standard utilities.

Examples:

- Replace `text-[11px]` with `text-xs` or `text-sm` where appropriate.
- Replace overly specific spacing, radius, width, height, or font sizes with design-system-friendly values when possible.

- Keep arbitrary values only when truly necessary.
- Maintain visual consistency and responsiveness.
- Do not randomly change layout or visual hierarchy.

3. Update `<GoalCard />` border behavior

- In `<GoalCard />`, keep a border width value at all times to avoid layout shift.
- The default/inactive border color should be transparent.
- When the card is active/selected, change only the border color.
- Do not change the card size when active.
- Use existing colors from `color.js` if available.
- If the active border color is reused and not defined yet, add a semantic color token to `color.js`.

Use clear prop names such as:

- `isActive`
- `onPress`
- `goal`

- Avoid ambiguous names.

4. Add progressive text reveal effect for `{/* Avocado Intro */}`

- In the Avocado Intro section, update the `<Text />` content so it does not appear all at once.
- Add a progressive reveal animation effect, such as:
  - typewriter effect
  - character-by-character reveal
  - or smooth text reveal

- The effect should feel lightweight and mobile-friendly.
- Avoid heavy animation logic.
- Avoid unnecessary re-renders.
- Clean up timers/effects properly.

- Extract the effect into a reusable component if appropriate, for example:
  - `_components/TypewriterText.tsx`
  - `_components/ProgressiveText.tsx`

Use clear props:

- `text`
- `speed`
- `delay`
- `className`

- The component must be safe for React Native and should not leak timers.
- Keep the text wrapped properly in React Native `<Text>` components.

5. Validation behavior

- Ensure changing Tabs values does not immediately show validation errors unless the user has actually submitted or interacted in a way that should show errors.
- Keep Vietnamese validation messages for user-facing errors.
- Do not remove existing Zod validation.
- Adjust form state integration carefully if needed.

6. Final checks
   After completing the changes:

- Verify no unused imports remain.
- Verify selecting Tabs does not immediately trigger validation errors.
- Verify GoalCard active/inactive border behavior.
- Verify Avocado Intro text reveal animation works correctly.

Final response:

- List the files changed.
- Explain what was refactored.
- Mention the Tabs integration.
- Mention JIT class cleanup.
- Mention GoalCard border behavior.
- Mention Avocado Intro text animation.
- Mention any checks that were run.
