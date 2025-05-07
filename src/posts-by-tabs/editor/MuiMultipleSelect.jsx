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
    values = [], 
    selectedValues = [], 
    onChange,
    label = __('Select values')
  } = props;
  
  const handleChange = (event) => {

    if (onChange) {
      onChange(event.target.value);
    }
  };

  const getValueLabel = (valueId) => {
    const term = values.find(t => t.value === valueId);
    return term ? term.label : valueId;
  };

  const theme = useTheme();

  function getStyles(valueId, selectedValues, theme) {
    return {
      fontWeight:
        selectedValues.indexOf(valueId) === -1
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
          input={<OutlinedInput id="select-multiple-values" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={getValueLabel(value)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {values.map((value) => (
            <MenuItem
              key={value.value}
              value={value.value}
              style={getStyles(value.value, selectedValues, theme)}
            >
              {value.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}