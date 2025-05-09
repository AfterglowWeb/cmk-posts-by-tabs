import React, {useState} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';


export default function FrontCalendarField (props) {
    const { field, index } = props;
    const { options, label, info } = field;
    const hasRangePicker = options.calendar.options.enableRangePicker || false;
    const [selectedValue, setFilterValue] = useState([]);
        
    return (
        <FormControl fullWidth margin="normal">
            <Typography variant="subtitle1">{label}</Typography>
            {info && <Typography variant="caption" color="textSecondary">{info}</Typography>}
        </FormControl>
    );

}