'use client';

import { useCallback, useRef, useState } from 'react';

import { Input } from '@/components/ui/input/input';

import styles from './editable-title.module.scss';

type EditableTitleProps = {
    title: string;
    onUpdate: (newTitle: string) => Promise<void>;
    tag: 'h1' | 'h2';
    ariaLabel: string;
};

export const EditableTitle = ({ title, onUpdate, tag = 'h2', ariaLabel }: EditableTitleProps) => {
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

    const TagName = tag;

    return isEditing ? (
        <div className={styles['edit-container']}>
            <Input
                ref={inputRef}
                aria-label={ariaLabel}
                className={styles.input}
                value={currentTitle}
                onBlur={handleBlur}
                onChange={(event) => setCurrentTitle(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    ) : (
        <button
            className={styles.title}
            onClick={handleTitleClick}
            onKeyDown={handleTitleKeyDown}
            type="button"
            aria-label={ariaLabel}
        >
            <TagName>{title}</TagName>
        </button>
    );
};
