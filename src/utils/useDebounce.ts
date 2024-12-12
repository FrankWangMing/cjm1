/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 自定义防抖hook
 */
import { DependencyList, useEffect, useRef } from 'react';

const useDebounce = (
  fn: Function,
  ms = 30,
  deps: DependencyList | undefined[] = []
) => {
  let timeout = useRef<null | any>(null);
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      fn();
    }, ms);
  }, deps);

  const cancel = () => {
    clearTimeout(timeout.current);
    // timeout = null;
  };
  return [cancel];
};

export default useDebounce;
