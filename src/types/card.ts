export type Card = {
    id: string;
    title: string;
    description?: string;
    columnId: string;
    order: number;
};

export type CardRequestWithoutOrder = Omit<Card, 'order'>;

export type CardComponentProps = {
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
    updateCard: (cardId: string, updatedCard: Card) => Promise<void>;
    deleteCard: (cardId: string) => Promise<void>;
    batchUpdateCards: (updatedCards: Card[]) => Promise<void>;
};
