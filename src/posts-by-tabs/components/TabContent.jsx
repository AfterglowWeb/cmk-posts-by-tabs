import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import Paper from '@mui/material/Paper';

function CustomTabPanel({children, selectedTab, value, index}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== selectedTab}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${index}`}
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
  handleTabValueChange
}) {
  return (
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
  );
}, (prevProps, nextProps) => {
  // Only re-render if content changed or editing status changed
  if (prevProps.content !== nextProps.content) return false;
  
  // Check editing status
  const prevEditing = prevProps.editingContent?.index === prevProps.index;
  const nextEditing = nextProps.editingContent?.index === nextProps.index;
  if (prevEditing !== nextEditing) return false;
  
  // If we're editing, always update
  if (nextEditing) return false;
  
  return true;
});

export default function TabContent({ 
  tab, 
  index, 
  selectedTab,
  editingContent,
  setEditingContent,
  handleTabValueChange
}) {

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
    </CustomTabPanel>
  );
}