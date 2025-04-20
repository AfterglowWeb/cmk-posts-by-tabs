import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import { format, parse, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, addWeeks, subMonths, subWeeks, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tooltip } from '@mui/material';

import SmallCard from '../posts/SmallCard';
import XSmallCard from '../posts/XSmallCard';

export default function EventsCalendar(props) {
  const { posts, tab } = props;
  const { options } = tab;

  const { start_key, end_key, default_view, has_day_view, has_week_view, has_month_view } = options?.calendar;
  const [calendarView, setCalendarView] = useState(default_view || 'week');
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!posts) {
    return null;
  }

  const groupEventsByDate = () => {
    const grouped = {};

    posts.forEach(post => {

      let start = null;
      let end = null;
      if(post[start_key]) {
        start = post[start_key]
      }

      if(post.acf[start_key]) {
        start = post.acf[start_key]
      }

      if(post[end_key]) {
        end = post[end_key]
      }

      if(post.acf[end_key]) {
        end = post.acf[end_key]
      }


      if (!start) {
        return;
      }
      
      let startDate;
      try {
        startDate = parse(start, 'yyyy-MM-dd', new Date());
      } catch (error) {
        return;
      }
      
      let endDate = startDate;
      if (end) {
        try {
          endDate = parse(end, 'yyyy-MM-dd', new Date());
        } catch (error) {
        }
      }
      
      const dates = eachDayOfInterval({ start: startDate, end: endDate });
      
      dates.forEach((date, index) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        
        const eventWithPosition = {
          ...post,
          multiDay: dates.length > 1,
          position: index === 0 ? 'start' : index === dates.length - 1 ? 'end' : 'middle',
          totalDays: dates.length
        };
        
        grouped[dateKey].push(eventWithPosition);
      });
    });
    
    return grouped;
  };
  
  const eventsByDate = groupEventsByDate();

  const goToToday = () => setCurrentDate(new Date());
  
  const goBack = () => {
    switch (calendarView) {
      case 'day':
        setCurrentDate(prevDate => subDays(prevDate, 1));
        break;
      case 'week':
        setCurrentDate(prevDate => subWeeks(prevDate, 1));
        break;
      case 'month':
      default:
        setCurrentDate(prevDate => subMonths(prevDate, 1));
    }
  };
  
  const goForward = () => {
    switch (calendarView) {
      case 'day':
        setCurrentDate(prevDate => addDays(prevDate, 1));
        break;
      case 'week':
        setCurrentDate(prevDate => addWeeks(prevDate, 1));
        break;
      case 'month':
      default:
        setCurrentDate(prevDate => addMonths(prevDate, 1));
    }
  };
  
  const handleViewChange = (view) => {
    setCalendarView(view);
  };

  const renderDayView = () => {
    const todayKey = format(currentDate, 'yyyy-MM-dd');
    const todayEvents = eventsByDate[todayKey] || [];
    
    return (
      <Box className="day-view px-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
        {todayEvents.length === 0 ? (
          <Paper elevation={0} className="p-4 text-center bg-gray-50">
            <Typography>Aucun événement aujourd'hui</Typography>
          </Paper>
        ) : (
          todayEvents.map((post, index) => (
            <Box key={`day-event-${index}`} className="mb-4">
              <SmallCard post={post} />
              {post.multiDay && (
                <Typography variant="caption" className="text-xs mt-1 block">
                  {`Durée : ${post.totalDays} jours (${
                    post.position === 'start' ? 'Premier jour' : 
                    post.position === 'end' ? 'Dernier jour' : 'En cours'
                  })`}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>
    );
  };

  const renderWeekView = () => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDay, i));
    
    return (
      <Box className="week-view overflow-x-auto">
        <div className="flex min-w-[1000px]">
          {weekDays.map((day, dayIndex) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dayKey] || [];
            
            return (
              <div 
                key={`week-day-${dayIndex}`} 
                className="flex-1 border-r border-gray-200 last:border-r-0 p-2"
              >
                <Typography 
                  variant="subtitle1" 
                  component="h4" 
                  className={`py-2 font-bold text-center ${
                    format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') 
                      ? 'text-primary bg-primary-light rounded' 
                      : ''
                  }`}
                >
                  {format(day, 'EEE d', { locale: fr })}
                </Typography>
                
                <Box className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                  {dayEvents.length === 0 ? (
                    <Box className="py-2 text-center text-gray-400 text-sm">
                      -
                    </Box>
                  ) : (
                    dayEvents.map((post, index) => (
                      <Box 
                        key={`week-event-${dayIndex}-${index}`} 
                        className={`mb-3 p-2 rounded ${
                          post.multiDay 
                            ? `${post.position === 'start' 
                                ? 'rounded-r-none border-r-0' 
                                : post.position === 'end' 
                                  ? 'rounded-l-none border-l-0' 
                                  : 'rounded-none border-x-0'
                              } bg-primary text-white`
                            : 'bg-white shadow-sm border'
                        }`}
                      >
                        <SmallCard 
                          post={post} 
                          compact={true}
                          hideImage={post.position !== 'start' && post.multiDay}
                        />
                        {post.multiDay && post.position === 'start' && (
                          <Typography variant="caption" className="text-xs mt-1 block">
                            {`${post.totalDays} jours`}
                          </Typography>
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </div>
            );
          })}
        </div>
      </Box>
    );
  };

  function DayOfMonth({ day, dayEvents, i }) {

    const [open, setOpen] = useState(false);

    return(
      <>
      {dayEvents.slice(0, 3).map((post, index) => (
        <Box 
          key={`month-event-${i}-${index}`} 
          className={`p-1 mb-1 text-xs max-w-full w-full rounded truncate block overflow-hidden ${
            post.multiDay 
              ? `${post.position === 'start' 
                  ? 'rounded-r-none border-r-0' 
                  : post.position === 'end' 
                    ? 'rounded-l-none border-l-0' 
                    : 'rounded-none border-x-0'
                } bg-primary text-white`
              : 'bg-secondary-light'
          }`}
          sx={{ 
            cursor: 'pointer',
            ...(post.multiDay && {
              position: 'relative',
              marginLeft: post.position === 'start' ? '0' : '-1px',
              marginRight: post.position === 'end' ? '0' : '-1px',
              zIndex: post.position === 'middle' ? 1 : 2
            })
          }}
        >
          <XSmallCard post={post} />
          <span className="text-slate-700 text-[10px] mt-[1px]">{post.multiDay && post.position === 'start' && `1er j. • durée ${post.totalDays} j.`}</span>
        </Box>
      ))}
      
      {dayEvents.length > 3 && (
        <Box className="text-xs text-gray-500 text-center">
          <Button 
          variant="text" 
          color="secondary" 
          size="small" 
          onClick={() => setOpen(true)}
          sx={{
          boxShadow:'unset', 
          fontSize:'12px', 
          textTransform:'capitalize', 
          textDecoration:'underline',
          ['&:hover']: {
            textDecoration:'underline',
          }
          }}
          >+ {dayEvents.length - 3} événement{dayEvents.length > 4 ? 's' : ''}</Button>
          <Dialog 
          open={open} 
          onClose={() => {setOpen(false)}}
          >
            <DialogTitle><span className="capitalize">{format(day, 'EEEE d MMMM yyyy', { locale: fr })}</span></DialogTitle>
            <DialogContent dividers>
              {dayEvents.map((post, index) => (
                <Box 
                  key={`month-event-${i}-${index}`} 
                  className={`p-1 mb-3 text-xs rounded truncate block ${
                    post.multiDay 
                      ? `${post.position === 'start' 
                          ? 'rounded-r-none border-r-0' 
                          : post.position === 'end' 
                            ? 'rounded-l-none border-l-0' 
                            : 'rounded-none border-x-0'
                        } bg-primary text-white`
                      : 'bg-secondary-light'
                  }`}
                  sx={{ 
                    cursor: 'pointer',
                    // For multi-day events
                    ...(post.multiDay && {
                      position: 'relative',
                      marginLeft: post.position === 'start' ? '0' : '-1px',
                      marginRight: post.position === 'end' ? '0' : '-1px',
                      zIndex: post.position === 'middle' ? 1 : 2
                    })
                  }}
                >
                  <SmallCard post={post} />
                  <span className="text-slate-700 mt-[1px] text-[10px]">{post.multiDay && post.position === 'start' && `1er j. • durée ${post.totalDays} j.`}</span>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" sx={{textTransform:'none'}} onClick={() => setOpen(false)}>Fermer</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      </>
    )
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <Box className="month-view overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-7 border-b border-gray-200 py-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
              <div key={`header-${i}`} className="text-center font-semibold">{day}</div>
            ))}
          </div>
          

          <div className="grid grid-cols-7 gap-1 mt-1">
            
            {/* Empty days before the month starts */}
            {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
              <div key={`empty-start-${i}`} className="aspect-square bg-gray-50 p-1"></div>
            ))}
            
            {/* Actual month days */}
            {monthDays.map((day, i) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dayKey] || [];
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <div 
                  key={`month-day-${i}`} 
                  className={`aspect-square border border-gray-100 p-0 overflow-hidden ${
                    isToday ? 'bg-primary-light' : 'bg-white'
                  }`}
                >
                  <Typography 
                    variant="body2" 
                    component="div" 
                    className={`font-bold text-right ${isToday ? 'text-primary' : ''}`}
                  >
                    {format(day, 'd')}
                  </Typography>
                  
                  <div className="overflow-y-scroll mt-1 w-full max-w-full relative" style={{ maxHeight: '85%' }}>
                    <DayOfMonth day={day} dayEvents={dayEvents} i={i} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Box>
    );
  };

  const renderCalendarView = () => {
    switch (calendarView) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
      default:
        return renderMonthView();
    }
  };

  return (
      <Container maxWidth="xl">
        <Paper className="px-4 sm:px-6 lg:px-8 py-4" elevation={0}>
          <Box className="flex justify-end items-center w-full gap-2 mb-4">
            <Box className="flex justify-end items-center gap-2 mb-4">
              
              <Tooltip title={`${calendarView === 'day' ? 'Jour précédent' : (calendarView === 'week' ? 'Semaine précédente' : 'Mois précédent')}`} placement="top">
              <IconButton 
                color="secondary"
                onClick={goBack} 
                aria-label="previous"
                size="small"
              >
                <NavigateBeforeIcon color="secondary" />
              </IconButton>
              </Tooltip>
              
              <Tooltip title={__('See today', 'posts-by-tabs')} placement="top">
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={goToToday}
                startIcon={<TodayIcon />}
                size="small"
              >
                {__('Today', 'posts-by-tabs')}
              </Button>
              </Tooltip>
              
              <Tooltip title={`${calendarView === 'day' ? 
                __('Next day', 'posts-by-tabs') : 
                (calendarView === 'week' ? 
                  __('Next Week', 'posts-by-tabs') : 
                  __('Next Month', 'posts-by-tabs')
                )
              }`} 
              placement="top">
                <IconButton 
                  color="secondary"
                  onClick={goForward} 
                  aria-label={__('next', 'posts-by-tabs')}
                  size="small"
                >
                  <NavigateNextIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box className="flex justify-end items-center gap-3 mb-5">
              
              {has_day_view && (
              <Tooltip title={__('Day view', 'posts-by-tabs')} placement="top">
              <Fab 
                color={calendarView === 'day' ? 'secondary' : 'primary'} 
                aria-label={__('day', 'posts-by-tabs')} 
                onClick={() => setCalendarView('day')}
                size="small"
                sx={{ boxShadow: 'none' }}
              >
                <CalendarViewDayOutlinedIcon />
              </Fab>
              </Tooltip>
              )}

              {has_week_view && (
              <Tooltip title={__('Week view', 'posts-by-tabs')} placement="top">
              <Fab 
                color={calendarView === 'week' ? 'secondary' : 'primary'} 
                aria-label={__('week', 'posts-by-tabs')}  
                onClick={() => setCalendarView('week')}
                size="small"
                sx={{ boxShadow: 'none' }}
              >
                <CalendarViewWeekIcon />
              </Fab>
              </Tooltip>
              )}

              {has_month_view && (
              <Tooltip title={__('Month view', 'posts-by-tabs')} placement="top">
              <Fab 
                color={calendarView === 'month' ? 'secondary' : 'primary'} 
                aria-label={__('month', 'posts-by-tabs')} 
                onClick={() => setCalendarView('month')}
                size="small"
                sx={{ boxShadow: 'none' }}
              >
                <CalendarViewMonthIcon />
              </Fab>
              </Tooltip>
              )}

            </Box>
          </Box>

          <Typography 
            variant="h6" 
            component="p" 
            className="text-center mb-4 capitalize"
          >
            {calendarView === 'day' && format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
            {calendarView === 'week' && (
              <>
                {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: fr })} 
                {" - "}
                {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), "d MMM yyyy", { locale: fr })}
              </>
            )}
            {calendarView === 'month' && format(currentDate, "MMMM yyyy", { locale: fr })}
          </Typography>
          {renderCalendarView()}
        </Paper>
      </Container>
  );
}