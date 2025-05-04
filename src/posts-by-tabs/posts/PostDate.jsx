import React from 'react';
import Box from '@mui/material/Box';
import UpdateIcon from '@mui/icons-material/Update';
import Tooltip from '@mui/material/Tooltip';
import formatDateToFrench from '../utils/formatDateToFrench';

export default function PostDate(props) {

    const {post, className} = props;
    if(!post) {
      return null;
    }

    if(!post.date) {
      return null;
    }

    const isModified = () => {
      if(post.modified && post.modified !== post.date) {
        return true;
      }
      return false;
    }


    const modified = isModified() ? formatDateToFrench(post.modified) : '';
    const date = formatDateToFrench(post.date);
   
    return(
    <Tooltip title={isModified() ? `Mis à jour le ${modified}`: `Publié le ${date}`} placement="top-start">
    <Box component="p" className={`flex gap-1 items-center ${className}`}>
        {isModified() && 
        <UpdateIcon color="inherit" sx={{width:18 , height:18}} /> 
        }
        <span className="block text-xs leading-none truncate ellipsis overflow-hidden">
            {isModified() ? `Màj. le ${modified}`: `Pub. le ${date}`}
        </span>
    </Box>
    </Tooltip>
    )
  }