import type { Card } from './card';
import type { Column } from './column';

export type BoardData = {
    columns: Column[];
    cards: Card[];
};

export const isBoardData = (data: unknown): data is BoardData => {
    if (!data || typeof data !== 'object') {
        return false;
    }

    const potentialBoardData = data as Record<string, unknown>;

    return Array.isArray(potentialBoardData.cards) && Array.isArray(potentialBoardData.columns);
};
