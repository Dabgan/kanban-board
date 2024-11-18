import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import { Header } from '@/components/header/header';
import { CardsProviderWrapper } from '@/components/providers/cards-provider';
import { ColumnsProviderWrapper } from '@/components/providers/columns-provider';
import { InitialDataWrapper } from '@/components/providers/initial-data-provider';
import { LoadingProvider } from '@/context/loading-context';
import '@/styles/globals.scss';

export const metadata: Metadata = {
    title: 'Kanban Board',
    description: 'Interactive Kanban board with Next.js',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                <LoadingProvider>
                    <InitialDataWrapper>
                        <ColumnsProviderWrapper>
                            <CardsProviderWrapper>
                                <Header />
                                {children}
                            </CardsProviderWrapper>
                        </ColumnsProviderWrapper>
                    </InitialDataWrapper>
                </LoadingProvider>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
};

export default RootLayout;
