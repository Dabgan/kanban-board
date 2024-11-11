'use client';

import { Input } from '@/components/ui/input/input';
import { useEditableTitle } from '@/hooks/use-editable-title';

import styles from './editable-title.module.scss';

type EditableTitleProps = {
    title: string;
    onUpdate: (newTitle: string) => Promise<void>;
    tag: 'h1' | 'h2';
    ariaLabel: string;
};

export const EditableTitle = ({ title, onUpdate, tag = 'h2', ariaLabel }: EditableTitleProps) => {
    const {
        isEditing,
        currentTitle,
        inputRef,
        handleKeyDown,
        handleTitleClick,
        handleTitleKeyDown,
        handleBlur,
        setCurrentTitle,
    } = useEditableTitle(title, onUpdate);

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
