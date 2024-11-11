'use client';

import { DroppableColumn } from '@/components/column/droppable-column';
import { AddItemButton } from '@/components/ui/add-item-button/add-item-button';
import { DeleteButton } from '@/components/ui/delete-button/delete-button';
import { EditableTitle } from '@/components/ui/editable-title/editable-title';
import { useColumnOperations } from '@/hooks/use-column-operations';
import type { Card } from '@/types/card';
import type { Column as ColumnType } from '@/types/column';

import styles from './column.module.scss';

type ColumnProps = {
    column: ColumnType;
    cards: Card[];
};

export const Column = ({ column, cards }: ColumnProps) => {
    const { handleUpdateTitle, handleDelete, handleAddCard } = useColumnOperations(column);

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
            <DroppableColumn columnId={column.id} columnTitle={column.title} cards={cards} />
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
