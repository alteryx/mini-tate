// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export interface IModeState {
  edit: boolean;
  drag: boolean;
  cornerDrag: boolean;
}

const initialState: IModeState = {
  edit: false,
  drag: false,
  cornerDrag: false,
};

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setEdit: (state, action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
    setDrag: (state, action: PayloadAction<boolean>) => {
      state.drag = action.payload;
    },
    setCornerDrag: (state, action: PayloadAction<boolean>) => {
      state.cornerDrag = action.payload;
    },
  },
});

export const { setEdit, setDrag, setCornerDrag } = modeSlice.actions;

export const selectMode = (state: RootState) => state.mode;

export default modeSlice.reducer;
