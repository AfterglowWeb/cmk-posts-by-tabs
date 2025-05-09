import React, {useState} from '@wordpress/element';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function FrontSearchField (props) {
    const { field, index } = props;
    const { label, placeholder, info } = field;
    const [filterValue, setFilterValue] = useState('');
    
    return (
        <Tooltip title={info || ''} arrow placement="top">
        <FormControl key={`search-${index}`} fullWidth margin="normal">
            <TextField
                label={label}
                placeholder={placeholder}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                variant="standard"
                size="small"
                slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                }}
            />
        </FormControl>
        </Tooltip>
    );
}