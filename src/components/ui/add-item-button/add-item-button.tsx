'use client';

import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';

import styles from './add-item-button.module.scss';

type AddItemButtonProps = {
    onAdd: (title: string) => Promise<void>;
    buttonText: string;
    placeholder: string;
    buttonAriaLabel: string;
    inputAriaLabel: string;
};

export const AddItemButton = ({
    onAdd,
    buttonText,
    placeholder,
    buttonAriaLabel,
    inputAriaLabel,
}: AddItemButtonProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = useCallback(async () => {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) {
            setIsAdding(false);
            setNewTitle('');
            return;
        }

        await onAdd(trimmedTitle);
        setIsAdding(false);
        setNewTitle('');
    }, [newTitle, onAdd]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await handleAdd();
            }
            if (event.key === 'Escape') {
                setIsAdding(false);
                setNewTitle('');
            }
        },
        [handleAdd],
    );

    const handleStartAdding = useCallback(() => {
        setIsAdding(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    return isAdding ? (
        <div className={styles['new-item']}>
            <Input
                ref={inputRef}
                aria-label={inputAriaLabel}
                placeholder={placeholder}
                value={newTitle}
                onBlur={handleAdd}
                onChange={(event) => setNewTitle(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    ) : (
        <Button
            aria-label={buttonAriaLabel}
            onClick={handleStartAdding}
            variant="primary"
            className={styles['add-button']}
        >
            {buttonText}
        </Button>
    );
};
