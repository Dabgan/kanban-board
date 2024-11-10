'use client';

import { createContext, useContext } from 'react';

import type { InitialData, InitialDataContextType } from '@/types/initial-data';

const InitialDataContext = createContext<InitialDataContextType | null>(null);

type InitialDataProviderProps = {
    initialData: InitialData;
    children: React.ReactNode;
};

export const InitialDataProvider = ({ initialData, children }: InitialDataProviderProps) => {
    return (
        <InitialDataContext.Provider
            value={{
                initialData,
                isLoading: false,
                error: null,
            }}
        >
            {children}
        </InitialDataContext.Provider>
    );
};

export const useInitialData = (): InitialDataContextType => {
    const context = useContext(InitialDataContext);
    if (!context) {
        throw new Error('useInitialData must be used within InitialDataProvider');
    }
    return context;
};
