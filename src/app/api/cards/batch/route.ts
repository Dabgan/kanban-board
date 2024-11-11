import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isCard } from '@/lib/type-guards';
import type { ApiResponse } from '@/types/api';
import type { Card } from '@/types/card';

export const PUT = async (request: Request) => {
    try {
        const requestData = await request.json();

        if (!Array.isArray(requestData) || !requestData.every(isCard)) {
            return handleRouteError<Card[]>(new Error('Invalid cards data'), {
                defaultMessage: 'Invalid cards data',
                status: 400,
            });
        }

        const updatedCards = requestData;
        const boardData = await readBoardData();

        const newCards = boardData.cards.map((existingCard) => {
            const updatedCard = updatedCards.find((update) => update.id === existingCard.id);
            return updatedCard ?? existingCard;
        });

        await writeBoardData({
            ...boardData,
            cards: newCards,
        });

        const response: ApiResponse<Card[]> = { data: updatedCards };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Card[]>(error, {
            defaultMessage: 'Failed to update cards',
        });
    }
};
