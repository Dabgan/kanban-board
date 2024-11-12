import { type DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useCards } from '@/hooks/use-cards';
import type { DragResult } from '@/types/dnd';
import { reorderCards } from '@/utils/reordering-utils';

export const useDragAndDrop = () => {
    const {
        state: { cards },
        batchUpdateCards,
    } = useCards();

    const handleDragEnd = useCallback(
        async (dropResult: DropResult) => {
            if (!dropResult.destination) return;

            try {
                const dragResult: DragResult = {
                    sourceColumnId: dropResult.source.droppableId,
                    sourceIndex: dropResult.source.index,
                    destinationColumnId: dropResult.destination.droppableId,
                    destinationIndex: dropResult.destination.index,
                    draggedCardId: dropResult.draggableId,
                };

                const reorderedCards = reorderCards(cards, dragResult);
                await batchUpdateCards(reorderedCards);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to move card';
                toast.error(errorMessage);
            }
        },
        [cards, batchUpdateCards],
    );

    return {
        handleDragEnd,
        cards,
    };
};
