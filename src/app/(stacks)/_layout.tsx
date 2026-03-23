import { Stack } from 'expo-router';
import React from 'react';

/**
 * Root layout for all child (stack) screens.
 * Each domain sub-folder (`profile/`, `meal/`, etc.) has its own _layout.tsx
 * that configures the screen options for its routes.
 *
 * The tab bar is NOT rendered for any route inside this group.
 */
export default function StacksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
