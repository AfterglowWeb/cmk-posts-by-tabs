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

export default function MuiMultipleSelect(props) {
  const theme = useTheme();
  const { values, selectedValues = [], label, onChange } = props;

  // Ensure selectedValues is always an array
  const normalizedSelectedValues = Array.isArray(selectedValues) ? selectedValues : [selectedValues].filter(Boolean);
  
  // Function to check if a value is selected, handling different types
  const isValueSelected = (itemValue) => {
    return normalizedSelectedValues.some(selectedValue => 
      // Handle both string and number comparison
      String(selectedValue) === String(itemValue)
    );
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (onChange) {
      onChange(value);
    }
  };

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
              // Use string comparison to match values reliably
              const selectedItem = values.find(item => String(item.value) === String(value));
              return (
                <Chip key={value} label={selectedItem ? selectedItem.label : value} />
              );
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {values.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={{
              fontWeight: isValueSelected(item.value)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}