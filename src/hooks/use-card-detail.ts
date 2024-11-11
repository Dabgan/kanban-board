import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { useCards } from '@/hooks/use-cards';
import type { CardDetailState, CardDetailOperations } from '@/types/card-detail';

export const useCardDetail = (cardId: string): [CardDetailState, CardDetailOperations] => {
    const router = useRouter();
    const {
        state: { cards },
        updateCard,
        deleteCard: removeCard,
    } = useCards();
    const [state, setState] = useState<CardDetailState>({
        card: null,
        isLoading: true,
        error: null,
    });
    const isDeletingRef = useRef(false);

    useEffect(() => {
        if (isDeletingRef.current) return;

        const card = cards.find((existingCard) => existingCard.id === cardId);
        if (!card) {
            setState({
                card: null,
                isLoading: false,
                error: 'Card not found',
            });
            return;
        }

        setState({
            card,
            isLoading: false,
            error: null,
        });
    }, [cardId, cards]);

    const updateTitle = useCallback(
        async (newTitle: string) => {
            if (!state.card) return;

            try {
                await updateCard(state.card.id, {
                    ...state.card,
                    title: newTitle,
                });
                toast.success('Title updated successfully');
            } catch (error) {
                toast.error('Failed to update title');
            }
        },
        [state.card, updateCard],
    );

    const updateDescription = useCallback(
        async (newDescription: string) => {
            if (!state.card) return;

            try {
                await updateCard(state.card.id, {
                    ...state.card,
                    description: newDescription,
                });
                toast.success('Description updated successfully');
            } catch (error) {
                toast.error('Failed to update description');
            }
        },
        [state.card, updateCard],
    );

    const deleteCard = useCallback(async () => {
        if (!state.card) return;

        try {
            isDeletingRef.current = true;
            router.push('/');
            await removeCard(state.card.id);
            toast.success('Card deleted successfully');
        } catch (error) {
            isDeletingRef.current = false;
            router.back();
            toast.error('Failed to delete card');
        }
    }, [state.card, removeCard, router]);

    return [state, { updateTitle, updateDescription, deleteCard }];
};
