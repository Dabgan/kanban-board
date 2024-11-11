import type { ApiResponse } from '@/types/api';
import type { Card } from '@/types/card';
import type { Column } from '@/types/column';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const fetchApi = async <T>(
    endpoint: string,
    options?: {
        method?: HttpMethod;
        body?: unknown;
    },
): Promise<ApiResponse<T>> => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: options?.method ?? 'GET',
        headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    const data = (await response.json()) as ApiResponse<T>;
    return data;
};

export const apiClient = {
    cards: {
        getAll: () => fetchApi<Card[]>('/api/cards'),

        getById: (id: string) => fetchApi<Card>(`/api/cards/${id}`),

        create: (card: Omit<Card, 'order'>) =>
            fetchApi<Card>('/api/cards', {
                method: 'POST',
                body: card,
            }),

        update: (id: string, card: Card) =>
            fetchApi<Card>(`/api/cards/${id}`, {
                method: 'PUT',
                body: card,
            }),

        delete: (id: string) =>
            fetchApi<undefined>(`/api/cards/${id}`, {
                method: 'DELETE',
            }),

        batchUpdate: (cards: Card[]) =>
            fetchApi<Card[]>('/api/cards/batch', {
                method: 'PUT',
                body: cards,
            }),
    },
    columns: {
        getAll: () => fetchApi<Column[]>('/api/columns'),

        create: (column: Omit<Column, 'order'>) =>
            fetchApi<Column>('/api/columns', {
                method: 'POST',
                body: column,
            }),

        update: (id: string, column: Column) =>
            fetchApi<Column>(`/api/columns/${id}`, {
                method: 'PUT',
                body: column,
            }),

        delete: (id: string) =>
            fetchApi<undefined>(`/api/columns/${id}`, {
                method: 'DELETE',
            }),
    },
};
