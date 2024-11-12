import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isCard } from '@/lib/type-guards';
import { validateCard } from '@/lib/validation';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/board';
import type { Card } from '@/types/card';
import { sanitizeRequestData } from '@/utils/sanitization';

export const PUT = async (request: Request) => {
    try {
        const requestData = await request.json();

        if (!Array.isArray(requestData) || !requestData.every(isCard)) {
            return handleRouteError<Card[]>(new Error('Invalid cards data'), {
                defaultMessage: 'Invalid cards data',
                status: 400,
            });
        }

        // Sanitize each card
        const sanitizedCards = requestData.map((card) => sanitizeRequestData<Card>(card));

        // Validate all cards
        const validationResults = sanitizedCards.map(validateCard);
        const invalidCard = validationResults.find((result) => !result.isValid);
        if (invalidCard) {
            return handleRouteError<Card[]>(new Error(invalidCard.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const boardData = await readBoardData();
        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.map(
                (existingCard) => sanitizedCards.find((card) => card.id === existingCard.id) ?? existingCard,
            ),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Card[]> = { data: sanitizedCards };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Card[]>(error, {
            defaultMessage: 'Failed to update cards',
        });
    }
};
