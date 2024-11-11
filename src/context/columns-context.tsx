'use client';

import { createContext, useCallback, useReducer } from 'react';
import { toast } from 'react-hot-toast';

import { useLoading } from '@/hooks/use-loading';
import { columnsReducer } from '@/reducers/columns-reducer';
import { apiClient } from '@/services/api-client';
import type { Column, ColumnsContextType } from '@/types/column';

export const ColumnsContext = createContext<ColumnsContextType | null>(null);

type ColumnsProviderProps = {
    children: React.ReactNode;
    initialColumns: Column[];
};

export const ColumnsProvider = ({ children, initialColumns }: ColumnsProviderProps) => {
    const [state, dispatch] = useReducer(columnsReducer, {
        columns: initialColumns,
        error: null,
    });

    const { setGlobalLoading } = useLoading();

    const addColumn = useCallback(
        async (column: Omit<Column, 'order'>) => {
            setGlobalLoading(true);
            try {
                const optimisticColumn: Column = {
                    ...column,
                    order: state.columns.length + 1,
                };
                dispatch({ type: 'ADD_COLUMN', payload: optimisticColumn });

                const response = await apiClient.columns.create(column);

                if (response.error ?? !response.data) {
                    dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                    toast.error(response.error?.message ?? 'Failed to create column');
                    return;
                }

                const updatedColumns = state.columns.filter((existingColumn) => existingColumn.id !== column.id);
                dispatch({ type: 'SET_COLUMNS', payload: [...updatedColumns, response.data] });
                toast.success('Column created successfully');
            } catch (error) {
                dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                toast.error('Failed to create column');
            } finally {
                setGlobalLoading(false);
            }
        },
        [state.columns, setGlobalLoading],
    );

    const updateColumn = useCallback(
        async (id: string, column: Column) => {
            setGlobalLoading(true);
            try {
                const previousColumns = state.columns;
                dispatch({ type: 'UPDATE_COLUMN', payload: column });

                const response = await apiClient.columns.update(id, column);

                if (response.error ?? !response.data) {
                    dispatch({ type: 'SET_COLUMNS', payload: previousColumns });
                    toast.error(response.error?.message ?? 'Failed to update column');
                    return;
                }

                toast.success('Column updated successfully');
            } catch (error) {
                dispatch({ type: 'SET_COLUMNS', payload: state.columns });
                toast.error('Failed to update column');
            } finally {
                setGlobalLoading(false);
            }
        },
        [state.columns, setGlobalLoading],
    );

    const deleteColumn = useCallback(
        async (id: string) => {
            setGlobalLoading(true);
            try {
                const response = await apiClient.columns.delete(id);

                if (response.error) {
                    toast.error(response.error.message);
                    return;
                }

                dispatch({ type: 'DELETE_COLUMN', payload: id });
                toast.success('Column deleted successfully');
            } catch (error) {
                toast.error('Failed to delete column');
            } finally {
                setGlobalLoading(false);
            }
        },
        [setGlobalLoading],
    );

    return (
        <ColumnsContext.Provider value={{ state, addColumn, updateColumn, deleteColumn }}>
            {children}
        </ColumnsContext.Provider>
    );
};
