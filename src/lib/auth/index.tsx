import { type AuthState, type AuthStatus, useAuth } from './store';
import type { TokenType } from './utils';

export { useAuth };
export type { AuthState, AuthStatus, TokenType };

export const signOut = () => useAuth.getState().signOut();
export const signIn = (token: TokenType) => useAuth.getState().signIn(token);
export const hydrateAuth = () => useAuth.getState().hydrate();
