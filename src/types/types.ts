export interface Note {
    id: number,
    name: string,
    content: string,
    isDone: boolean,
    date: string,
    columnId: number,
    column: Column
}
export interface Column {
    id: number,
    name: string,
    notes: Note[],
    boardId: number,
    board: Workspace
}
export interface Workspace {
    id: number,
    name: string,
    userId: number,
    user: User,
    columns: Column[]
}
export interface User {
    id: number,
    username: string,
    password: string,
    boards: Workspace[]
}