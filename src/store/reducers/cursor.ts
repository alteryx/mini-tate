// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export interface ICursorState {
  coords: number[];
}

const initialState: ICursorState = {
  coords: [],
};

export const cursorSlice = createSlice({
  name: 'cursor',
  initialState,
  reducers: {
    setCoords: (state, action: PayloadAction<number[]>) => {
      state.coords = action.payload;
    },
  },
});

export const { setCoords } = cursorSlice.actions;

export const selectCursor = (state: RootState) => state.cursor;

export default cursorSlice.reducer;
