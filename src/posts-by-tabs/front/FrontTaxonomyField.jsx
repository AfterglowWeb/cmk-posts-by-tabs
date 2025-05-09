import React, {useState} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import MuiMultipleSelect from '../editor/MuiMultipleSelect';


export default function FrontTaxonomyField (props) {
    const {field, index } = props;
    const { options, label, placeholder, info, template } = field;
    const taxonomyKey = options.taxonomy.value;
    const terms = options.taxonomy.terms;
    const [selectedValues, setSelectedValues ] = useState([]);
    
    const handleFilterValues = (value) => {
        const newSelectedValues = [...selectedValues];
        const index = newSelectedValues.indexOf(value);
        if (index === -1) {
            newSelectedValues.push(value);
        } else {
            newSelectedValues.splice(index, 1);
        }
        setSelectedValues(newSelectedValues);
    }


    if(!terms || terms.length === 0) {
        return null;
    }

    switch (template) {
        case 'select':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                    <MuiMultipleSelect                    
                        values={terms.map(term => ({
                            value: term.value,
                            label: term.label
                        }))}
                        selectedValues={selectedValues}
                        label={label}
                        onChange={(newTerms) => {
                            handleFilterValues(newTerms)
                        }}
                    />
                </Tooltip>
            );
            
        case 'radio':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                <FormControl variant="standard" key={`tax-${index}`} component="fieldset" margin="normal">
                    <Typography variant="subtitle1">{label}</Typography>
                    <RadioGroup
                        value={Array.isArray(selectedValues) ? selectedValues[0] || '' : selectedValues || ''}
                        onChange={(e) => handleFilterValues(taxonomyKey, e.target.value)}
                    >
                        <FormControlLabel 
                            value="" 
                            control={<Radio size='small' />} 
                            label={placeholder || 'All'} 
                        />
                        {terms.map(term => (
                            <FormControlLabel 
                                key={term.value} 
                                value={term.value} 
                                control={<Radio />} 
                                label={term.label} 
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                </Tooltip>
            );
            
        case 'checkbox':
        case 'default':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                <FormControl variant="standard" key={`tax-${index}`} component="fieldset" margin="normal">
                    <Typography variant="subtitle1">{label}</Typography>
                    <FormGroup>
                        {terms.map(term => (
                            <FormControlLabel
                                key={term.value}
                                control={
                                    <Checkbox 
                                        checked={selectedValues.includes(term.value)}
                                        onChange={() => handleFilterValues(taxonomyKey, term.value)}
                                    />
                                }
                                label={term.label}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                </Tooltip>
            );
    }
}