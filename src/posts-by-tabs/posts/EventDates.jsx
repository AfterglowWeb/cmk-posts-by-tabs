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

export function eventDatesString(post) {
  const {acf} = post;
  if(!acf) {
    return null;
  }
  
  const {datedebut, datefin} = acf;
  if(!datedebut) {
    return null;
  }
  
  const endDate = datefin || datedebut;
  const {start, end} = formatDateRange({start: datedebut, end: endDate});

  return (start && end) ? `${start} • ${end}` : (start ? start : null);
}

function formatDateToFrench(dateString, options = {}) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}

function formatDateRange(dateRange) {
  if (!dateRange) return { start: '', end: '' };
  
  const { start: startDate, end: endDate } = dateRange;
  
  if (!endDate || startDate === endDate) {
    return { 
      start: formatDateToFrench(startDate),
      end: '' 
    };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const sameDay = start.getDate() === end.getDate() && 
                  start.getMonth() === end.getMonth() &&
                  start.getFullYear() === end.getFullYear();
  const sameMonth = start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();
  
  if (sameDay) {
    return {
      start: __('The') + '' +  formatDateToFrench(startDate),
      end: ''
    };
  }

  const startOptions = {
    day: 'numeric',
    month: sameMonth ? undefined : 'short',
    year: sameYear ? undefined : 'numeric'
  };
  
  const endOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  return {
    start: formatDateToFrench(startDate, startOptions),
    end: formatDateToFrench(endDate, endOptions)
  };
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


