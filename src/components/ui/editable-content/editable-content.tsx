'use client';

import { type ReactElement } from 'react';

import { Button } from '@/components/ui/button/button';
import { ErrorMessage } from '@/components/ui/error-message/error-message';
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

const getComponent = (type: ContentType): keyof JSX.IntrinsicElements => {
    switch (type) {
        case 'title':
            return 'h2';
        case 'card-title':
            return 'h1';
        default:
            return 'p';
    }
};

const getFieldConfig = (type: ContentType): FieldConfig => ({
    fieldType: type.includes('title') ? 'input' : 'textarea',
    Component: getComponent(type),
    className: type === 'title' ? undefined : styles['description-content'],
});

export const EditableContent = ({
    content,
    onUpdate,
    ariaLabel,
    type,
    operation,
    placeholder,
}: EditableContentProps): ReactElement => {
    const { state, handlers, refs } = useEditableContent(content, onUpdate, type, operation);
    const { fieldType, Component, className } = getFieldConfig(type);

    if (state.isEditing) {
        const commonFieldProps = {
            ariaLabel,
            value: state.currentContent,
            hasError: Boolean(state.validationError),
            placeholder,
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
            className={styles[type]}
            data-type={type}
            size="small"
            variant="secondary"
            onClick={handlers.handleContentClick}
        >
            {contentElement}
        </Button>
    );
};
