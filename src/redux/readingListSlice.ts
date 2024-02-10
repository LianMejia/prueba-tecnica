import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Book {
    title: string;
    pages: number;
    genre: string;
    cover: string;
    synopsis: string;
    year: number;
    ISBN: string;
    author: {
        name: string;
        otherBooks: string[];
    };
}

// Definimos una interfaz para el estado persistente
interface PersistentState {
    // Array para realizar un tacking de los libros seleccionados
    selectedBooks: string[];
    // Almacenamos la url de la imagen del libro para usarla al recargar la pagina
    cachedImages: Record<string, string>;
}

// Obtenemos el estado persistente del almacenamiento local del navegador
const persistedStateJSON = localStorage.getItem('readingListState');
const persistedState: PersistentState = persistedStateJSON ? JSON.parse(persistedStateJSON) : { selectedBooks: [], cachedImages: {} };

interface ReadingListState {
    selectedBooks: string[];
    // Almacenamos las URL de las imagenes en un objeto
    cachedImages: Record<string, string>;
}

const initialState: ReadingListState = {
    selectedBooks: persistedState.selectedBooks,
    cachedImages: persistedState.cachedImages,
};

export const readingListSlice = createSlice({
    name: 'readingList',
    initialState,
    reducers: {
        addToReadingList: (state, action: PayloadAction<Book>) => {
            // Agregamos el título del libro seleccionado a los demas previamente seleccionados
            state.selectedBooks.push(action.payload.title);
            // Almacena la URL de la imagen dle libro seleccionado en la cache
            state.cachedImages[action.payload.title] = action.payload.cover;
            // Guardar el estado persistente en el almacenamiento local del navegador
            localStorage.setItem('readingListState', JSON.stringify({ selectedBooks: state.selectedBooks, cachedImages: state.cachedImages }));
        },
        removeFromReadingList: (state, action: PayloadAction<{ title: string }>) => {
            // Elimina el título del libro que hemos seleccionado
            state.selectedBooks = state.selectedBooks.filter(title => title !== action.payload.title);
            // Eliminamos la URL de la imagen del cache almacenado
            delete state.cachedImages[action.payload.title];
            // Guardamos el estado persistente en el almacenamiento local del navegador
            localStorage.setItem('readingListState', JSON.stringify({ selectedBooks: state.selectedBooks, cachedImages: state.cachedImages }));
        },
    },
});

export const { addToReadingList, removeFromReadingList } = readingListSlice.actions;

export const selectSelectedBooks = (state: RootState) => state.readingList.selectedBooks;
export const selectCachedImages = (state: RootState) => state.readingList.cachedImages;

export default readingListSlice.reducer;
