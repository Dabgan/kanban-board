import { render, type RenderOptions } from '@testing-library/react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { PropsWithChildren } from 'react';

import { CardsProvider } from '@/context/cards-context';
import { ColumnsProvider } from '@/context/columns-context';
import { LoadingProvider } from '@/context/loading-context';
import { InitialDataProvider } from '@/context/initial-data-context';
import type { Card } from '@/types/card';
import type { Column } from '@/types/column';

type TestProvidersProps = {
    initialCards?: Card[];
    initialColumns?: Column[];
};

const TestProviders = ({ children, initialCards = [], initialColumns = [] }: PropsWithChildren<TestProvidersProps>) => {
    const onDragEnd = () => {
        // Mock drag end handler
    };

    return (
        <LoadingProvider>
            <InitialDataProvider initialData={{ cards: initialCards, columns: initialColumns }}>
                <ColumnsProvider initialColumns={initialColumns}>
                    <CardsProvider initialCards={initialCards}>
                        <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
                    </CardsProvider>
                </ColumnsProvider>
            </InitialDataProvider>
        </LoadingProvider>
    );
};

const renderWithProviders = (
    ui: React.ReactElement,
    {
        initialCards = [],
        initialColumns = [],
        ...renderOptions
    }: TestProvidersProps & Omit<RenderOptions, 'wrapper'> = {},
) => {
    const view = render(ui, {
        wrapper: ({ children }) => (
            <TestProviders initialCards={initialCards} initialColumns={initialColumns}>
                {children}
            </TestProviders>
        ),
        ...renderOptions,
    });

    return {
        ...view,
    };
};

export * from '@testing-library/react';
export { renderWithProviders as render };
