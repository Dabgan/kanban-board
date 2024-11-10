'use client';

import { useLoading } from '@/hooks/use-loading';

export const LoadingTest = () => {
    const {
        state: { isLoading },
    } = useLoading();

    return (
        <div>
            <h2>Global Loading State:</h2>
            {isLoading ? <p>Loading...</p> : null}
        </div>
    );
};
