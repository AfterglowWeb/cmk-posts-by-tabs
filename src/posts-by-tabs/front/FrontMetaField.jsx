import React, {useState, useEffect} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import MuiMultipleSelect from '../editor/MuiMultipleSelect';

export default function FrontMetaField (props) {
    const {field, index, onFilterChange, initialValues = [] } = props;
    const { options, label, placeholder, info, template } = field;
    const metaKey = options.metaKey.value;
    const metaOptions = options.metaKey.options || [];
    const [selectedValues, setSelectedValues] = useState(template === 'radio' ? '' : []);
    
    // Enable parent component communication
    useEffect(() => {
        // Notify parent component when selectedValues change
        if (onFilterChange) {
            onFilterChange(metaKey, selectedValues);
        }
    }, [selectedValues, metaKey, onFilterChange]);

    const handleFilterValues = (newValue) => {
        // Handle select differently - MuiMultipleSelect likely returns the full array of selected values
        if (template === 'select') {
            setSelectedValues(newValue);
            return;
        }
        
        if (template === 'radio') {
            // For radio, just use the single value
            setSelectedValues(newValue);
        } else {
            // For checkbox, toggle the selection
            const newSelectedValues = [...selectedValues];
            const valueIndex = newSelectedValues.indexOf(newValue);
            
            if (valueIndex === -1) {
                newSelectedValues.push(newValue);
            } else {
                newSelectedValues.splice(valueIndex, 1);
            }
            setSelectedValues(newSelectedValues);
        }
    };
    
    switch (template) {
        case 'select':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                    <MuiMultipleSelect                    
                        values={metaOptions}
                        selectedValues={selectedValues}
                        label={label}
                        // Pass the full array directly from the select component
                        onChange={(newValues) => setSelectedValues(newValues)}
                    />
                </Tooltip>
            );
            
        case 'radio':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                    <FormControl variant="standard" key={`meta-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            value={selectedValues || ''}
                            onChange={(e) => handleFilterValues(e.target.value)}
                        >
                            <FormControlLabel 
                                value="" 
                                control={<Radio />} 
                                label={placeholder || 'All'} 
                            />
                            {metaOptions.map(option => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio />} 
                                    label={option.label} 
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Tooltip>
            );
            
        case 'checkbox':
        default:
            return (
                <Tooltip title={info || ''} arrow placement="top">
                <FormControl variant="standard" key={`meta-${index}`} component="fieldset" margin="normal">
                    <Typography variant="subtitle1">{label}</Typography>
                    <FormGroup>
                        {metaOptions.map(option => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox 
                                        checked={selectedValues.includes(option.value)}
                                        onChange={() => handleFilterValues(option.value)}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                </Tooltip>
            );
    }
}