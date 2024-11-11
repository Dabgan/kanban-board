'use client';

import { DragDropContext } from '@hello-pangea/dnd';

import { Column } from '@/components/column/column';
import { AddItemButton } from '@/components/ui/add-item-button/add-item-button';
import { useBoardOperations } from '@/hooks/use-board-operations';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';

import styles from './board.module.scss';

export const Board = () => {
    const { columns, handleAddColumn } = useBoardOperations();
    const { handleDragEnd } = useDragAndDrop();

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
