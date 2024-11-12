'use client';

import type { ButtonHTMLAttributes } from 'react';

import styles from './delete-button.module.scss';

type DeleteButtonProps = {
    label: string;
    variant?: 'icon' | 'button';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const DeleteButton = ({ label, variant = 'icon', onClick, className, ...props }: DeleteButtonProps) => {
    const buttonClassName = [styles['delete-button'], styles[variant], className].filter(Boolean).join(' ');

    return (
        <button aria-label={label} className={buttonClassName} type="button" onClick={onClick} {...props}>
            {variant === 'button' && <span>Delete</span>}
            <svg
                aria-hidden="true"
                fill="none"
                height="16"
                viewBox="0 0 14 16"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13 2H10V1C10 0.4 9.6 0 9 0H5C4.4 0 4 0.4 4 1V2H1C0.4 2 0 2.4 0 3C0 3.6 0.4 4 1 4H13C13.6 4 14 3.6 14 3C14 2.4 13.6 2 13 2ZM5 1H9V2H5V1Z"
                    fill="currentColor"
                />
                <path
                    d="M2 14C2 15.1 2.9 16 4 16H10C11.1 16 12 15.1 12 14V4H2V14ZM5 7H9C9.6 7 10 7.4 10 8C10 8.6 9.6 9 9 9H5C4.4 9 4 8.6 4 8C4 7.4 4.4 7 5 7Z"
                    fill="currentColor"
                />
            </svg>
        </button>
    );
};
