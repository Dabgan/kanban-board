import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/types/api';

type ErrorHandlerOptions = {
    defaultMessage: string;
    status?: number;
};

export const handleRouteError = <T>(error: unknown, options: ErrorHandlerOptions): NextResponse<ApiResponse<T>> => {
    const errorMessage = error instanceof Error ? error.message : options.defaultMessage;
    const response: ApiResponse<T> = { error: { message: errorMessage } };
    return NextResponse.json(response, { status: options.status ?? 500 });
};
