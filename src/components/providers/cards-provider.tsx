'use client';

import type { PropsWithChildren } from 'react';

import { CardsProvider } from '@/context/cards-context';
import { useInitialData } from '@/context/initial-data-context';

export const CardsProviderWrapper = ({ children }: PropsWithChildren) => {
    const { initialData } = useInitialData();
    return <CardsProvider initialCards={initialData.cards}>{children}</CardsProvider>;
};
