import type { ButtonProps } from '@/types/common-components';
import styles from './button.module.scss';

export const Button = ({
    'aria-label': ariaLabel,
    children,
    className = '',
    onClick,
    size = 'medium',
    variant = 'secondary',
    ...props
}: ButtonProps) => {
    const buttonClassName = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');

    return (
        <button aria-label={ariaLabel} className={buttonClassName} onClick={onClick} type="button" {...props}>
            {children}
        </button>
    );
};
