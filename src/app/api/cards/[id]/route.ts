import { NextResponse } from 'next/server';

import { readBoardData, writeBoardData } from '@/lib/json-storage';
import type { BoardData, Card } from '@/types';
import type { ApiResponse } from '@/types/api';

export const GET = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();
        const foundCard = boardData.cards.find((existingCard) => existingCard.id === params.id);

        if (!foundCard) {
            const response: ApiResponse<Card> = { error: { message: 'Card not found' } };
            return NextResponse.json(response, { status: 404 });
        }

        const response: ApiResponse<Card> = { data: foundCard };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch card';
        const response: ApiResponse<Card> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const updatedCard: Card = await request.json();
        const boardData = await readBoardData();

        const existingCard = boardData.cards.find((card) => card.id === params.id);

        // If moving to a different column, append to the end
        if (existingCard && existingCard.columnId !== updatedCard.columnId) {
            const columnCards = boardData.cards.filter((card) => card.columnId === updatedCard.columnId);
            const highestOrder = Math.max(...columnCards.map((card) => card.order), 0);
            updatedCard.order = highestOrder + 1;
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.map((card) => (card.id === params.id ? updatedCard : card)),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Card> = { data: updatedCard };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update card';
        const response: ApiResponse<Card> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();

        const updatedBoardData: BoardData = {
            ...boardData,
            cards: boardData.cards.filter((existingCard) => existingCard.id !== params.id),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<void> = { data: undefined };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete card';
        const response: ApiResponse<void> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};
