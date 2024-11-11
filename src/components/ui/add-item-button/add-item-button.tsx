'use client';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { useAddItem } from '@/hooks/use-add-item';

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
    const { isAdding, newTitle, inputRef, handleAdd, handleKeyDown, handleStartAdding, setNewTitle } =
        useAddItem(onAdd);

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
