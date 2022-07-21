// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import React from 'react';

import { TOptions } from '../types';

export type Props = {
  top: string;
  left: string;
  height: string;
  width: string;
  onClick: () => void;
  options: TOptions;
};

function StaticAnnotation({
  height,
  width,
  top,
  left,
  onClick,
  options,
}: Props) {
  const styles = options.annoStyles || {};
  return (
    <div
      className="staticAnno"
      data-testid="static-annotation"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ ...styles, height, width, top, left }}
    />
  );
}

export default StaticAnnotation;
