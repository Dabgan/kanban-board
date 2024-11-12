import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isCardRequestWithoutOrder } from '@/lib/type-guards';
import { validateCard } from '@/lib/validation';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/board';
import type { Card, CardRequestWithoutOrder } from '@/types/card';
import { sanitizeRequestData } from '@/utils/sanitization';

export const GET = async (_request: Request) => {
    try {
        const boardData = await readBoardData();
        const response: ApiResponse<Card[]> = { data: boardData.cards };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Card[]>(error, {
            defaultMessage: 'Failed to fetch cards',
        });
    }
};

export const POST = async (request: Request) => {
    try {
        const requestData = (await request.json()) as unknown;

        if (!isCardRequestWithoutOrder(requestData)) {
            return handleRouteError<Card>(new Error('Invalid card data'), {
                defaultMessage: 'Invalid card data',
                status: 400,
            });
        }

        const sanitizedData = sanitizeRequestData<CardRequestWithoutOrder>(requestData);

        const boardData = await readBoardData();
        const columnCards = boardData.cards.filter((card) => card.columnId === sanitizedData.columnId);
        const highestOrder = Math.max(...columnCards.map((card) => card.order), 0);

        const cardWithOrder: Card = {
            ...sanitizedData,
            order: highestOrder + 1,
        };

        // Validate complete card data after adding order
        const validationResult = validateCard(cardWithOrder);
        if (!validationResult.isValid) {
            return handleRouteError<Card>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: [...boardData.cards, cardWithOrder],
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Card> = { data: cardWithOrder };
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return handleRouteError<Card>(error, {
            defaultMessage: 'Failed to create card',
        });
    }
};
