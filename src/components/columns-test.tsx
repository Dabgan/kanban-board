'use client';

import { useColumns } from '@/hooks/use-columns';

export const ColumnsTest = () => {
    const { state } = useColumns();

    return (
        <div>
            <h2>Columns State:</h2>
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );
};
