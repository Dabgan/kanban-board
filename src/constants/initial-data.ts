import type { BoardData } from '@/types';

export const initialData: BoardData = {
    columns: [
        {
            id: 'col-1',
            title: 'Monday',
            order: 1,
            cardIds: ['card-1'],
        },
        {
            id: 'col-2',
            title: 'Tuesday',
            order: 2,
            cardIds: ['card-2'],
        },
        {
            id: 'col-3',
            title: 'Wednesday',
            order: 3,
            cardIds: ['card-3'],
        },
    ],
    cards: [
        {
            id: 'card-1',
            title: 'Feed doggo',
            description: 'Give Pimpek his favorite snacks',
            columnId: 'col-1',
            order: 1,
        },
        {
            id: 'card-2',
            title: 'Clean bedroom',
            description: 'Change sheets and vacuum',
            columnId: 'col-2',
            order: 1,
        },
        {
            id: 'card-3',
            title: 'Go to the gym',
            description: 'Leg day!',
            columnId: 'col-3',
            order: 1,
        },
    ],
};