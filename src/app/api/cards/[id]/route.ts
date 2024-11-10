import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isCardRequest } from '@/lib/type-guards';
import { validateCard } from '@/lib/validation';
import type { BoardData, Card } from '@/types';
import type { ApiResponse } from '@/types/api';

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

        if (!isCardRequest(requestData)) {
            return handleRouteError<Card>(new Error('Invalid card data'), {
                defaultMessage: 'Invalid card data',
                status: 400,
            });
        }

        const boardData = await readBoardData();
        const validationResult = validateCard(requestData);
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

        // If moving to a different column, append to the end
        if (existingCard.columnId !== requestData.columnId) {
            const columnCards = boardData.cards.filter((card) => card.columnId === requestData.columnId);
            const highestOrder = Math.max(...columnCards.map((card) => card.order), 0);
            requestData.order = highestOrder + 1;
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.map((card) => (card.id === params.id ? requestData : card)),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Card> = { data: requestData };
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
