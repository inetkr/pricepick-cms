'use client';

import { createContext } from 'react';

// import type { AuthContextValue } from '../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext<any | undefined>(undefined);

export const AuthConsumer = AuthContext.Consumer;
