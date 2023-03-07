// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { CSSProperties } from 'react';

export type TAnnotation = {
  height: string;
  width: string;
  top: string;
  left: string;
  name: string;
  type: string | null;
};

export const corner = {
  TOP_LEFT: 'TL',
  BOTTOM_LEFT: 'BL',
  TOP_RIGHT: 'TR',
  BOTTOM_RIGHT: 'BR',
} as const;

export type TAnnotationRaw = {
  name: string;
  type: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TImgRatio = {
  height: number;
  width: number;
};

export type TLabels = {
  nameLabel?: string;
  typeLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
};

export type TOptions = {
  annoStyles?: Partial<CSSProperties>;
  editStyles?: Partial<CSSProperties>;
  labels?: TLabels;
  imgStyles?: Partial<CSSProperties>;
};

export const errorTypes = {
  BLANK: 'BLANK_NAME',
  DUPLICATE: 'DUPLICATE_NAME',
} as const;
