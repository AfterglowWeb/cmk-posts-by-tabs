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
    
    if (onChange) {
      onChange(newValues);
    }
  };

  // Ensure values is always an array and IDs are strings for consistent comparison
  const normalizedSelectedValues = selectedValues ? 
    (Array.isArray(selectedValues) ? selectedValues : [selectedValues]) : 
    [];

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
              const selectedItem = values.find(item => item.value === value);
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
            style={getStyles(item.value, normalizedSelectedValues, theme)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}