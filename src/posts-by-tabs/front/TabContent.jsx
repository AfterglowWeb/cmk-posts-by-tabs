import { __ } from '@wordpress/i18n';
import Paper from '@mui/material/Paper';
import EventsCalendar from './EventsCalendar';
import PostsGrid from './PostsGrid';

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

  console.log('TabContent', props);
  const { tab, index, selectedTab, posts } = props;

  return (
    <CustomTabPanel 
      selectedTab={selectedTab} 
      value={index} 
      index={index}
    >
      <h3 className="flex justify-between pb-4">
        <span className="block">
          {tab.title && <span className="block text-xl font-bold">{tab.title}</span>}
          {tab.subtitle && <span className="block text-2xl text-secondary font-regular">{tab.subtitle}</span>}
        </span>
        <span className="block">
          {tab.meta_1 && <span className="block text-xl font-regular">{tab.meta_1}</span>}
          {tab.meta_2 && <span className="block text-xl leading-2xl font-regular">{tab.meta_2}</span>}
        </span>
      </h3>
    
      <div className="flex justify-start flex-wrap">
        <div className="w-full md:w-1/2 p-2 flex flex-col gap-4 justify-between">
        {tab.content && <div 
        className="tab-content-html"
        dangerouslySetInnerHTML={{ __html: tab.content }}
      />}
        </div>   
      </div>
      {tab.template === 'grid' && <PostsGrid posts={posts} />}
      {tab.template === 'calendar' && <EventsCalendar posts={posts} tab={tab} />}
    </CustomTabPanel>
  );
}