import React from 'react';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function MuiSelect(props) {

  const { 
      options = [], 
      value = '', 
      onChange,
      label = __('Select')
  } = props;
    
  const [selectedValue, setSelectedValue] = useState(value);


  useEffect(() => {
    setSelectedValue(selectedValue);
  }, [selectedValue]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const id = crypto.randomUUID();

  return(
  <div className="mb-4">
    <FormControl fullWidth>
        <InputLabel 
        size='small'
        id={id}>{label}</InputLabel>
        <Select
        labelId={id}
        id={`select-${id}`}
        value={selectedValue}
        label={label}
        onChange={handleChange}
        size="small"
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
  </div>
  )
}