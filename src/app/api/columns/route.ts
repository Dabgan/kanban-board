import { NextResponse } from 'next/server';

import { readBoardData, writeBoardData } from '@/lib/json-storage';
import type { BoardData, Column } from '@/types';
import type { ApiResponse } from '@/types/api';

export const GET = async (_request: Request) => {
    try {
        const boardData = await readBoardData();
        const response: ApiResponse<Column[]> = { data: boardData.columns };
        return NextResponse.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch columns';
        const response: ApiResponse<Column[]> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const newColumn: Column = await request.json();
        const boardData = await readBoardData();

        const highestOrder = Math.max(...boardData.columns.map((column) => column.order), 0);

        const columnWithOrder = {
            ...newColumn,
            order: highestOrder + 1,
            cardIds: [],
        };

        const updatedBoardData: BoardData = {
            ...boardData,
            columns: [...boardData.columns, columnWithOrder],
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Column> = { data: columnWithOrder };
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create column';
        const response: ApiResponse<Column> = { error: { message: errorMessage } };
        return NextResponse.json(response, { status: 500 });
    }
};
