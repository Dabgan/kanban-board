import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import { CardsProviderWrapper } from '@/components/providers/cards-provider';
import { ColumnsProviderWrapper } from '@/components/providers/columns-provider';
import { InitialDataWrapper } from '@/components/providers/initial-data-provider';
import '@/styles/globals.scss';

export const metadata: Metadata = {
    title: 'Kanban Board',
    description: 'Interactive Kanban board with Next.js',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                <InitialDataWrapper>
                    <ColumnsProviderWrapper>
                        <CardsProviderWrapper>{children}</CardsProviderWrapper>
                    </ColumnsProviderWrapper>
                </InitialDataWrapper>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
};

export default RootLayout;
