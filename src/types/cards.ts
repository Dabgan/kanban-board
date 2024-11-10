import type { Card } from '@/types';

export type CardsState = {
    cards: Card[];
    isLoading: boolean;
    error: string | null;
};

export type CardsContextType = {
    state: CardsState;
    addCard: (card: Omit<Card, 'order'>) => Promise<void>;
    updateCard: (id: string, card: Card) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
};
