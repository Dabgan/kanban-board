import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { BoardData } from '@/types/board';
import { isBoardData } from '@/types/board';

const JSON_STORAGE_PATH = path.join(process.cwd(), 'src/data/db.json');

export const readBoardData = async (): Promise<BoardData> => {
    const rawData = await fs.readFile(JSON_STORAGE_PATH, 'utf8');
    const parsedData = JSON.parse(rawData);

    if (!isBoardData(parsedData)) {
        throw new Error('Invalid data structure in db.json');
    }

    return parsedData;
};

export const writeBoardData = async (boardData: BoardData): Promise<void> => {
    await fs.writeFile(JSON_STORAGE_PATH, JSON.stringify(boardData, null, 2));
};
