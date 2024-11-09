import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
    title: 'Next.js Template',
    description: 'Next.js Template with TypeScript, SASS, and Testing',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
