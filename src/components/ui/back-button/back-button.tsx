'use client';

import { useRouter } from 'next/navigation';

import styles from './back-button.module.scss';

export const BackButton = () => {
    const router = useRouter();

    return (
        <button aria-label="Go back" className={styles.button} type="button" onClick={() => router.back()}>
            Back to board
        </button>
    );
};
