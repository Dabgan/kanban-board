import type { Card } from '@/types';
import type { CardsState } from '@/types/cards';

type CardsAction =
    | { type: 'SET_CARDS'; payload: Card[] }
    | { type: 'ADD_CARD'; payload: Card }
    | { type: 'UPDATE_CARD'; payload: Card }
    | { type: 'DELETE_CARD'; payload: string }
    | { type: 'SET_ERROR'; payload: string | null };

export const cardsReducer = (state: CardsState, action: CardsAction): CardsState => {
    switch (action.type) {
        case 'SET_CARDS':
            return {
                ...state,
                cards: action.payload,
                error: null,
            };

        case 'ADD_CARD':
            return {
                ...state,
                cards: [...state.cards, action.payload],
                error: null,
            };

        case 'UPDATE_CARD':
            return {
                ...state,
                cards: state.cards.map((existingCard) =>
                    existingCard.id === action.payload.id ? action.payload : existingCard,
                ),
                error: null,
            };

        case 'DELETE_CARD':
            return {
                ...state,
                cards: state.cards.filter((card) => card.id !== action.payload),
                error: null,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};
