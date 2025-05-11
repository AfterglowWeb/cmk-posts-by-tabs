import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(value, selectedValues, theme) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MuiMultipleSelect(props) {
  const theme = useTheme();
  const { values, selectedValues = [], label, onChange } = props;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Handle both string and array values
    const newValues = typeof value === 'string' ? value.split(',') : value;
    
    // Convert string numbers to actual numbers to maintain consistency
    const normalizedValues = newValues.map(val => 
      typeof val === 'string' && !isNaN(val) ? parseInt(val, 10) : val
    );
    
    if (onChange) {
      onChange(normalizedValues);
    }
  };

  // Normalize selected values to ensure consistent comparison
  const normalizedSelectedValues = (selectedValues || []).map(val => 
    typeof val === 'string' && !isNaN(val) ? parseInt(val, 10) : val
  );

  return (
    <FormControl variant="standard" fullWidth margin="normal" sx={{
        '& .MuiInputBase-root': {
          'border': 'unset'
      }}}>
      <InputLabel
      variant='standard'
      id="multiple-chip-label"
      >{label}</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        variant='standard'
        value={normalizedSelectedValues}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              // Use loose equality (==) to match string and number values
              const selectedItem = values.find(item => item.value == value);
              return (
                <Chip key={value} label={selectedItem ? selectedItem.label : value} />
              );
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {values.map((item) => {
          // Convert item.value to a number if it's a numeric string
          const normalizedValue = 
            typeof item.value === 'string' && !isNaN(item.value) 
              ? parseInt(item.value, 10) 
              : item.value;
              
          return (
            <MenuItem
              key={item.value}
              value={normalizedValue}
              style={getStyles(normalizedValue, normalizedSelectedValues, theme)}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}