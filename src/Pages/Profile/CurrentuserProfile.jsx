import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchUserProfile, UserPost } from "../../Redux/Features/UserprofileSlice";
import ProfileCard from "../../Common Components/ProfileCard";
import { CommonPollList } from "../../Common Components/CommonPollList";

export default function CurrentUserProfile() {
    const dispatch = useDispatch();
    const { username } = useParams();

    const currentUser = useSelector(state => state.profile.currentUser);
    const viewedUserPosts = useSelector(state => state.profile.viewedUserPosts);
    const { loading } = useSelector(state => state.profile);



    useEffect(() => {
        dispatch(FetchUserProfile({ username, page: 1 }));
        dispatch(UserPost({ username, page: 1 }));
    }, [username, dispatch]);


    return (
        <div className="profile-container">
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <ProfileCard user={currentUser} showBackButton={true} data={viewedUserPosts} />
            )}
        </div>
    );
}
