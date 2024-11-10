import type { Column } from '@/types';
import type { ColumnsState } from '@/types/columns';

type ColumnsAction =
    | { type: 'SET_COLUMNS'; payload: Column[] }
    | { type: 'ADD_COLUMN'; payload: Column }
    | { type: 'UPDATE_COLUMN'; payload: Column }
    | { type: 'DELETE_COLUMN'; payload: string }
    | { type: 'SET_ERROR'; payload: string | null };

export const columnsReducer = (state: ColumnsState, action: ColumnsAction): ColumnsState => {
    switch (action.type) {
        case 'SET_COLUMNS':
            return {
                ...state,
                columns: action.payload,
                error: null,
            };

        case 'ADD_COLUMN':
            return {
                ...state,
                columns: [...state.columns, action.payload],
                error: null,
            };

        case 'UPDATE_COLUMN':
            return {
                ...state,
                columns: state.columns.map((existingColumn) =>
                    existingColumn.id === action.payload.id ? action.payload : existingColumn,
                ),
                error: null,
            };

        case 'DELETE_COLUMN':
            return {
                ...state,
                columns: state.columns.filter((column) => column.id !== action.payload),
                error: null,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};
