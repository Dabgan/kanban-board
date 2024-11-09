export type Card = {
    id: string;
    title: string;
    description: string;
    columnId: string;
    order: number;
};

export type Column = {
    id: string;
    title: string;
    order: number;
    cardIds: string[];
};

export type BoardData = {
    columns: Column[];
    cards: Card[];
};
