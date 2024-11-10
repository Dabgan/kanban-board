'use client';

import { useContext } from 'react';

import { LoadingContext } from '@/context/loading-context';
import type { LoadingContextType } from '@/types/loading';

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (context === null) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};
