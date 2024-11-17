'use client';

import { type ReactElement } from 'react';

import { Button } from '@/components/ui/button/button';
import { ErrorMessage } from '@/components/ui/error-message/error-message';
import { EDITABLE_CONTENT_CONSTANTS } from '@/constants/editable-content';
import { useEditableContent } from '@/hooks/use-editable-content';
import type { ContentType, EditableContentProps, EditableFieldProps, FieldType } from '@/types/editable-content';
import { combineClassNames } from '@/utils/style-utils';

import styles from './editable-content.module.scss';
import { EditableField } from './editable-field';

type FieldConfig = {
    fieldType: FieldType;
    Component: keyof JSX.IntrinsicElements;
    className?: string;
};

const getFieldConfig = (type: ContentType): FieldConfig => ({
    fieldType: type === 'title' ? 'input' : 'textarea',
    Component: type === 'title' ? 'h2' : 'div',
    className: type === 'title' ? undefined : styles['description-content'],
});

export const EditableContent = ({
    content,
    onUpdate,
    ariaLabel,
    type,
    placeholder = EDITABLE_CONTENT_CONSTANTS.PLACEHOLDER,
}: EditableContentProps): ReactElement => {
    const { state, handlers, refs } = useEditableContent(content, onUpdate, type);
    const { fieldType, Component, className } = getFieldConfig(type);

    if (state.isEditing) {
        const commonFieldProps = {
            ariaLabel,
            value: state.currentContent,
            hasError: Boolean(state.validationError),
            onBlur: handlers.handleBlur,
            onChange: handlers.handleChange,
            onKeyDown: handlers.handleKeyDown,
        };

        const fieldProps =
            fieldType === 'input'
                ? ({
                      ...commonFieldProps,
                      fieldType: 'input' as const,
                      fieldRef: refs.inputRef,
                  } as const)
                : ({
                      ...commonFieldProps,
                      fieldType: 'textarea' as const,
                      fieldRef: refs.textareaRef,
                  } as const);

        return (
            <div className={styles['edit-container']}>
                <EditableField {...(fieldProps as EditableFieldProps)} />
                {state.validationError ? <ErrorMessage message={state.validationError} /> : null}
            </div>
        );
    }

    const contentElement = (
        <Component className={combineClassNames(className, styles.type)}>{content || placeholder}</Component>
    );

    return (
        <Button
            aria-label={ariaLabel}
            className={combineClassNames(styles.content, styles[type])}
            data-type={type}
            variant="secondary"
            onClick={handlers.handleContentClick}
            size="small"
        >
            {contentElement}
        </Button>
    );
};
