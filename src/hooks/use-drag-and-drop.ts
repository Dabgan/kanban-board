import { type DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useCards } from '@/hooks/use-cards';
import { useColumns } from '@/hooks/use-columns';
import type { ColumnDragResult, DragResult } from '@/types/dnd';
import { reorderCards, reorderColumns } from '@/utils/reordering-utils';

export const useDragAndDrop = () => {
    const {
        state: { cards },
        batchUpdateCards,
    } = useCards();

    const {
        state: { columns },
        batchUpdateColumns,
    } = useColumns();

    const handleDragEnd = useCallback(
        async (dropResult: DropResult) => {
            if (!dropResult.destination) return;

            try {
                if (dropResult.type === 'COLUMN') {
                    const columnDragResult: ColumnDragResult = {
                        sourceIndex: dropResult.source.index,
                        destinationIndex: dropResult.destination.index,
                        draggedColumnId: dropResult.draggableId,
                    };

                    const reorderedColumns = reorderColumns(
                        columns,
                        columnDragResult.sourceIndex,
                        columnDragResult.destinationIndex,
                    );

                    await batchUpdateColumns(reorderedColumns);
                } else {
                    const dragResult: DragResult = {
                        sourceColumnId: dropResult.source.droppableId,
                        sourceIndex: dropResult.source.index,
                        destinationColumnId: dropResult.destination.droppableId,
                        destinationIndex: dropResult.destination.index,
                        draggedCardId: dropResult.draggableId,
                    };

                    const reorderedCards = reorderCards(cards, dragResult);
                    await batchUpdateCards(reorderedCards);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to reorder items';
                toast.error(errorMessage);
            }
        },
        [cards, columns, batchUpdateCards, batchUpdateColumns],
    );

    return {
        handleDragEnd,
        cards,
        columns,
    };
};
