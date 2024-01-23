export type Layout = {
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface Command {
    domain: string;
    service: string;
    data: any;
    entityId: string;
}