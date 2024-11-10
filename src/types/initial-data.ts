import type { Card, Column } from '@/types';

export type InitialData = {
    columns: Column[];
    cards: Card[];
};

export type InitialDataContextType = {
    initialData: InitialData;
    isLoading: boolean;
    error: string | null;
};
