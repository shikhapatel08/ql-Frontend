import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import '../Trending/Trending.css'
import { CommonPollList } from "../../Common Components/CommonPollList";
import { ThemeContext } from "../../Context/ThemeContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { FetchForyouData } from "../../Redux/Features/ForyouSlice";

export default function Foryou() {
    const dispatch = useDispatch();
    const { ForyouData, hasMore, page } = useSelector(state => state.foryou);
    const { theme, getThemeStyle } = useContext(ThemeContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        dispatch(FetchForyouData({ page: 1, token }));
    }, []);

    const handleNext = () => {
        dispatch(FetchForyouData({ page, token }));
    }

    return (
        <div className='middle-side' style={getThemeStyle(theme)}>
            <InfiniteScroll
                style={{ width: '100%' }}
                dataLength={ForyouData.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<h2>Loading...</h2>}
                endMessage={<p style={{ textAlign: "center" }}>
                    No More data
                </p>}
            >
                {ForyouData.map((item) => (
                    <CommonPollList key={item.id} item={item} />
                ))}
            </InfiniteScroll>
        </div>
    )
}