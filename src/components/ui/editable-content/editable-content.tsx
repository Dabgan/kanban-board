'use client';

import { useCallback, useRef, useState } from 'react';
import { hasSpecialCharacters } from '@/utils/sanitization';
import { ErrorMessage } from '@/components/ui/error-message/error-message';
import { combineClassNames } from '@/utils/style-utils';

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
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const handleEdit = useCallback(async () => {
        if (validationError) {
            return;
        }

        if (currentContent !== content) {
            await onUpdate(currentContent);
        }
        setIsEditing(false);
    }, [currentContent, onUpdate, content, validationError]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.key === 'Escape') {
                setIsEditing(false);
                setCurrentContent(content);
                setValidationError(null);
                return;
            }

            if (validationError) {
                return;
            }

            if (type === 'title' && event.key === 'Enter') {
                event.preventDefault();
                await handleEdit();
            }
            if (type === 'description' && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                await handleEdit();
            }
        },
        [handleEdit, content, type, validationError],
    );

    const handleContentClick = useCallback(() => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = event.target.value;

        if (hasSpecialCharacters(newValue)) {
            setValidationError('Special characters are not allowed');
        } else {
            setValidationError(null);
        }

        setCurrentContent(newValue);
    };

    const handleBlur = useCallback(() => {
        if (!validationError) {
            void handleEdit();
        }
    }, [handleEdit, validationError]);

    return isEditing ? (
        <div className={styles['edit-container']}>
            {type === 'title' ? (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    aria-label={ariaLabel}
                    className={combineClassNames(styles.input, validationError && styles.error)}
                    value={currentContent}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <>
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        aria-label={ariaLabel}
                        className={combineClassNames(styles.textarea, validationError && styles.error)}
                        value={currentContent}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows={4}
                    />
                    <p className={styles.hint}>Press Ctrl+Enter to save, Esc to cancel</p>
                </>
            )}
            {validationError && <ErrorMessage message={validationError} />}
        </div>
    ) : (
        <button
            className={combineClassNames(styles.content, styles[type])}
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
