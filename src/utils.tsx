// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { TAnnotation, TAnnotationRaw } from './types';

export const pixelToNum = (pixelStr) =>
  +pixelStr.substring(0, pixelStr.length - 2);

export const rawToCSSAnno = (
  rawAnnos: TAnnotationRaw[],
  imgHeight: number,
  imgWidth: number
): TAnnotation[] =>
  rawAnnos.map((anno: TAnnotationRaw) => ({
    left: `${anno.x * imgWidth}px`,
    top: `${anno.y * imgHeight}px`,
    width: `${anno.w * imgWidth}px`,
    height: `${anno.h * imgHeight}px`,
    name: anno.name,
    type: anno.type,
  }));

export const cssToRawAnno = (
  cssAnnos: TAnnotation[],
  imgHeight: number,
  imgWidth: number
): TAnnotationRaw[] =>
  cssAnnos.map((anno: TAnnotation) => ({
    x: pixelToNum(anno.left) / imgWidth,
    y: pixelToNum(anno.top) / imgHeight,
    w: pixelToNum(anno.width) / imgWidth,
    h: pixelToNum(anno.height) / imgHeight,
    name: anno.name,
    type: anno.type,
  }));
