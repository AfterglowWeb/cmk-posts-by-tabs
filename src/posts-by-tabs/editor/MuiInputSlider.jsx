import React from 'react';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

export default function MuiInputSlider(props) {

    const { 
          min = 0, 
          max = 100,
          step = 1, 
          value = 30,
          onChange,
          label = __('Select')
      } = props;

    const [currentValue, setValue] = useState(value);


    useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
        if (onChange) {
        onChange(event.target.value);
        }
    };

    const handleBlur = () => {
        if (currentValue < min) {
        setValue(min);
        } else if (currentValue > max) {
        setValue(max);
        }
    };

    const id = crypto.randomUUID();

    return (
        <div>
            <InputLabel size="small" sx={{mb:2}} id={id}>{label}</InputLabel>
            <div className="flex gap-2 items-center">
                <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby={id}
                color="primary"
                size={'small'}
                min={min}
                max={max}
                step={step}
                defaultValue={currentValue}
                valueLabelDisplay="auto"
                />
                <MuiInput
                value={currentValue}
                size={'small'}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                step: step,
                min: min,
                max: max,
                type: 'number',
                'aria-labelledby': {id},
                }}
                />
            </div>
        </div>
    );
}
