import { type ChangeEvent, forwardRef, useState } from 'react';
import { hasSpecialCharacters } from '@/utils/sanitization';
import { combineClassNames } from '@/utils/style-utils';
import { ErrorMessage } from '@/components/ui/error-message/error-message';
import type { InputProps, ValidationState } from '@/types/input';

import styles from './input.module.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 'aria-label': ariaLabel, className = '', error, id, onChange, onBlur, type = 'text', ...props }, ref) => {
        const [validationState, setValidationState] = useState<ValidationState>({
            error: null,
            isValid: true,
        });

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            const hasInvalidChars = hasSpecialCharacters(inputValue);

            const newValidationState: ValidationState = {
                error: hasInvalidChars ? 'Special characters are not allowed' : null,
                isValid: !hasInvalidChars,
            };

            setValidationState(newValidationState);

            onChange?.({
                ...event,
                target: {
                    ...event.target,
                    validity: {
                        ...event.target.validity,
                        valid: newValidationState.isValid,
                    },
                },
            });
        };

        const inputClassName = combineClassNames(
            styles.input,
            (error ?? validationState.error) ? styles.error : '',
            className,
        );

        const errorMessage = error ?? validationState.error;

        return (
            <div role="group" aria-labelledby={id ? `${id}-label` : undefined}>
                <input
                    ref={ref}
                    aria-invalid={Boolean(errorMessage)}
                    aria-label={ariaLabel}
                    className={inputClassName}
                    id={id}
                    onChange={handleChange}
                    onBlur={onBlur}
                    type={type}
                    {...props}
                />
                {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>
        );
    },
);

Input.displayName = 'Input';
