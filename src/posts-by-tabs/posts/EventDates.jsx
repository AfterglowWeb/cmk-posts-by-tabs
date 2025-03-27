import React from 'react';
import Box from '@mui/material/Box';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import Tooltip from '@mui/material/Tooltip';

export default function EventDates(props) {

    const {post, className} = props;
    
    if(!post) {
      return null;
    }

    const {event_dates} = post;
    if(!event_dates) {
      return null;
    }

    const {start, end} = formatDateRange(event_dates)
    const isCurrent = isCurrentEvent(event_dates)

    return(
      <>
      <Tooltip title={`${isCurrent ? 'Événement en cours' : 'Dates de l\'événement' }`} placement="bottom-start">
        <Box component="p" className={`${className} w-full text-white flex justify-between items-center gap-1`}>
          <span className="flex items-center gap-1 text-sm leading-none">
            <InsertInvitationIcon color="inherit" sx={{width:18 , height:18}} />
            <span className="flex gap-1 text-md leading-none">
                {start && end && <>
                <span>Du {start}</span>
                <span> au </span>
                <span>{end}</span>
                </>}
                {start && !end && <span>Le {start}</span>}
            </span>
          </span>
        </Box>
      </Tooltip>

      {isCurrent && 
      <CurrentEventMarker />
      }

    </>
    
    )
  }

export function CurrentEventMarker() {
  return (
    <span className="absolute z-10 top-[4px] right-[4px] flex h-5 w-5 border-2 border-red-700 items-center text-sm text-white leading-none animate-pulse bg-red-500 rounded-full shadow-md">
      <Tooltip title={`En ce moment`} placement="top-end">
          <span className="flex items-center gap-1 h-4 w-4 "></span>
      </Tooltip>
    </span>
  )
}

function formatDateRange(dateRange) {
  const { start, end } = dateRange;

  let startParts = start.split(' ');
  let endParts = end ? end.split(' ') : [];
  for (let i = startParts.length; 0 < i; i--) {
      if (startParts[i] == endParts[i]) {
          startParts[i] = '';
      } else {
          break;
      }
  }

  const newStart = startParts.filter(part => part !== '').join(' ');
  return {
      start: newStart,
      end
  }
}

function isCurrentEvent(dateRange) {
  const { start, end } = dateRange;
  const now = new Date();
  const startDate = new Date(start);
  
  var endDate;
  if (!end) {
      endDate = startDate;
      endDate.setHours(23, 59, 59);
  } else {
      endDate = new Date(end);
  }

  return startDate <= now && now <= endDate;
}


