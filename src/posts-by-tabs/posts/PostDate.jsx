import React from 'react';
import Box from '@mui/material/Box';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UpdateIcon from '@mui/icons-material/Update';
import Tooltip from '@mui/material/Tooltip';
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
   
    return(
    <Tooltip title={isModified() ? `Mis à jour le ${post.modified}`: `Publié le ${post.date}`} placement="top-start">
    <Box component="p" className={`flex gap-1 items-center ${className}`}>
        {isModified() && 
        <UpdateIcon color="inherit" sx={{width:18 , height:18}} /> 
        }
        <span className="block text-xs leading-none truncate ellipsis overflow-hidden">
            {isModified() ? `Màj. le ${post.modified}`: `Pub. le ${post.date}`}
        </span>
    </Box>
    </Tooltip>
    )
  }