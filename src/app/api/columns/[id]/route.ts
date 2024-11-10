import { NextResponse } from 'next/server';

import { readBoardData, writeBoardData } from '@/lib/json-storage';
import type { BoardData, Column } from '@/types';
import type { ApiResponse } from '@/types/api';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const updatedColumn: Column = await request.json();
        const boardData = await readBoardData();

        const updatedBoardData: BoardData = {
            ...boardData,
            columns: boardData.columns.map((existingColumn) =>
                existingColumn.id === params.id ? updatedColumn : existingColumn,
            ),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Column> = { data: updatedColumn };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update column';
        const response: ApiResponse<Column> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();

        const updatedBoardData: BoardData = {
            ...boardData,
            columns: boardData.columns.filter((existingColumn) => existingColumn.id !== params.id),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<void> = { data: undefined };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete column';
        const response: ApiResponse<void> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};
