'use client';

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Column } from '@/components/column/column';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { useColumns } from '@/hooks/use-columns';
import { generateId } from '@/lib/utils';
import type { Column as ColumnType } from '@/types/column';

import styles from './board.module.scss';

export const Board = () => {
    const {
        state: { columns },
        addColumn,
    } = useColumns();
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddingColumn && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingColumn]);

    const handleAddColumn = useCallback(async () => {
        if (!newColumnTitle.trim()) {
            setIsAddingColumn(false);
            setNewColumnTitle('');
            return;
        }

        const newColumn: Omit<ColumnType, 'order'> = {
            cardIds: [],
            id: generateId('col'),
            title: newColumnTitle.trim(),
        };

        await addColumn(newColumn);
        setIsAddingColumn(false);
        setNewColumnTitle('');
    }, [addColumn, newColumnTitle]);

    const handleKeyDown = useCallback(
        async (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                await handleAddColumn();
            }
            if (e.key === 'Escape') {
                setIsAddingColumn(false);
                setNewColumnTitle('');
            }
        },
        [handleAddColumn],
    );

    const handleDragEnd = useCallback((_result: DropResult) => {
        // Will be implemented later
    }, []);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <main className={styles.board} role="main">
                <section aria-label="Kanban board columns" className={styles.columns}>
                    {columns.map((column) => (
                        <Column key={column.id} column={column} />
                    ))}
                    {isAddingColumn ? (
                        <div className={styles['new-column']}>
                            <Input
                                ref={inputRef}
                                aria-label="New column title"
                                className={styles.input}
                                placeholder="Enter column title..."
                                value={newColumnTitle}
                                onBlur={handleAddColumn}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    ) : (
                        <Button
                            aria-label="Add new column"
                            onClick={() => setIsAddingColumn(true)}
                            variant="primary"
                            className={styles['add-column-button']}
                        >
                            Add Column
                        </Button>
                    )}
                </section>
            </main>
        </DragDropContext>
    );
};
