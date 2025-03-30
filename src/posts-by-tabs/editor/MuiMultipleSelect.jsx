import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
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
  const { 
    terms = [], 
    selectedTerms = [], 
    onChange,
    label = __('Select terms')
  } = props;
  
  const [selectedValues, setSelectedValues] = useState(selectedTerms);


  useEffect(() => {
    setSelectedValues(selectedTerms);
  }, [selectedTerms]);

  const handleChange = (event) => {
    const newSelectedValues = event.target.value;
    setSelectedValues(newSelectedValues);

    if (onChange) {
      onChange(newSelectedValues);
    }
  };

  const getTermLabel = (termId) => {
    const term = terms.find(t => t.value === termId);
    return term ? term.label : termId;
  };

  const theme = useTheme();

  function getStyles(termId, selectedValues, theme) {
    return {
      fontWeight:
        selectedValues.indexOf(termId) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const id = crypto.randomUUID();

  return (
    <div className="mb-4">
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id={`${id}-label`} size='small'>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          size="small"
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-terms" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={getTermLabel(value)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {terms.map((term) => (
            <MenuItem
              key={term.value}
              value={term.value}
              style={getStyles(term.value, selectedValues, theme)}
            >
              {term.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}