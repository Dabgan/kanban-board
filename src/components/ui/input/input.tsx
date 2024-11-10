import { type ChangeEvent, forwardRef } from 'react';

import type { InputProps } from '@/types/common-components';

import styles from './input.module.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 'aria-label': ariaLabel, className = '', error, id, onChange, type = 'text', ...props }, ref) => {
        const inputClassName = [styles.input, error ? styles.error : '', className].filter(Boolean).join(' ');

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
        };

        return (
            <div role="group" aria-labelledby={id ? `${id}-label` : undefined}>
                <input
                    ref={ref}
                    aria-invalid={Boolean(error)}
                    aria-label={ariaLabel}
                    className={inputClassName}
                    id={id}
                    onChange={handleChange}
                    type={type}
                    {...props}
                />
                {error ? (
                    <span className={styles['error-message']} role="alert">
                        {error}
                    </span>
                ) : null}
            </div>
        );
    },
);

Input.displayName = 'Input';
