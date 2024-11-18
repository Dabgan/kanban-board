import { NextResponse } from 'next/server';

import { handleRouteError } from '@/lib/error-handling';
import { readBoardData, writeBoardData } from '@/lib/json-storage';
import { isColumnRequest } from '@/lib/type-guards';
import { validateColumn } from '@/lib/validation';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/board';
import type { Column } from '@/types/column';
import { sanitizeRequestData } from '@/utils/sanitization';

export const PUT = async (request: Request) => {
    try {
        const requestData = await request.json();

        if (!Array.isArray(requestData) || !requestData.every(isColumnRequest)) {
            return handleRouteError<Column[]>(new Error('Invalid columns data'), {
                defaultMessage: 'Invalid columns data',
                status: 400,
            });
        }

        const sanitizedColumns = requestData.map((column) => sanitizeRequestData<Column>(column));

        const validationResults = sanitizedColumns.map((column) => validateColumn(column, sanitizedColumns));
        const invalidColumn = validationResults.find((result) => !result.isValid);
        if (invalidColumn) {
            return handleRouteError<Column[]>(new Error(invalidColumn.errors[0]?.message ?? 'Validation failed'), {
                defaultMessage: 'Validation failed',
                status: 400,
            });
        }

        const boardData = await readBoardData();
        const updatedBoardData: BoardData = {
            ...boardData,
            columns: sanitizedColumns,
        };

        await writeBoardData(updatedBoardData);
        const response: ApiResponse<Column[]> = { data: sanitizedColumns };
        return NextResponse.json(response);
    } catch (error) {
        return handleRouteError<Column[]>(error, {
            defaultMessage: 'Failed to update columns',
        });
    }
};
