// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './reducers/modes';
import currAnnoReducer from './reducers/currAnno';
import cursorReducer from './reducers/cursor';

export const store = configureStore({
  reducer: {
    mode: modeReducer,
    currAnno: currAnnoReducer,
    cursor: cursorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
