import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { FetchRecentData } from "../../Redux/Features/RecentSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { CommonPollList } from "../../Common Components/CommonPollList";

export default function Latest() {
    const { recentData, hasMore, page } = useSelector(state => state.recent);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchRecentData({ page: 1 }));
    }, []);

    const handleNext = () => {
        dispatch(FetchRecentData({ page }))
    }

    return (
        <div className='middle-side'>
            <InfiniteScroll
                dataLength={recentData.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<h2>Loading...</h2>}
                endMessage={<p style={{ textAlign: "center" }}>
                    No More data
                </p>}
            >
                {recentData.map((item) => (
                    <CommonPollList key={item.id} item={item} />
                ))}

            </InfiniteScroll>

        </div >
    )
}