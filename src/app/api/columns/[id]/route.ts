import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isColumnRequest } from '@/lib/type-guards';
import { validateColumn } from '@/lib/validation';
import type { BoardData, Column } from '@/types';
import type { ApiResponse } from '@/types/api';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const requestData = await request.json();

        if (!isColumnRequest(requestData)) {
            return handleRouteError<Column>(new Error('Invalid column data'), {
                defaultMessage: 'Invalid column data',
                status: 400,
            });
        }

        const boardData = await readBoardData();
        const validationResult = validateColumn(requestData, boardData.columns);
        if (!validationResult.isValid) {
            return handleRouteError<Column>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            columns: boardData.columns.map((existingColumn) =>
                existingColumn.id === params.id ? requestData : existingColumn,
            ),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Column> = { data: requestData };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Column>(error, {
            defaultMessage: 'Failed to update column',
        });
    }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
    try {
        const boardData = await readBoardData();

        const columnExists = boardData.columns.some((existingColumn) => existingColumn.id === params.id);
        if (!columnExists) {
            return handleRouteError<undefined>(new Error('Column not found'), {
                defaultMessage: 'Column not found',
                status: 404,
            });
        }

        const updatedBoardData: BoardData = {
            ...boardData,
            columns: boardData.columns.filter((existingColumn) => existingColumn.id !== params.id),
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<undefined> = { data: undefined };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<undefined>(error, {
            defaultMessage: 'Failed to delete column',
        });
    }
};
