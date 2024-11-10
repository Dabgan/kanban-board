'use client';

import { useContext } from 'react';

import { ColumnsContext } from '@/context/columns-context';
import type { ColumnsContextType } from '@/context/columns-context';

export const useColumns = (): ColumnsContextType => {
    const context = useContext(ColumnsContext);
    if (!context) {
        throw new Error('useColumns must be used within ColumnsProvider');
    }
    return context;
};
