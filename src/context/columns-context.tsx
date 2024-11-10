'use client';

import { createContext, useCallback, useReducer } from 'react';
import { toast } from 'react-hot-toast';

import { columnsReducer } from '@/reducers/columns-reducer';
import { apiClient } from '@/services/api-client';
import type { Column } from '@/types';
import type { ColumnsState } from '@/types/columns';

export type ColumnsContextType = {
    state: ColumnsState;
    addColumn: (column: Omit<Column, 'order'>) => Promise<void>;
    updateColumn: (id: string, column: Column) => Promise<void>;
    deleteColumn: (id: string) => Promise<void>;
};

export const ColumnsContext = createContext<ColumnsContextType | null>(null);

type ColumnsProviderProps = {
    children: React.ReactNode;
    initialColumns: Column[];
};

export const ColumnsProvider = ({ children, initialColumns }: ColumnsProviderProps) => {
    const [state, dispatch] = useReducer(columnsReducer, {
        columns: initialColumns,
        isLoading: false,
        error: null,
    });

    const addColumn = useCallback(
        async (column: Omit<Column, 'order'>) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Optimistic update
                const optimisticColumn: Column = {
                    ...column,
                    order: state.columns.length + 1,
                };
                dispatch({ type: 'ADD_COLUMN', payload: optimisticColumn });

                const response = await apiClient.columns.create(column);

                if (response.error ?? !response.data) {
                    // Revert optimistic update if error or no data
                    dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                    toast.error(response.error?.message ?? 'Failed to create column');
                    return;
                }

                // Update with actual data from server
                const updatedColumns = state.columns.filter((col) => col.id !== column.id);
                dispatch({ type: 'SET_COLUMNS', payload: [...updatedColumns, response.data] });
                toast.success('Column created successfully');
            } catch (error) {
                // Revert optimistic update
                dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                toast.error('Failed to create column');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.columns],
    );

    const updateColumn = useCallback(
        async (id: string, column: Column) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Optimistic update
                dispatch({ type: 'UPDATE_COLUMN', payload: column });

                const response = await apiClient.columns.update(id, column);

                if (response.error) {
                    // Revert optimistic update
                    dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                    toast.error(response.error.message);
                    return;
                }

                toast.success('Column updated successfully');
            } catch (error) {
                // Revert optimistic update
                dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                toast.error('Failed to update column');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.columns],
    );

    const deleteColumn = useCallback(
        async (id: string) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Optimistic update
                const previousColumns = state.columns;
                dispatch({ type: 'DELETE_COLUMN', payload: id });

                const response = await apiClient.columns.delete(id);

                if (response.error) {
                    // Revert optimistic update
                    dispatch({ type: 'SET_COLUMNS', payload: previousColumns });
                    toast.error(response.error.message);
                    return;
                }

                toast.success('Column deleted successfully');
            } catch (error) {
                // Revert optimistic update
                dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                toast.error('Failed to delete column');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.columns],
    );

    return (
        <ColumnsContext.Provider value={{ state, addColumn, updateColumn, deleteColumn }}>
            {children}
        </ColumnsContext.Provider>
    );
};
