import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { validateCard } from '@/lib/validation';
import type { BoardData, Card } from '@/types';
import type { ApiResponse } from '@/types/api';

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
        const newCard: Card = await request.json();
        const boardData = await readBoardData();

        const validationResult = validateCard(newCard);
        if (!validationResult.isValid) {
            return handleRouteError<Card>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const columnCards = boardData.cards.filter((card) => card.columnId === newCard.columnId);
        const highestOrder = Math.max(...columnCards.map((card) => card.order), 0);

        const cardWithOrder = {
            ...newCard,
            order: highestOrder + 1,
        };

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
