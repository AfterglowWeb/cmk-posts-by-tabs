import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

import { fetchPosts } from '../utils/fetchPosts';
import sanitizeHtml from '../utils/sanitizeHtml';

import Pagination from './Pagination';
import EventsCalendar from './EventsCalendar';
import PostsGrid from './PostsGrid';
import EventsMapCluster from './EventsMapCluster';
import FrontFilterFields from './FrontFilterFields';

export default function PostsByTabs(props) {
    const { attributes, setAttributes, clientId, isEditor, useBlockProps } = props;
    const [selectedTab, setSelectedTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const activeTab = attributes.tabs ? attributes.tabs[selectedTab] : null;
    const paginationType = activeTab?.options?.paginationType || 'buttons';
    const postsPerPage = attributes.postsPerPage || 12;

    useEffect(() => {
        const getPosts = async () => {
            setIsLoading(true);
            setError(null);
      
            try {

                const fetchOptions = {
                    headers: true,
                    append: false 
                };
                
                const result = await fetchPosts({
                    ...attributes
                }, fetchOptions);

                if (!result.error) {
                    if (result.headers && result.headers['x-wp-total']) {
                        setTotalPosts(parseInt(result.headers['x-wp-total']));
                    }
    
                    if (result.posts) {
                        setPosts(result.posts);
                    }
                }

            } catch (err) {
                setError(err.message);
                setPosts([]);
                setTotalPosts(0);
            } finally {
                setIsLoading(false);
            }
        };
        
        getPosts();
    }, [
        attributes.postType,
        attributes.taxonomy,
        attributes.terms,
        attributes.postsPerPage,
        attributes.maxNumPages,
        attributes.order,
        attributes.orderBy,
        attributes.orderByMetaKey,
        attributes.search,
        attributes.offset,
        attributes.metaFields,
        attributes.metaFields?.fields,
        attributes.metaFields?.relation,
        attributes.metaFields?.fields?.length,
    ]);

    const blockProps = isEditor ? useBlockProps({
        className: 'posts-by-tabs-block'
    }) : {className: 'posts-by-tabs-block'};


    const handleTabChange = (event, value) => {
        setSelectedTab(value);
	};

    const handlePageChange = (page, newOffset, append = false) => {
        
        setCurrentPage(page);
        setAttributes({
            ...attributes,
            offset: newOffset
        });
        
        if (append) {
            // We'll handle this in the useEffect by passing append option to fetchPosts
        }
        
        if (!append) {
            window.scrollTo({
                top: document.getElementById(`block-${clientId}`).offsetTop - 50,
                behavior: 'smooth'
            });
        }
    };

    const renderPostsStatus = () => {
        if (isLoading) {
            return <div className="p-4 text-center">Loading posts...</div>;
        }
        
        if (error) {
            return <div className="p-4 text-center text-red-600">Error: {error}</div>;
        }
        
        if (posts.length === 0) {
            return <div className="p-4 text-center">No posts found matching your criteria.</div>;
        }
        
        return null;
    };

    const maxWidth = () => {
        if (attributes.align === 'full') {
            return false;
        } else if (attributes.align === 'wide') {
            return 'xl';
        } else {
            return 'lg';
        }
    }

    const onFilterChange = useCallback((newFilters) => {
        setAttributes({
            ...attributes,
            ...newFilters
        });
    }, [attributes]);

    /*const filterFieldProps = { 
        filterFields: attributes.filterFields, 
        taxonomyTerms: attributes.taxonomyTerms,
        metas: attributes.metaFields,
        isLoading: false,
        error: null
    }*/
    
    return (
        <div {...blockProps} >
        <Container 
        sx={{position: 'relative', widht:'100%'}}
        maxWidth={maxWidth()}
        >
            
            <Box>
                <FrontFilterFields attributes={attributes} onFilterChange={onFilterChange} isLoading={false} error={null} />
                <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="detailed list tabs"
                sx={{ mb: 1 }}
                >
                    {attributes.tabs && attributes.tabs.map((tab, index) => (
                        <Tab 
                            key={index}
                            label={tab.title}
                            id={`tab-${index}`}
                            aria-controls={`tabpanel-${index}`}
                        />
                    ))}
                </Tabs>

                <Box
                sx={{position: 'relative'}}
                className={`w-full`}
                >
                
                {renderPostsStatus()}

                {attributes.tabs?.map((tab, index) => (

                        <CustomTabPanel 
                        key={index}
                        selectedTab={selectedTab} 
                        value={index} 
                        index={index}
                        className={`${isEditor ? 'cursor-default' : ''} w-full min-w-full`}
                        >
                          {tab.meta_1 || tab.meta_2 &&
                          <p className="flex justify-between pb-4">
                            <span className="block">
                              {tab.meta_1 && <span className="block text-xl font-regular">{tab.meta_1}</span>}
                              {tab.meta_2 && <span className="block text-xl leading-2xl font-regular">{tab.meta_2}</span>}
                            </span>
                          </p>}
                        
                         
                          {tab.content &&  <div className="w-full md:w-1/2 p-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tab.content)}}/>}
                    
                          {tab.template === 'grid' && <PostsGrid attributes={attributes} posts={posts} tab={tab} />}
                          {tab.template === 'calendar' && <EventsCalendar attributes={attributes} posts={posts} tab={tab} />}
                          {tab.template === 'map' && <EventsMapCluster attributes={attributes} posts={posts} tab={tab} />}
                        </CustomTabPanel>
                      
                ))}

                {activeTab && activeTab.options?.paginationEnabled && (
                    <Pagination
                        posts={posts}
                        totalPosts={totalPosts}
                        offset={attributes.offset || 0}
                        postsPerPage={postsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        paginationType={paginationType}
                        isLoading={isLoading}
                        template={activeTab.template}
                    />
                )}
                {isEditor && <div className="p-4 cursor-default inset-0 absolute z-10 w-full h-full flex items-center justify-center">This is a preview.</div>}
                </Box>
            </Box>
        </Container>
        </div>
    );
}

function CustomTabPanel({children, selectedTab, value, index, className}) {
    return (
      <div
        role="tabpanel"
        hidden={value !== selectedTab}
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${index}`}
        className={className}
      >
        {value === selectedTab && <Paper 
        elevation={0}
        sx={{borderRadius: '0px'}}
        >{children}</Paper>}
      </div>
    );
  }