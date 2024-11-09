import { type ReactNode } from 'react';

import styles from './button.module.scss';

interface ButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

const Button = ({ children }: ButtonProps) => {
    return (
        <button className={styles.button} type="button">
            {children}
        </button>
    );
};

export { Button };
