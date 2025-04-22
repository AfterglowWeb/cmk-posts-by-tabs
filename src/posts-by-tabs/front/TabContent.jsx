import { __ } from '@wordpress/i18n';
import Paper from '@mui/material/Paper';
import EventsCalendar from './EventsCalendar';
import PostsGrid from './PostsGrid';
import sanitizeHtml from '../utils/sanitizeHtml';

function CustomTabPanel({children, selectedTab, value, index}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== selectedTab}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${index}`}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          e.stopPropagation();
        }
      }}
    >
      {value === selectedTab && <Paper 
      elevation={0}
      sx={{borderRadius: '0px'}}
      >{children}</Paper>}
    </div>
  );
}


export default function TabContent(props) {

  const { tab, index, selectedTab, posts } = props;

  return (
    <CustomTabPanel 
      selectedTab={selectedTab} 
      value={index} 
      index={index}
      className="w-full"
    >
      {tab.meta_1 || tab.meta_2 &&
      <p className="flex justify-between pb-4">
        <span className="block">
          {tab.meta_1 && <span className="block text-xl font-regular">{tab.meta_1}</span>}
          {tab.meta_2 && <span className="block text-xl leading-2xl font-regular">{tab.meta_2}</span>}
        </span>
      </p>}
    
     
      {tab.content &&  <div className="w-full md:w-1/2 p-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tab.content)}}/>}

      {tab.template === 'grid' && <PostsGrid posts={posts} />}
      {tab.template === 'calendar' && <EventsCalendar posts={posts} tab={tab} />}
    </CustomTabPanel>
  );
}