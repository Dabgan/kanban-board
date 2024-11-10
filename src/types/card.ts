export type Card = {
    id: string;
    title: string;
    description?: string;
    columnId: string;
    order: number;
};

export type CardProps = {
    card: Card;
    index: number;
};

export type CardsState = {
    cards: Card[];
    error: string | null;
};

export type CardsContextType = {
    state: CardsState;
    addCard: (card: Omit<Card, 'order'>) => Promise<void>;
    updateCard: (id: string, card: Card) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
};
