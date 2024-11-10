'use client';

import { useCards } from '@/hooks/use-cards';
import { useColumns } from '@/hooks/use-columns';

export const ColumnsTest = () => {
    const { state: columnsState } = useColumns();
    const { state: cardsState } = useCards();

    return (
        <div>
            <h2>Columns State:</h2>
            <pre>{JSON.stringify(columnsState, null, 2)}</pre>
            <h2>Cards State:</h2>
            <pre>{JSON.stringify(cardsState, null, 2)}</pre>
        </div>
    );
};
