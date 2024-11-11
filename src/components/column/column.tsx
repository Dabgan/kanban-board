'use client';

import { Droppable } from '@hello-pangea/dnd';
import { useCallback, useRef, useState } from 'react';

import { Card } from '@/components/card/card';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { useCards } from '@/hooks/use-cards';
import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column as ColumnType } from '@/types/column';

import styles from './column.module.scss';

type ColumnComponentProps = {
    column: ColumnType;
};

export const Column = ({ column }: ColumnComponentProps) => {
    const { updateColumn, deleteColumn } = useColumns();
    const { addCard } = useCards();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [columnTitle, setColumnTitle] = useState(column.title);
    const [newCardTitle, setNewCardTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const cardInputRef = useRef<HTMLInputElement>(null);
    const {
        state: { cards },
    } = useCards();

    const sortedColumnCards = cards
        .filter((boardCard) => boardCard.columnId === column.id)
        .sort((firstCard, secondCard) => firstCard.order - secondCard.order);

    const handleEdit = useCallback(async () => {
        if (columnTitle !== column.title) {
            await updateColumn(column.id, {
                ...column,
                title: columnTitle,
            });
        }
        setIsEditing(false);
    }, [column, columnTitle, updateColumn]);

    const handleDelete = useCallback(async () => {
        await deleteColumn(column.id);
    }, [column.id, deleteColumn]);

    const handleAddCard = useCallback(async () => {
        const trimmedTitle = newCardTitle.trim();
        if (!trimmedTitle) {
            setIsAddingCard(false);
            setNewCardTitle('');
            return;
        }

        await addCard({
            id: generateId('card'),
            title: trimmedTitle,
            description: '',
            columnId: column.id,
        });

        setNewCardTitle('');
        setIsAddingCard(false);
    }, [addCard, column.id, newCardTitle]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (isEditing) {
                    await handleEdit();
                } else {
                    await handleAddCard();
                }
            }
            if (event.key === 'Escape') {
                if (isEditing) {
                    setIsEditing(false);
                    setColumnTitle(column.title);
                } else {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                }
            }
        },
        [handleEdit, handleAddCard, isEditing, column.title],
    );

    const handleStartAddingCard = useCallback(() => {
        setIsAddingCard(true);
        // Focus the input after it's rendered
        setTimeout(() => cardInputRef.current?.focus(), 0);
    }, []);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        setColumnTitle(column.title); // Reset to original title if not saved
    }, [column.title]);

    const handleTitleClick = useCallback(() => {
        setIsEditing(true);
        // Focus the input after it's rendered
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    return (
        <article aria-label={`Column: ${column.title}`} className={styles.column}>
            <div className={styles['title-bar']}>
                {isEditing ? (
                    <div className={styles['edit-container']}>
                        <Input
                            ref={inputRef}
                            aria-label={`Edit column title: ${column.title}`}
                            className={styles.input}
                            value={columnTitle}
                            onBlur={handleBlur}
                            onChange={(event) => setColumnTitle(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                ) : (
                    <button
                        className={styles.title}
                        onClick={handleTitleClick}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                handleTitleClick();
                            }
                        }}
                        type="button"
                        aria-label={`Edit ${column.title} column title`}
                    >
                        <h2>{column.title}</h2>
                    </button>
                )}
                <button
                    className={styles['delete-button']}
                    onClick={handleDelete}
                    aria-label={`Delete ${column.title} column`}
                    type="button"
                >
                    <span className={styles['visually-hidden']}>Delete column</span>
                    <svg
                        aria-hidden="true"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 2H10V1C10 0.4 9.6 0 9 0H5C4.4 0 4 0.4 4 1V2H1C0.4 2 0 2.4 0 3C0 3.6 0.4 4 1 4H13C13.6 4 14 3.6 14 3C14 2.4 13.6 2 13 2ZM5 1H9V2H5V1Z"
                            fill="currentColor"
                        />
                        <path
                            d="M2 14C2 15.1 2.9 16 4 16H10C11.1 16 12 15.1 12 14V4H2V14ZM5 7H9C9.6 7 10 7.4 10 8C10 8.6 9.6 9 9 9H5C4.4 9 4 8.6 4 8C4 7.4 4.4 7 5 7Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </div>
            <Droppable droppableId={column.id}>
                {(dropProvided) => (
                    <div
                        ref={dropProvided.innerRef}
                        aria-label={`Cards in ${column.title}`}
                        className={styles.content}
                        {...dropProvided.droppableProps}
                    >
                        {sortedColumnCards.map((boardCard, cardIndex) => (
                            <Card key={boardCard.id} card={boardCard} index={cardIndex} />
                        ))}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>
            {isAddingCard ? (
                <div className={styles['new-card']}>
                    <Input
                        ref={cardInputRef}
                        aria-label={`Add new card to ${column.title}`}
                        placeholder="Enter card title..."
                        value={newCardTitle}
                        onBlur={handleAddCard}
                        onChange={(event) => setNewCardTitle(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            ) : (
                <Button
                    aria-label={`Add card to ${column.title}`}
                    className={styles['add-card']}
                    variant="primary"
                    onClick={handleStartAddingCard}
                >
                    Add Card
                </Button>
            )}
        </article>
    );
};
