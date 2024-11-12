'use client';

import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

import type { CardComponentProps } from '@/types/card';

import styles from './card.module.scss';

export const Card = ({ card, index }: CardComponentProps) => (
    <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                aria-label={`${card.title} card`}
                className={styles.wrapper}
                role="button"
                tabIndex={0}
            >
                <Link
                    className={styles.card}
                    data-is-dragging={snapshot.isDragging}
                    href={`/card/${card.id}`}
                    onClick={(e) => {
                        if (snapshot.isDragging) {
                            e.preventDefault();
                        }
                    }}
                >
                    <h3 className={styles.title}>{card.title}</h3>
                </Link>
            </div>
        )}
    </Draggable>
);
