// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TAnnotation } from '../../types';
import type { RootState } from '../store';

export interface ICurrAnnoState {
  selectedAnno: TAnnotation | null;
  selectedCorner: string;
  updatedCoords: {
    width?: string;
    height?: string;
    top?: string;
    left?: string;
  };
}

const initialState: ICurrAnnoState = {
  selectedAnno: null,
  selectedCorner: '',
  updatedCoords: {},
};

export const currAnnoSlice = createSlice({
  name: 'currAnno',
  initialState,
  reducers: {
    setSelectedAnno: (state, action: PayloadAction<TAnnotation>) => {
      state.selectedAnno = action.payload;
      state.updatedCoords = {
        width: action.payload.width,
        height: action.payload.height,
        top: action.payload.top,
        left: action.payload.left,
      };
    },
    clearSelectedAnno: (state) => {
      state.selectedAnno = null;
      state.updatedCoords = {};
    },
    setSelectedCorner: (state, action: PayloadAction<string>) => {
      state.selectedCorner = action.payload;
    },
    setWidth: (state, action: PayloadAction<string>) => {
      state.updatedCoords.width = action.payload;
    },
    setHeight: (state, action: PayloadAction<string>) => {
      state.updatedCoords.height = action.payload;
    },
    setTop: (state, action: PayloadAction<string>) => {
      state.updatedCoords.top = action.payload;
    },
    setLeft: (state, action: PayloadAction<string>) => {
      state.updatedCoords.left = action.payload;
    },
  },
});

export const {
  setSelectedAnno,
  setSelectedCorner,
  setWidth,
  setHeight,
  setTop,
  setLeft,
  clearSelectedAnno,
} = currAnnoSlice.actions;

export const selectCurrAnno = (state: RootState) => state.currAnno;

export default currAnnoSlice.reducer;
