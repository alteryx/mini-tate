// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { TImgRatio } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCurrentImg = (): TImgRatio => {
  const [imgRect, setImgRect] = useState({ height: 0, width: 0 });
  useEffect(() => {
    const resizeListener = () => {
      let newImgRect = { height: 0, width: 0 };
      const annoImg = document.getElementById('anno-img')
      if (annoImg) {
        const { height, width } = annoImg.getBoundingClientRect();
        newImgRect = { height, width };
      }
      setImgRect(newImgRect);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);
  return imgRect;
};
