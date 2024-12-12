import React, { useState } from 'react';
import { RainfallIntensitySelectorWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';

interface RainfallIntensitySelectorProps {
  value: any;
  onChange: (value: any) => void;
  options: { label: string; value: string | number }[];
}

/**
 * 年份选择器
 * @param props
 * @constructor
 */
function RainfallIntensitySelector(props: RainfallIntensitySelectorProps) {
  const { value, onChange, options } = props;
  return (
    <RainfallIntensitySelectorWrapper>
      {options.map((v, i) => {
        return (
          <div
            key={i}
            className={`selector-item ${value === v.value ? 'selected' : ''}`}
            onClick={() => onChange(v.value)}>
            {v.label}
          </div>
        );
      })}
    </RainfallIntensitySelectorWrapper>
  );
}

export default RainfallIntensitySelector;
