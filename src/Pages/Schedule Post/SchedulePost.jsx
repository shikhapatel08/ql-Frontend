import { useDispatch, useSelector } from "react-redux"
import { CommonPollList } from "../../Common Components/CommonPollList";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { FetchSchedulePost } from "../../Redux/Features/SchedulepostSlice";

export default function SchedulePost() {
    const { schedulePost, loading } = useSelector(state => state.schedulepost);
    const dispatch = useDispatch();
    const { theme, getThemeStyle } = useContext(ThemeContext);


    useEffect(() => {
        dispatch(FetchSchedulePost({ page: 1 }));
    }, []);


    return (
        <div className="middle-side" style={getThemeStyle(theme)}>
            {loading && <h2>Loading...</h2>}
            {!loading && schedulePost?.length > 0 && (
                schedulePost.map((item) => (
                    <CommonPollList key={item.id} item={item} />
                ))
            )}
            {!loading && schedulePost?.length === 0 && (
                <h2>No saved posts found.</h2>
            )}
        </div>
    )
}