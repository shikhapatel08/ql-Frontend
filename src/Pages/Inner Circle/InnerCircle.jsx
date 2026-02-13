import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FetchInnercircleData } from "../../Redux/Features/InnercircleSlice";
import { CommonPollList } from "../../Common Components/CommonPollList";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThemeContext } from "../../Context/ThemeContext";

export default function InnerCircle() {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const { innerCircleData, page, hasMore } = useSelector(state => state.innercircle);
    const { theme, getThemeStyle } = useContext(ThemeContext);


    useEffect(() => {
        dispatch(FetchInnercircleData({ page: 1, token }))
    }, []);

    const handleNext = () => {
        dispatch(FetchInnercircleData({ page }))
    };
    return (
        <div className='middle-side' style={getThemeStyle(theme)}>
            <InfiniteScroll
                style={{ width: '100%' }}
                dataLength={innerCircleData.length}
                next={handleNext}
                hasMore={hasMore}
                loader={<h2>Loading...</h2>}
                endMessage={<p style={{ textAlign: "center" }}>
                    No More data
                </p>}
            >
                {innerCircleData.map((item) => (
                    
                    <CommonPollList key={item.id} item={item} />
                ))}
            </InfiniteScroll>
        </div>
    )
}