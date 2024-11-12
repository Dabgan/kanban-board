import type { InputHTMLAttributes } from 'react';

export type ValidationState = {
    error: string | null;
    isValid: boolean;
};

export type InputBaseProps = {
    'aria-label': string;
    className?: string;
    error?: string;
    id?: string;
};

export type InputProps = InputBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps>;
