import { useDispatch, useSelector } from "react-redux"
import { CommonPollList } from "../../Common Components/CommonPollList";
import { useContext, useEffect } from "react";
import { FetchSavedpost } from "../../Redux/Features/SavedPost";
import { ThemeContext } from "../../Context/ThemeContext";

export default function SavedPost() {
    const { post, loading } = useSelector(state => state.savedPost);
    const dispatch = useDispatch();
    const { theme, getThemeStyle } = useContext(ThemeContext);


    useEffect(() => {
        dispatch(FetchSavedpost({ page: 1 }));
    }, []);


    return (
        <div className="middle-side" style={getThemeStyle(theme)}>
            {loading && <h2>Loading...</h2>}

            {!loading && post?.length > 0 && (
                post.map((item) => (
                    <CommonPollList key={item.id} item={item} />
                ))
            )}

            {!loading && post?.length === 0 && (
                <h2>No saved posts found.</h2>
            )}
        </div>
    )
}