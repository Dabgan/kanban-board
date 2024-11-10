'use client';

import { createContext, useCallback, useState } from 'react';

import type { LoadingContextType, LoadingState } from '@/types/loading';

export const LoadingContext = createContext<LoadingContextType | null>(null);

type LoadingProviderProps = {
    children: React.ReactNode;
};

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [state, setState] = useState<LoadingState>({ isLoading: false });

    const setGlobalLoading = useCallback((isLoading: boolean) => {
        setState({ isLoading });
    }, []);

    const contextValue = {
        state,
        setGlobalLoading,
    };

    return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
};
