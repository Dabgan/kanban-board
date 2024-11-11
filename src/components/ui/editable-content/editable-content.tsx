'use client';

import { useCallback, useRef, useState } from 'react';

import styles from './editable-content.module.scss';

type ContentType = 'title' | 'description';

type EditableContentProps = {
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
    ariaLabel: string;
    type: ContentType;
    tag?: 'h1' | 'h2';
    placeholder?: string;
};

export const EditableContent = ({
    content,
    onUpdate,
    ariaLabel,
    type,
    tag: Tag = 'h2',
    placeholder = 'Add content...',
}: EditableContentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentContent, setCurrentContent] = useState(content);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const handleEdit = useCallback(async () => {
        if (currentContent !== content) {
            await onUpdate(currentContent);
        }
        setIsEditing(false);
    }, [currentContent, onUpdate, content]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (type === 'title' && event.key === 'Enter') {
                event.preventDefault();
                await handleEdit();
            }
            if (type === 'description' && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                await handleEdit();
            }
            if (event.key === 'Escape') {
                setIsEditing(false);
                setCurrentContent(content);
            }
        },
        [handleEdit, content, type],
    );

    const handleContentClick = useCallback(() => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        setCurrentContent(content);
    }, [content]);

    return isEditing ? (
        <div className={styles['edit-container']}>
            {type === 'title' ? (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    aria-label={ariaLabel}
                    className={styles.input}
                    value={currentContent}
                    onBlur={handleBlur}
                    onChange={(event) => setCurrentContent(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <>
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        aria-label={ariaLabel}
                        className={styles.textarea}
                        value={currentContent}
                        onBlur={handleBlur}
                        onChange={(event) => setCurrentContent(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={4}
                    />
                    <p className={styles.hint}>Press Ctrl+Enter to save, Esc to cancel</p>
                </>
            )}
        </div>
    ) : (
        <button
            className={[styles.content, styles[type]].filter(Boolean).join(' ')}
            onClick={handleContentClick}
            type="button"
            aria-label={ariaLabel}
            data-type={type}
        >
            {type === 'title' ? (
                <Tag>{content || placeholder}</Tag>
            ) : (
                <div className={styles['description-content']}>{content || placeholder}</div>
            )}
        </button>
    );
};
