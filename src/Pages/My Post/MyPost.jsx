import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { FetchMyPost } from "../../Redux/Features/MypostSlice";
import { CommonPollList } from "../../Common Components/CommonPollList";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThemeContext } from "../../Context/ThemeContext"

export default function MyPost() {
    const { myPost, hasMore, page } = useSelector(state => state.mypost);
    const dispatch = useDispatch();
    const { theme, getThemeStyle } = useContext(ThemeContext);


    useEffect(() => {
        dispatch(FetchMyPost({ page: 1 }));
    }, []);

    const handleNext = () => {
        dispatch(FetchMyPost({ page }));
    };

    return (
        <div className='middle-side' style={getThemeStyle(theme)}>
            <InfiniteScroll
                style={{ width: '100%' }}
                dataLength={myPost.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<h2>Loading...</h2>}
                endMessage={<p style={{ textAlign: "center" }}>
                    No More data
                </p>}
            >
                {myPost.map((item) => (
                    <CommonPollList key={item.id} item={item}/>
                ))}
            </InfiniteScroll>
        </div>
    )
}