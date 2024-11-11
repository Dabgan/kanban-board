'use client';

import { Droppable } from '@hello-pangea/dnd';
import { useCallback } from 'react';

import { Card } from '@/components/card/card';
import { AddItemButton } from '@/components/ui/add-item-button/add-item-button';
import { DeleteButton } from '@/components/ui/delete-button/delete-button';
import { EditableTitle } from '@/components/ui/editable-title/editable-title';
import { useCards } from '@/hooks/use-cards';
import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column as ColumnType } from '@/types/column';

import styles from './column.module.scss';

type ColumnProps = {
    column: ColumnType;
};

export const Column = ({ column }: ColumnProps) => {
    const { updateColumn, deleteColumn } = useColumns();
    const { addCard } = useCards();
    const {
        state: { cards },
    } = useCards();

    const sortedColumnCards = cards
        .filter((boardCard) => boardCard.columnId === column.id)
        .sort((firstCard, secondCard) => firstCard.order - secondCard.order);

    const handleUpdateTitle = useCallback(
        async (newTitle: string) => {
            await updateColumn(column.id, {
                ...column,
                title: newTitle,
            });
        },
        [column, updateColumn],
    );

    const handleDelete = useCallback(async () => {
        await deleteColumn(column.id);
    }, [column.id, deleteColumn]);

    const handleAddCard = useCallback(
        async (title: string) => {
            await addCard({
                id: generateId('card'),
                title,
                description: '',
                columnId: column.id,
            });
        },
        [addCard, column.id],
    );

    return (
        <article aria-label={`Column: ${column.title}`} className={styles.column}>
            <div className={styles['title-bar']}>
                <EditableTitle
                    title={column.title}
                    onUpdate={handleUpdateTitle}
                    tag="h2"
                    ariaLabel={`Edit ${column.title} column title`}
                />
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
            <AddItemButton
                onAdd={handleAddCard}
                buttonText="Add Card"
                placeholder="Enter card title..."
                buttonAriaLabel={`Add new card to ${column.title} column`}
                inputAriaLabel={`New card title for ${column.title} column`}
            />
        </article>
    );
};
