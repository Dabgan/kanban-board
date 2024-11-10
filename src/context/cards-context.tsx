'use client';

import { createContext, useCallback, useReducer } from 'react';
import { toast } from 'react-hot-toast';

import { cardsReducer } from '@/reducers/cards-reducer';
import { apiClient } from '@/services/api-client';
import type { Card } from '@/types';
import type { CardsContextType } from '@/types/cards';

export const CardsContext = createContext<CardsContextType | null>(null);

type CardsProviderProps = {
    children: React.ReactNode;
    initialCards: Card[];
};

export const CardsProvider = ({ children, initialCards }: CardsProviderProps) => {
    const [state, dispatch] = useReducer(cardsReducer, {
        cards: initialCards,
        isLoading: false,
        error: null,
    });

    const addCard = useCallback(
        async (card: Omit<Card, 'order'>) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Optimistic update
                const columnCards = state.cards.filter((existingCard) => existingCard.columnId === card.columnId);
                const highestOrder = Math.max(...columnCards.map((existingCard) => existingCard.order), 0);

                const optimisticCard: Card = {
                    ...card,
                    order: highestOrder + 1,
                };
                dispatch({ type: 'ADD_CARD', payload: optimisticCard });

                const response = await apiClient.cards.create(card);

                if (response.error ?? !response.data) {
                    dispatch({ type: 'SET_CARDS', payload: state.cards });
                    toast.error(response.error?.message ?? 'Failed to create card');
                    return;
                }

                const updatedCards = state.cards.filter((existingCard) => existingCard.id !== card.id);
                dispatch({ type: 'SET_CARDS', payload: [...updatedCards, response.data] });
                toast.success('Card created successfully');
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                toast.error('Failed to create card');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cards],
    );

    const updateCard = useCallback(
        async (id: string, card: Card) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                dispatch({ type: 'UPDATE_CARD', payload: card });

                const response = await apiClient.cards.update(id, card);

                if (response.error ?? !response.data) {
                    dispatch({ type: 'SET_CARDS', payload: state.cards });
                    toast.error(response.error?.message ?? 'Failed to update card');
                    return;
                }

                toast.success('Card updated successfully');
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                toast.error('Failed to update card');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cards],
    );

    const deleteCard = useCallback(
        async (id: string) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const previousCards = state.cards;
                dispatch({ type: 'DELETE_CARD', payload: id });

                const response = await apiClient.cards.delete(id);

                if (response.error) {
                    dispatch({ type: 'SET_CARDS', payload: previousCards });
                    toast.error(response.error.message);
                    return;
                }

                toast.success('Card deleted successfully');
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                toast.error('Failed to delete card');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cards],
    );

    return <CardsContext.Provider value={{ state, addCard, updateCard, deleteCard }}>{children}</CardsContext.Provider>;
};
