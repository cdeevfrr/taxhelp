export interface Lot {
    id: string,
    date: string, // ISO string, or usually, yyyy-mm-dd
    amount: number,
    costBasis: number,
}

export type FilingStatus = 'single' | 'married'