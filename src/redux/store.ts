import { configureStore } from '@reduxjs/toolkit';
import readingListReducer from './readingListSlice';

const store = configureStore({
    reducer: {
        readingList: readingListReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
