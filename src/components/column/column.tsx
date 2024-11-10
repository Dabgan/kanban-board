'use client';

import { Droppable } from '@hello-pangea/dnd';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { useColumns } from '@/hooks/use-columns';
import type { Column as ColumnType } from '@/types';
import styles from './column.module.scss';

type ColumnProps = {
    column: ColumnType;
};

export const Column = ({ column }: ColumnProps) => {
    const { updateColumn, deleteColumn } = useColumns();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEdit = useCallback(async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        if (title !== column.title) {
            await updateColumn(column.id, {
                ...column,
                title,
            });
        }

        setIsEditing(false);
    }, [column, title, updateColumn, isEditing]);

    const handleDelete = useCallback(async () => {
        await deleteColumn(column.id);
    }, [column.id, deleteColumn]);

    return (
        <article aria-label={`Column: ${column.title}`} className={styles.column}>
            <div className={styles.titleBar}>
                {isEditing ? (
                    <Input
                        ref={inputRef}
                        aria-label={`Edit column title: ${column.title}`}
                        className={styles.input}
                        onBlur={handleEdit}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                ) : (
                    <h2 className={styles.title}>{column.title}</h2>
                )}
                <div aria-label="Column actions" className={styles.actions} role="group">
                    <Button
                        aria-label={isEditing ? 'Save column title' : 'Edit column title'}
                        onClick={handleEdit}
                        size="small"
                        variant="secondary"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>
                    <Button
                        aria-label={`Delete column: ${column.title}`}
                        onClick={handleDelete}
                        size="small"
                        variant="secondary"
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        aria-label={`Cards in ${column.title}`}
                        className={styles.content}
                        {...provided.droppableProps}
                    >
                        {/* Cards will go here */}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Button aria-label={`Add card to ${column.title}`} className={styles['add-card']} variant="primary">
                Add Card
            </Button>
        </article>
    );
};
