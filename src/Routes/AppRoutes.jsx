import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar/sidebar";
import Trending from "../Pages/Trending/Trending";
import Latest from "../Pages/Latest/Latest";
import SavedPost from "../Pages/Saved Post/SavedPost";
import SignIn from "../Pages/SignIn-up/SignIn";
import Signup from "../Pages/SignIn-up/SignUp";
import Foryou from "../Pages/For You/Foryou"
import InnerCircle from "../Pages/Inner Circle/InnerCircle";
import Profile from "../Pages/Profile/Profile";
import MyPost from "../Pages/My Post/MyPost";
import SchedulePost from "../Pages/Schedule Post/SchedulePost";
import CreatePost from "../Pages/Create Post/CreatePost";
import CurrentUserProfile from "../Pages/Profile/CurrentuserProfile";

export default function AppRoutes() {
    const location = useLocation();
    const hideNavbarOn = ["/signin", "/signup"];
    return (
        <>
            {!hideNavbarOn.includes(location.pathname) && (
                <>
                    <Navbar />
                    <Sidebar />
                </>)}
            <Routes>
                <Route path='/' element={<Trending />} />
                <Route path='/latest' element={<Latest />} />
                <Route path='/saved-posts' element={<SavedPost />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/for-you' element={<Foryou />} />
                <Route path='/inner-circle' element={<InnerCircle />} />
                <Route path='/user/:username' element={<Profile />} />
                <Route path='/my-posts' element={<MyPost />} />
                <Route path='/scheduled-post' element={<SchedulePost />} />
                <Route path='/createpost' element={<CreatePost />} />
                <Route path='/CurrentuserProfile/:username' element={<CurrentUserProfile/>}/>
            </Routes>
        </>
    )
}