import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { memo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import Paper from '@mui/material/Paper';

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
      {value === selectedTab && <Paper sx={{ p: 3, backgroundColor:'oklch(0.968 0.007 247.896)' }} elevation={2}>{children}</Paper>}
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
  posts
}) {

  useEffect(() => {
    return () => {
      if (editingContent && editingContent.index === index) {
        setEditingContent(null);
      }
    };
  }, []);

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
    
      <div className="flex justify-start flex-wrap border-y border-slate-50">
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
        <div className="w-full md:w-1/2 p-2">
          <div className="aspect-video">
            <div className="relative">
              {tab.mediaUrl && (
                <img 
                  src={tab.mediaUrl} 
                  alt={tab.title || ''} 
                  className="aspect-video object-cover" 
                />
              )}
            </div>
            </div>
        </div>
      </div>

      <TabPosts posts={posts} />
    </CustomTabPanel>
  );
}

function TabPosts (props) {
  const { posts } = props;
  
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  return (
    <div className="posts-grid mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="post-card bg-white p-4 rounded shadow">
          {post._embedded && post._embedded['wp:featuredmedia'] && (
            <div className="post-thumbnail mb-3">
              <img 
                src={post._embedded['wp:featuredmedia'][0].source_url} 
                alt={post._embedded['wp:featuredmedia'][0].alt_text || ''} 
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <h4 className="post-title text-lg font-bold mb-2" 
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
          />
          
          <div className="post-excerpt text-sm mb-2" 
               dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
          
          <div className="post-meta text-xs text-gray-500">
            {post.date && (
              <span>{new Date(post.date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};