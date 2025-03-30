import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { memo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import Paper from '@mui/material/Paper';
import Post from '../posts/Post';
import EventsCalendar from '../posts/calendar/EventsCalendar';

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
      {value === selectedTab && <Paper elevation={0}>{children}</Paper>}
    </div>
  );
}

const MemoizedRichText = memo(function RichTextEditor({
  content,
  index,
  editingContent,
  setEditingContent,
  handleTabValueChange,
  clientId
}) {

  const { selectBlock } = useDispatch('core/block-editor');

  return (
    <div 
      className="rich-text-wrapper"
      onClick={(e) => {
        if (clientId) {
          selectBlock(clientId);
        }
      }}
    >
      <RichText
      tagName="p"
      placeholder="Écrivez ici."
      value={content}
      allowedFormats={['core/bold', 'core/italic']}
      onChange={(value) => {
        setEditingContent({
          index: index,
          content: value
        });
      }}
      onBlur={() => {
        if (editingContent && editingContent.index === index) {
          handleTabValueChange(editingContent.content, 'content', index);
          setEditingContent(null);
        }
      }}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.content !== nextProps.content) {
    return false;
  }
  
  const prevEditing = prevProps.editingContent?.index === prevProps.index;
  const nextEditing = nextProps.editingContent?.index === nextProps.index;
  if (prevEditing !== nextEditing) {
    return false;
  }
  
  if (nextEditing) {
    return false;
  }
  
  return true;
});

export default function TabContent({ 
  tab, 
  index, 
  selectedTab,
  editingContent,
  setEditingContent,
  handleTabValueChange,
  clientId,
  posts,
}) {

  useEffect(() => {
    return () => {
      if (editingContent && editingContent.index === index) {
        setEditingContent(null);
      }
    };
  }, []);

  const template = tab?.template || 'posts-grid';

  const content = editingContent !== null && editingContent.index === index 
    ? editingContent.content 
    : tab?.content || '';

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
          <MemoizedRichText
            content={content}
            index={index}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            handleTabValueChange={handleTabValueChange}
            clientId={clientId}
          />
        </div>   
      </div>
      {template === 'posts-grid' && <PostsGrid posts={posts} />}
      {template === 'calendar' && <EventsCalendar posts={posts} options={tab} />}
    </CustomTabPanel>
  );
}

function PostsGrid (props) {
  const { posts } = props;
  
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  return (
    <div className="py-4 flex flex-wrap gap-0">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};