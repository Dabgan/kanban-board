import type { Column } from '@/types';

export type ColumnsState = {
    columns: Column[];
    isLoading: boolean;
    error: string | null;
};

export type ColumnsAction =
    | { type: 'SET_COLUMNS'; payload: Column[] }
    | { type: 'ADD_COLUMN'; payload: Column }
    | { type: 'UPDATE_COLUMN'; payload: Column }
    | { type: 'DELETE_COLUMN'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };
