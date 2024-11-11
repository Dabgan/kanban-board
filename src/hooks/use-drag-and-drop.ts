import { type DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useCards } from '@/hooks/use-cards';
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
                const reorderedCards = reorderCards(
                    cards,
                    dropResult.source.droppableId,
                    dropResult.source.index,
                    dropResult.destination.droppableId,
                    dropResult.destination.index,
                );

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
