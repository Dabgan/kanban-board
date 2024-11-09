import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.scss';

export const metadata: Metadata = {
    title: 'Kanban Board',
    description: 'Interactive Kanban board with Next.js',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
};

export default RootLayout;
