'use client';

import { DragDropContext } from '@hello-pangea/dnd';

import { Column } from '@/components/column/column';
import { useBoardOperations } from '@/hooks/use-board-operations';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { getSortedColumnCards } from '@/utils/sorting-utils';

import styles from './board.module.scss';
import { EditableContent } from '../ui/editable-content/editable-content';

export const Board = () => {
    const { columns, handleAddColumn } = useBoardOperations();
    const { handleDragEnd, cards } = useDragAndDrop();

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <main className={styles.board} role="main">
                <h1 className="visually-hidden">Kanban Board</h1>
                <section aria-label="Kanban board columns" className={styles.columns}>
                    {columns.map((column) => (
                        <Column key={column.id} cards={getSortedColumnCards(cards, column.id)} column={column} />
                    ))}

                    <EditableContent
                        ariaLabel="Add new column to board"
                        content="Add Column"
                        placeholder="Enter column title..."
                        type="title"
                        onUpdate={handleAddColumn}
                    />
                </section>
            </main>
        </DragDropContext>
    );
};
