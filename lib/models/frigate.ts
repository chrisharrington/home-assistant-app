export type FrigateEvent = {
    id: string;
    start_time: number;
    end_time: number;
    label: string;
    thumbnail: string;
    camera: string;
    zones: string[];
}

export type FrigateSummary = {
    camera: string;
    count: number;
    day: string;
    label: string;
    zones: string[];
}