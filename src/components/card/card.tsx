'use client';

import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

import type { CardComponentProps } from '@/types/card';

import styles from './card.module.scss';

export const Card = ({ card, index }: CardComponentProps) => (
    <Draggable draggableId={card.id} index={index}>
        {(dragHandleProps) => (
            <div
                ref={dragHandleProps.innerRef}
                className={styles.card}
                {...dragHandleProps.draggableProps}
                {...dragHandleProps.dragHandleProps}
            >
                <Link href={`/card/${card.id}`} className={styles.link}>
                    <h3 className={styles.title}>{card.title}</h3>
                </Link>
            </div>
        )}
    </Draggable>
);
