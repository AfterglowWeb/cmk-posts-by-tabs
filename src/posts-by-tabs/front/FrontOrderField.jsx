import React, {useState} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';


export default function FrontOrderField (props) {
    const { field, index } = props;
    const { options, label, placeholder, info, template } = field;
    const orderOptions = options.order.options || [];
    const [selectedValue, setFilterValue] = useState(orderOptions?.defaultValue || '');
        
        switch (template) {
            case 'select':
                return (
                    <Tooltip title={info || ''} arrow placement="top">
                    <FormControl variant="standard" key={`order-${index}`} fullWidth margin="normal">
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={selectedValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder={placeholder}
                        >
                            {orderOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </Tooltip>
                );
                
            case 'radio':
                return (
                    <Tooltip title={info || ''} arrow placement="top">
                    <FormControl variant="standard" key={`order-${index}`} component="fieldset" margin="normal">
                        <Typography variant="subtitle1">{label}</Typography>
                        <RadioGroup
                            row
                            value={selectedValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        >
                            {orderOptions.map(option => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio size="small" />} 
                                    label={option.label} 
                                    
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    </Tooltip>
                );
        }
}