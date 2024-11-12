'use client';

import { DroppableColumn } from '@/components/column/droppable-column';
import { AddItemButton } from '@/components/ui/add-item-button/add-item-button';
import { DeleteButton } from '@/components/ui/delete-button/delete-button';
import { EditableContent } from '@/components/ui/editable-content/editable-content';
import { useColumnOperations } from '@/hooks/use-column-operations';
import type { Card } from '@/types/card';
import type { Column as ColumnType } from '@/types/column';
import { combineClassNames } from '@/utils/style-utils';

import styles from './column.module.scss';

type ColumnProps = {
    column: ColumnType;
    cards: Card[];
};

export const Column = ({ column, cards }: ColumnProps) => {
    const { handleUpdateTitle, handleDelete, handleAddCard } = useColumnOperations(column);

    return (
        <article aria-label={`Column: ${column.title}`} className={combineClassNames(styles.column, styles.draggable)}>
            <div className={styles['title-bar']}>
                <EditableContent
                    ariaLabel={`Edit ${column.title} column title`}
                    content={column.title}
                    tag="h2"
                    type="title"
                    onUpdate={handleUpdateTitle}
                />
                <DeleteButton label={`Delete ${column.title} column`} onClick={handleDelete} />
            </div>
            <DroppableColumn cards={cards} columnId={column.id} columnTitle={column.title} />
            <AddItemButton
                buttonAriaLabel={`Add new card to ${column.title} column`}
                buttonText="Add Card"
                inputAriaLabel={`New card title for ${column.title} column`}
                placeholder="Enter card title..."
                onAdd={handleAddCard}
            />
        </article>
    );
};
