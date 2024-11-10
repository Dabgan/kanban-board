'use client';

import type { PropsWithChildren } from 'react';

import { LoadingProvider } from '@/context/loading-context';

export const LoadingProviderWrapper = ({ children }: PropsWithChildren) => {
    return <LoadingProvider>{children}</LoadingProvider>;
};
