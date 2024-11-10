import { InitialDataProvider } from '@/context/initial-data-context';
import { apiClient } from '@/services/api-client';
import type { InitialData } from '@/types/initial-data';

type InitialDataWrapperProps = {
    children: React.ReactNode;
};

const getInitialData = async (): Promise<InitialData> => {
    const [columnsResponse, cardsResponse] = await Promise.all([apiClient.columns.getAll(), apiClient.cards.getAll()]);

    if (columnsResponse.error ?? cardsResponse.error) {
        throw new Error('Failed to fetch initial data');
    }

    return {
        columns: columnsResponse.data ?? [],
        cards: cardsResponse.data ?? [],
    };
};

export const InitialDataWrapper = async ({ children }: InitialDataWrapperProps) => {
    const initialData = await getInitialData();
    return <InitialDataProvider initialData={initialData}>{children}</InitialDataProvider>;
};
