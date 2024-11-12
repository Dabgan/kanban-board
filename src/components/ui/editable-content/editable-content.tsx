'use client';

import { ErrorMessage } from '@/components/ui/error-message/error-message';
import { useEditableContent } from '@/hooks/use-editable-content';
import type { EditableContentProps } from '@/types/editable-content';
import { combineClassNames } from '@/utils/style-utils';

import styles from './editable-content.module.scss';

export const EditableContent = ({
    content,
    onUpdate,
    ariaLabel,
    type,
    tag: Tag = 'h2',
    placeholder = 'Add content...',
}: EditableContentProps) => {
    const { state, handlers, refs } = useEditableContent(content, onUpdate, type);

    if (state.isEditing) {
        return (
            <div className={styles['edit-container']}>
                {type === 'title' ? (
                    <input
                        ref={refs.inputRef}
                        aria-label={ariaLabel}
                        className={combineClassNames(styles.input, state.validationError && styles.error)}
                        value={state.currentContent}
                        onBlur={handlers.handleBlur}
                        onChange={handlers.handleChange}
                        onKeyDown={handlers.handleKeyDown}
                    />
                ) : (
                    <>
                        <textarea
                            ref={refs.textareaRef}
                            aria-label={ariaLabel}
                            className={combineClassNames(styles.textarea, state.validationError && styles.error)}
                            rows={4}
                            value={state.currentContent}
                            onBlur={handlers.handleBlur}
                            onChange={handlers.handleChange}
                            onKeyDown={handlers.handleKeyDown}
                        />
                        <p className={styles.hint}>Press Ctrl+Enter to save, Esc to cancel</p>
                    </>
                )}
                {state.validationError ? <ErrorMessage message={state.validationError} /> : null}
            </div>
        );
    }

    return (
        <button
            aria-label={ariaLabel}
            className={combineClassNames(styles.content, styles[type])}
            data-type={type}
            type="button"
            onClick={handlers.handleContentClick}
        >
            {type === 'title' ? (
                <Tag>{content || placeholder}</Tag>
            ) : (
                <div className={styles['description-content']}>{content || placeholder}</div>
            )}
        </button>
    );
};
