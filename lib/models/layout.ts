export interface Area {
    name: string;
    rooms: Room[];
}

export interface Room {
    name: string;
    icon: string;
    entities: string[];
}