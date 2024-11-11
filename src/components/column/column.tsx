'use client';

import { Droppable } from '@hello-pangea/dnd';
import { useCallback, useRef, useState } from 'react';

import { Card } from '@/components/card/card';
import { Button } from '@/components/ui/button/button';
import { DeleteButton } from '@/components/ui/delete-button/delete-button';
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
                <DeleteButton label={`Delete ${column.title} column`} onClick={handleDelete} />
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
