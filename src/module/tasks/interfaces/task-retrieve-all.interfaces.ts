export declare interface TaskRetrieveAllResponse {
    id: number;
    title: string;
    description: string;
    order: number;
    status: string;
    estimate: number;
    createdAt: Date;
    deletedAt?: Date | null;
}

