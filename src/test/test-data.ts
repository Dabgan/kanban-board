import type { Card } from '@/types/card';
import type { Column } from '@/types/column';

export const TEST_CARD: Card = {
    id: 'card-1',
    title: 'Test Card',
    description: '',
    columnId: 'col-1',
    order: 1,
};

export const TEST_COLUMN: Column = {
    id: 'col-1',
    title: 'Test Column',
    order: 1,
    cardIds: [TEST_CARD.id],
};

export const TEST_NEW_COLUMN: Column = {
    id: 'col-2',
    title: 'New Column',
    order: 2,
    cardIds: [],
};
