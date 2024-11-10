'use client';

import type { PropsWithChildren } from 'react';

import { ColumnsProvider } from '@/context/columns-context';
import { useInitialData } from '@/context/initial-data-context';

export const ColumnsProviderWrapper = ({ children }: PropsWithChildren) => {
    const { initialData } = useInitialData();
    return <ColumnsProvider initialColumns={initialData.columns}>{children}</ColumnsProvider>;
};
