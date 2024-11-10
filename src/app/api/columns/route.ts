import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { validateColumn } from '@/lib/validation';
import type { BoardData, Column } from '@/types';
import type { ApiResponse } from '@/types/api';

export const GET = async (_request: Request) => {
    try {
        const boardData = await readBoardData();
        const response: ApiResponse<Column[]> = { data: boardData.columns };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Column[]>(error, {
            defaultMessage: 'Failed to fetch columns',
        });
    }
};

export const POST = async (request: Request) => {
    try {
        const newColumn: Column = await request.json();
        const boardData = await readBoardData();

        const validationResult = validateColumn(newColumn, boardData.columns);
        if (!validationResult.isValid) {
            return handleRouteError<Column>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

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
        return handleRouteError<Column>(error, {
            defaultMessage: 'Failed to create column',
        });
    }
};
