'use client';

import styles from './loading.module.scss';

export const Loading = () => (
    <div className={styles.container} role="status">
        <div className={styles.spinner} />
        <span className="visually-hidden">Loading...</span>
    </div>
);
