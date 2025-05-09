import React, {useState} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

export default function FrontOrderByField(props) {

    const { field, index } = props;
    const { options, label, placeholder, info, template } = field;
    const orderByOptions = options.orderBy.options || [];
    const [selectedValue, setFilterValue] = useState(orderByOptions?.defaultValue || '');


    switch (template) {
        case 'select':
            return (
                <FormControl key={`orderby-${index}`} fullWidth margin="normal">
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selectedValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        placeholder={placeholder}
                    >
                        {orderByOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                </FormControl>
            );
            
        case 'radio':
            return (
                <FormControl key={`orderby-${index}`} component="fieldset" margin="normal">
                    <Typography variant="subtitle1">{label}</Typography>
                    <RadioGroup
                        value={selectedValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        {orderByOptions.map(option => (
                            <FormControlLabel 
                                key={option.value} 
                                value={option.value} 
                                control={<Radio />} 
                                label={option.label} 
                            />
                        ))}
                    </RadioGroup>
                    {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
                </FormControl>
            );
    }
}