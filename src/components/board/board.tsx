'use client';

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';

import { Column } from '@/components/column/column';
import { AddItemButton } from '@/components/ui/add-item-button/add-item-button';
import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column as ColumnType } from '@/types/column';

import styles from './board.module.scss';

export const Board = () => {
    const {
        state: { columns },
        addColumn,
    } = useColumns();

    const handleAddColumn = useCallback(
        async (title: string) => {
            const newColumn: Omit<ColumnType, 'order'> = {
                cardIds: [],
                id: generateId('col'),
                title,
            };

            await addColumn(newColumn);
        },
        [addColumn],
    );

    const handleDragEnd = useCallback((_result: DropResult) => {
        // Will be implemented later
    }, []);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <main className={styles.board} role="main">
                <h1 className="visually-hidden">Kanban Board</h1>
                <section aria-label="Kanban board columns" className={styles.columns}>
                    {columns.map((column) => (
                        <Column key={column.id} column={column} />
                    ))}
                    <AddItemButton
                        onAdd={handleAddColumn}
                        buttonText="Add Column"
                        placeholder="Enter column title..."
                        buttonAriaLabel="Add new column to board"
                        inputAriaLabel="New column title"
                    />
                </section>
            </main>
        </DragDropContext>
    );
};
