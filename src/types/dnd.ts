export type DragResult = {
    sourceColumnId: string;
    sourceIndex: number;
    destinationColumnId: string;
    destinationIndex: number;
    draggedCardId: string;
};

export type ColumnDragResult = {
    sourceIndex: number;
    destinationIndex: number;
    draggedColumnId: string;
};

export type DragType = 'CARD' | 'COLUMN';
