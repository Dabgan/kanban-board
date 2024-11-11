import { useCallback } from 'react';

import { useCards } from '@/hooks/use-cards';
import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column } from '@/types/column';
import { getSortedColumnCards } from '@/utils/get-sorted-column-cards';

export const useColumnOperations = (column: Column) => {
    const { updateColumn, deleteColumn } = useColumns();
    const {
        addCard,
        state: { cards },
    } = useCards();
    const sortedColumnCards = getSortedColumnCards(cards, column.id);

    const handleUpdateTitle = useCallback(
        async (newTitle: string) => {
            await updateColumn(column.id, {
                ...column,
                title: newTitle,
            });
        },
        [column, updateColumn],
    );

    const handleDelete = useCallback(async () => {
        await deleteColumn(column.id);
    }, [column.id, deleteColumn]);

    const handleAddCard = useCallback(
        async (title: string) => {
            await addCard({
                id: generateId('card'),
                title,
                description: '',
                columnId: column.id,
            });
        },
        [addCard, column.id],
    );

    return {
        sortedColumnCards,
        handleUpdateTitle,
        handleDelete,
        handleAddCard,
    };
};
