import type { Card } from '@/types/card';
import type { Column } from '@/types/column';

export const getSortedColumnCards = (cards: Card[], columnId: string): Card[] =>
    cards
        .filter((columnCard) => columnCard.columnId === columnId)
        .sort((firstCard, secondCard) => firstCard.order - secondCard.order);

export const getSortedColumns = (columns: Column[]): Column[] =>
    [...columns].sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order);
