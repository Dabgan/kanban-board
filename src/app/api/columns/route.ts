import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isColumnRequestWithoutOrder } from '@/lib/type-guards';
import { validateColumn } from '@/lib/validation';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/board';
import type { Column, ColumnRequest } from '@/types/column';
import { sanitizeRequestData } from '@/utils/sanitization';

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
        const requestData = (await request.json()) as unknown;

        if (!isColumnRequestWithoutOrder(requestData)) {
            return handleRouteError<Column>(new Error('Invalid column data'), {
                defaultMessage: 'Invalid column data',
                status: 400,
            });
        }

        const boardData = await readBoardData();
        const sanitizedData = sanitizeRequestData<ColumnRequest>(requestData);
        const highestOrder = Math.max(...boardData.columns.map((column) => column.order), 0);

        const columnWithOrder: Column = {
            ...sanitizedData,
            order: highestOrder + 1,
        };

        const validationResult = validateColumn(columnWithOrder, boardData.columns);
        if (!validationResult.isValid) {
            return handleRouteError<Column>(new Error(validationResult.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

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
