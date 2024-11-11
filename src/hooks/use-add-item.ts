import { useCallback, useRef, useState } from 'react';

export const useAddItem = (onAdd: (title: string) => Promise<void>) => {
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

    return {
        isAdding,
        newTitle,
        inputRef,
        handleAdd,
        handleKeyDown,
        handleStartAdding,
        setNewTitle,
    };
};
