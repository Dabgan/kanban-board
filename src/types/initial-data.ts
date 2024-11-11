import type { Card } from './card';
import type { Column } from './column';

export type InitialData = {
    columns: Column[];
    cards: Card[];
};

export type InitialDataContextType = {
    initialData: InitialData;
    isLoading: boolean;
    error: string | null;
};
