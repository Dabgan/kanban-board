export type Column = {
    id: string;
    title: string;
    order: number;
    cardIds: string[];
};

export type ColumnsState = {
    columns: Column[];
    error: string | null;
};

export type ColumnsContextType = {
    state: ColumnsState;
    addColumn: (column: Omit<Column, 'order'>) => Promise<void>;
    updateColumn: (id: string, column: Column) => Promise<void>;
    deleteColumn: (id: string) => Promise<void>;
};

export type ColumnsAction =
    | { type: 'SET_COLUMNS'; payload: Column[] }
    | { type: 'ADD_COLUMN'; payload: Column }
    | { type: 'UPDATE_COLUMN'; payload: Column }
    | { type: 'DELETE_COLUMN'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };
