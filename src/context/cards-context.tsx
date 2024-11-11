'use client';

import { createContext, useCallback, useMemo, useReducer } from 'react';
import { toast } from 'react-hot-toast';

import { useLoading } from '@/hooks/use-loading';
import { cardsReducer } from '@/reducers/cards-reducer';
import { apiClient } from '@/services/api-client';
import type { Card, CardsContextType } from '@/types/card';

export const CardsContext = createContext<CardsContextType | null>(null);

type CardsProviderProps = {
    children: React.ReactNode;
    initialCards: Card[];
};

export const CardsProvider = ({ children, initialCards }: CardsProviderProps) => {
    const [state, dispatch] = useReducer(cardsReducer, {
        cards: initialCards,
        error: null,
    });

    const { setGlobalLoading } = useLoading();

    const addCard = useCallback(
        async (card: Omit<Card, 'order'>) => {
            setGlobalLoading(true);
            try {
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
                setGlobalLoading(false);
            }
        },
        [state.cards, setGlobalLoading],
    );

    const updateCard = useCallback(
        async (id: string, card: Card) => {
            setGlobalLoading(true);
            try {
                dispatch({ type: 'UPDATE_CARD', payload: card });

                const response = await apiClient.cards.update(id, card);

                if (response.error ?? !response.data) {
                    dispatch({ type: 'SET_CARDS', payload: state.cards });
                    toast.error(response.error?.message ?? 'Failed to update card');
                }
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                toast.error('Failed to update card');
            } finally {
                setGlobalLoading(false);
            }
        },
        [state.cards, setGlobalLoading],
    );

    const deleteCard = useCallback(
        async (id: string) => {
            setGlobalLoading(true);
            try {
                const previousCards = state.cards;
                dispatch({ type: 'DELETE_CARD', payload: id });

                const response = await apiClient.cards.delete(id);

                if (response.error) {
                    dispatch({ type: 'SET_CARDS', payload: previousCards });
                    throw new Error(response.error.message);
                }
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                throw error;
            } finally {
                setGlobalLoading(false);
            }
        },
        [state.cards, setGlobalLoading],
    );

    const batchUpdateCards = useCallback(
        async (updatedCards: Card[]) => {
            try {
                // Apply optimistic update
                dispatch({ type: 'SET_CARDS', payload: updatedCards });

                const response = await apiClient.cards.batchUpdate(updatedCards);

                if (response.error) {
                    dispatch({ type: 'SET_CARDS', payload: state.cards });
                    toast.error(response.error.message);
                    return;
                }

                if (response.data) {
                    dispatch({ type: 'SET_CARDS', payload: response.data });
                }

                toast.success('Cards updated successfully');
            } catch (error) {
                dispatch({ type: 'SET_CARDS', payload: state.cards });
                toast.error('Failed to update cards');
            }
        },
        [state.cards],
    );

    const value = useMemo(
        () => ({
            state,
            addCard,
            updateCard,
            deleteCard,
            batchUpdateCards,
        }),
        [state, addCard, updateCard, deleteCard, batchUpdateCards],
    );

    return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};
