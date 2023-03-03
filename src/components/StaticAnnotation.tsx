// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import React, { useState } from 'react';
import { pixelToNum } from '../utils';

import { TOptions } from '../types';

export type Props = {
  top: string;
  left: string;
  height: string;
  width: string;
  onClick: () => void;
  options: TOptions;
  name: string;
};

function StaticAnnotation({
  height,
  width,
  top,
  left,
  onClick,
  options,
  name,
}: Props) {
  const styles = options.annoStyles || {};
  const [showName, setShowName] = useState<boolean>(false);

  const calculateTooltipPosition = () => {
    console.log(pixelToNum(width) / 2);
    const leftCoord = pixelToNum(width) / 2 - 100;
    if (leftCoord < pixelToNum(left)) return left;
    return `${leftCoord}px`;
  };

  return (
    <div
      className="staticAnno"
      data-testid="static-annotation"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ ...styles, height, width, top, left }}
      onMouseEnter={() => setShowName(true)}
      onMouseLeave={() => setShowName(false)}
    >
      {showName && (
        <h3
          className="annotationNameHover"
          style={{
            top: `${pixelToNum(height) - 10}px`,
            left: calculateTooltipPosition(),
          }}
        >
          {name}
        </h3>
      )}
    </div>
  );
}

export default StaticAnnotation;
