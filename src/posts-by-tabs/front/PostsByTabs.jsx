import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

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
import EventsMap from './EventsMap';
import EventsMapCluster from './EventsMapCluster/EventsMapCluster';

export default function PostsByTabs(props) {
    const { attributes, setAttributes, clientId } = props;
    const [selectedTab, setSelectedTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const activeTab = attributes.tabs ? attributes.tabs[selectedTab] : null;
    const paginationType = activeTab?.options?.paginationType || 'buttons';
    const postsPerPage = attributes.numberOfItems || 10;

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

                if (result.headers && result.headers['x-wp-total']) {
                    setTotalPosts(parseInt(result.headers['x-wp-total']));
                }

                if (result.posts) {
                    setPosts(result.posts);
                }

            } catch (err) {
                console.error("Error fetching posts:", err);
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
        attributes.numberOfItems,
        attributes.order,
        attributes.orderBy,
        attributes.search,
        attributes.offset,
        attributes.metaFields,
        attributes.metaFields?.fields,
        attributes.metaFields?.relation,
        attributes.metaFields?.fields?.length,
    ]);


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
    
    return (
        <Container 
        sx={{position: 'relative', widht:'100%'}}
        maxWidth={maxWidth()}
        >
            {attributes.title && 
            <Box 
            component="h2" 
            className={`font-bold text-3xl lg:text-[40px] lg:leading-[50px] mb-0`}>
                {attributes.title}
            </Box>}

            {attributes.subtitle && <p className="font-bold text-xl text-[30px] mb-0">
                <strong>{attributes.subtitle}</strong>
            </p>}
            
            <Box>
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

                {renderPostsStatus()}

                {attributes.tabs?.map((tab, index) => (

                        <CustomTabPanel 
                          key={index}
                          selectedTab={selectedTab} 
                          value={index} 
                          index={index}
                          className="w-full min-w-full"
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
            </Box>
        </Container>
    );
}

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