// represents the entire application state
import { DataState } from "../enum/data-state.enum";

export interface AppState<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
    // you can get either the data or error
}