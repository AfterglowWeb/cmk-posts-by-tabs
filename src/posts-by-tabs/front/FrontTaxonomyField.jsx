import {useState} from '@wordpress/element';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import MuiMultipleSelect from '../editor/MuiMultipleSelect';

function findTermById (taxonomyName, termId, attributesOptions) {
    
    if (!attributesOptions || !attributesOptions.taxonomies) {
        return null;
    }
    const taxonomy = attributesOptions.taxonomies.find(t => t.value === taxonomyName);

    if (taxonomy) {
        const terms = taxonomy.terms;
        if (terms) {
            const term = terms.find(t => t.value === termId);
            if (term) {
                return term
            }
        }
    }
    
    return null;
};

export default function FrontTaxonomyField (props) {
    const {field, index, attributesOptions } = props;
    const { options, label, placeholder, info, template } = field;
    const taxonomyKey = options.taxonomy.value;
    const [selectedValues, setSelectedValues ] = useState([]);

    if (!taxonomyKey && !options.taxonomy.terms && !attributesOptions) {
        return null;
    }

   const termsObjects = options.taxonomy.terms.map(termIds => {

        const termObject = findTermById(taxonomyKey, termIds, attributesOptions);
        if (termObject) {
            return {
                value: termObject.value,
                label: termObject.label
            };
        }
        return null;
    }).filter(term => term !== null);

    
    const handleOnChange = (value) => {
        if (Array.isArray(value)) {
            setSelectedValues(value);
            return;
        }
        if (template === 'radio') {
            setSelectedValues([value]);
        } else {
            const newSelectedValues = [...selectedValues];
            const index = newSelectedValues.indexOf(value);
            
            if (index === -1) {
                newSelectedValues.push(value);
            } else {
                newSelectedValues.splice(index, 1);
            }
            setSelectedValues(newSelectedValues);
        }
    };


    if(!termsObjects) {
        return null;
    }


    switch (template) {
        case 'select':
            return (
                <Tooltip title={info || ''} arrow placement="top">
                    <MuiMultipleSelect                    
                        values={termsObjects}
                        selectedValues={selectedValues}
                        label={label}
                        onChange={handleOnChange}  // Pass the value directly
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
                        onChange={(e) => setSelectedValues(e.target.value)}
                    >
                        <FormControlLabel 
                            value="" 
                            control={<Radio size='small' />} 
                            label={placeholder || 'All'} 
                        />
                        {termsObjects.map(term => (
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
                        {termsObjects.map(term => (
                            <FormControlLabel
                                key={term.value}
                                control={
                                    <Checkbox 
                                        checked={selectedValues.includes(term.value)}
                                        onChange={() => handleOnChange(taxonomyKey, term.value)}
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