'use client';

import { useRouter } from 'next/navigation';

import styles from './back-button.module.scss';

export const BackButton = () => {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className={styles.button} aria-label="Go back">
            Back to board
        </button>
    );
};
