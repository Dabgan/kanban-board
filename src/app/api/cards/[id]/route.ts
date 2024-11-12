import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isCard } from '@/lib/type-guards';
import { validateCard } from '@/lib/validation';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/board';
import type { Card } from '@/types/card';
import { sanitizeRequestData } from '@/utils/sanitization';

export const GET = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();
        const foundCard = boardData.cards.find((existingCard) => existingCard.id === params.id);

        if (!foundCard) {
            return handleRouteError<Card>(new Error('Card not found'), {
                defaultMessage: 'Card not found',
                status: 404,
            });
        }

        const response: ApiResponse<Card> = { data: foundCard };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Card>(error, {
            defaultMessage: 'Failed to fetch card',
        });
    }
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const requestData = await request.json();

        if (!isCard(requestData)) {
            return handleRouteError<Card>(new Error('Invalid card data'), {
                defaultMessage: 'Invalid card data',
                status: 400,
            });
        }

        const sanitizedData = sanitizeRequestData<Card>(requestData);

        const boardData = await readBoardData();
        const validationResult = validateCard(sanitizedData);
        if (!validationResult.isValid) {
            return handleRouteError<Card>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const existingCard = boardData.cards.find((card) => card.id === params.id);
        if (!existingCard) {
            return handleRouteError<Card>(new Error('Card not found'), {
                defaultMessage: 'Card not found',
                status: 404,
            });
        }

        if (existingCard.columnId !== sanitizedData.columnId) {
            const columnCards = boardData.cards.filter((card) => card.columnId === sanitizedData.columnId);
            const highestOrder = Math.max(...columnCards.map((card) => card.order), 0);
            sanitizedData.order = highestOrder + 1;
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.map((card) => (card.id === params.id ? sanitizedData : card)),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Card> = { data: sanitizedData };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Card>(error, {
            defaultMessage: 'Failed to update card',
        });
    }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();

        const cardExists = boardData.cards.some((existingCard) => existingCard.id === params.id);
        if (!cardExists) {
            return handleRouteError<undefined>(new Error('Card not found'), {
                defaultMessage: 'Card not found',
                status: 404,
            });
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.filter((existingCard) => existingCard.id !== params.id),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<undefined> = { data: undefined };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<undefined>(error, {
            defaultMessage: 'Failed to delete card',
        });
    }
};
