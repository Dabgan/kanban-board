'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import { Column } from '@/components/column/column';
import { useBoardOperations } from '@/hooks/use-board-operations';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { getSortedColumnCards } from '@/utils/sorting-utils';

import { EditableContent } from '../ui/editable-content/editable-content';

import styles from './board.module.scss';

export const Board = () => {
    const { columns, handleAddColumn } = useBoardOperations();
    const { handleDragEnd, cards } = useDragAndDrop();

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <main className={styles.board} role="main">
                <h1 className="visually-hidden">Kanban Board</h1>
                <Droppable direction="horizontal" droppableId="board-columns" type="COLUMN">
                    {(provided) => (
                        <section
                            ref={provided.innerRef}
                            aria-label="Kanban board columns"
                            className={styles.columns}
                            {...provided.droppableProps}
                        >
                            {columns.map((column, index) => (
                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                    {(dragProvided, snapshot) => (
                                        <div
                                            ref={dragProvided.innerRef}
                                            className={styles['column-wrapper']}
                                            data-is-dragging={snapshot.isDragging}
                                            {...dragProvided.draggableProps}
                                            {...dragProvided.dragHandleProps}
                                        >
                                            <Column cards={getSortedColumnCards(cards, column.id)} column={column} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <EditableContent
                                ariaLabel="Add new column to board"
                                content="Add Column"
                                operation="add"
                                placeholder="Enter column title..."
                                type="title"
                                onUpdate={handleAddColumn}
                            />
                        </section>
                    )}
                </Droppable>
            </main>
        </DragDropContext>
    );
};
