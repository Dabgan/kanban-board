import { useCallback, useRef, useState } from 'react';

export const useEditableTitle = (title: string, onUpdate: (newTitle: string) => Promise<void>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentTitle, setCurrentTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEdit = useCallback(async () => {
        if (currentTitle !== title) {
            await onUpdate(currentTitle);
        }
        setIsEditing(false);
    }, [currentTitle, onUpdate, title]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await handleEdit();
            }
            if (event.key === 'Escape') {
                setIsEditing(false);
                setCurrentTitle(title);
            }
        },
        [handleEdit, title],
    );

    const handleTitleClick = useCallback(() => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleTitleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                handleTitleClick();
            }
        },
        [handleTitleClick],
    );

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        setCurrentTitle(title);
    }, [title]);

    return {
        isEditing,
        currentTitle,
        inputRef,
        handleEdit,
        handleKeyDown,
        handleTitleClick,
        handleTitleKeyDown,
        handleBlur,
        setCurrentTitle,
    };
};
