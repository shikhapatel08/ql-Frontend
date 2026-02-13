import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FetchTrendingData } from "../../Redux/Features/TrendingSlice";
import '../Trending/Trending.css'
import { CommonPollList } from "../../Common Components/CommonPollList";
import { ThemeContext } from "../../Context/ThemeContext";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Trending() {
    const dispatch = useDispatch();
    const { data, hasMore, page  } = useSelector(state => state.trending);
    const { theme, getThemeStyle } = useContext(ThemeContext);

    useEffect(() => {
        dispatch(FetchTrendingData({ page: 1 }));
    }, []);

    const handleNext = () => {
            dispatch(FetchTrendingData({ page }));
    }

    return (
        <div className='middle-side' style={getThemeStyle(theme)}>
            <InfiniteScroll
                style={{ width: '100%' }}
                dataLength={data.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<h2>Loading...</h2>}
                endMessage={<p style={{ textAlign: "center" }}>
                    No More data
                </p>}
            >
                {data.map((item) => (
                    <CommonPollList key={item.id} item={item} />
                ))}
            </InfiniteScroll>
        </div>
    )
}