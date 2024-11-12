import type { PropsWithChildren } from 'react';
import styles from './error-message.module.scss';

type ErrorMessageProps = PropsWithChildren<{
    message: string;
}>;

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <span className={styles.message} role="alert">
        {message}
    </span>
);
