import type { Card } from '@/types/card';

export type CardDetailState = {
    card: Card | null;
    isLoading: boolean;
    error: string | null;
};

export type CardDetailOperations = {
    updateTitle: (newTitle: string) => Promise<void>;
    updateDescription: (newDescription: string) => Promise<void>;
    deleteCard: () => Promise<void>;
};
