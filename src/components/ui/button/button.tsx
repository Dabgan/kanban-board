import type { ButtonHTMLAttributes } from 'react';

import { combineClassNames } from '@/utils/style-utils';

import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant = 'primary', size = 'medium', className = '', ...props }: ButtonProps) => (
    <button
        className={combineClassNames(styles.button, styles[variant], styles[size], className)}
        type="button"
        {...props}
    />
);
