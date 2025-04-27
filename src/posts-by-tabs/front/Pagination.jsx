import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';

/**
 * Pagination component for Posts By Tabs
 * 
 * @param {Object} props Component props
 * @param {Array} props.posts Current posts array
 * @param {number} props.totalPosts Total number of posts
 * @param {number} props.offset Current offset in query
 * @param {number} props.postsPerPage Number of posts per page
 * @param {number} props.currentPage Current page number
 * @param {Function} props.onPageChange Callback when page changes
 * @param {string} props.paginationType Type of pagination (buttons, loadmore, infinite)
 * @param {boolean} props.isLoading Whether posts are currently loading
 * @param {string} props.template Current template (grid, row, calendar)
 */
function Pagination(props) {
    const {
        posts = [],
        totalPosts = 0,
        offset = 0,
        postsPerPage = 12,
        currentPage = 1,
        onPageChange,
        paginationType = 'buttons',
        isLoading = false,
        template = 'grid'
    } = props;

    const [maxPage, setMaxPage] = useState(1);
    const [visiblePages, setVisiblePages] = useState([]);
    const [inView, setInView] = useState(false);
    const loaderRef = useRef(null);

    useEffect(() => {
        if (totalPosts && postsPerPage) {
            const calculatedMaxPage = Math.ceil(totalPosts / postsPerPage);
            setMaxPage(calculatedMaxPage);
        }
    }, [totalPosts, postsPerPage]);

    useEffect(() => {
        const displayedPages = [];
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, maxPage);
        
        if (endPage === maxPage) {
            startPage = Math.max(endPage - 4, 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            displayedPages.push(i);
        }
        
        setVisiblePages(displayedPages);
    }, [currentPage, maxPage]);


    useEffect(() => {
        if (paginationType !== 'infinite' || !loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [paginationType, loaderRef]);

    useEffect(() => {
        if (inView && !isLoading && currentPage < maxPage && paginationType === 'infinite') {
            handlePageChange(currentPage + 1);
        }
    }, [inView, isLoading, currentPage, maxPage, paginationType]);


    const handlePageChange = (page) => {
        if (page < 1 || page > maxPage || page === currentPage) return;

        const newOffset = 
            paginationType === 'buttons' 
                ? (page - 1) * postsPerPage 
                : offset + postsPerPage;
                
        if (onPageChange) {
            onPageChange(page, newOffset, paginationType !== 'buttons');
        }
    };

    if (maxPage <= 1 && paginationType !== 'loadmore' && paginationType !== 'infinite') {
        return null;
    }

    switch (paginationType) {
        case 'loadmore':
            if (currentPage >= maxPage) return null;
            
            return (
                <Box className="posts-by-tabs-pagination loadmore" sx={{ textAlign: 'center', my: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={isLoading || currentPage >= maxPage}
                        startIcon={isLoading && <CircularProgress size={16} color="inherit" />}
                    >
                        {isLoading ? __('Loading...') : __('Load more')}
                    </Button>
                </Box>
            );
        
        case 'infinite':
            if (currentPage >= maxPage) return null;
            
            return (
                <div 
                    ref={loaderRef}
                    className="posts-by-tabs-pagination infinite-loader"
                    style={{ 
                        width: '100%', 
                        height: '50px', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: isLoading ? 1 : 0
                    }}
                >
                    {isLoading && <CircularProgress size={24} />}
                </div>
            );
        
        case 'buttons':
        default:
            return (
                <Box className="posts-by-tabs-pagination buttons" sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    my: 3,
                    '.MuiButtonGroup-root': {
                        flexWrap: 'wrap'
                    }
                }}>
                    <ButtonGroup variant="outlined" aria-label="pagination">
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || isLoading}
                        >
                            <NavigateBeforeIcon fontSize="small" />
                        </Button>
                        
                        {currentPage > 3 && maxPage > 5 && (
                            <>
                                <Button onClick={() => handlePageChange(1)}>1</Button>
                                {currentPage > 4 && <Button disabled>...</Button>}
                            </>
                        )}
                        
                        {visiblePages.map(page => (
                            <Button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page)}
                                variant={page === currentPage ? "contained" : "outlined"}
                                disabled={isLoading}
                            >
                                {page}
                            </Button>
                        ))}
                        
                        {currentPage < maxPage - 2 && maxPage > 5 && (
                            <>
                                {currentPage < maxPage - 3 && <Button disabled>...</Button>}
                                <Button onClick={() => handlePageChange(maxPage)}>{maxPage}</Button>
                            </>
                        )}
                        
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= maxPage || isLoading}
                        >
                            <NavigateNextIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
                </Box>
            );
    }
}

export default Pagination;