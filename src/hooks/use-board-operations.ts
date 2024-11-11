import { useCallback } from 'react';

import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column } from '@/types/column';

export const useBoardOperations = () => {
    const {
        state: { columns },
        addColumn,
    } = useColumns();

    const handleAddColumn = useCallback(
        async (title: string) => {
            const newColumn: Omit<Column, 'order'> = {
                cardIds: [],
                id: generateId('col'),
                title,
            };

            await addColumn(newColumn);
        },
        [addColumn],
    );

    return {
        columns,
        handleAddColumn,
    };
};
