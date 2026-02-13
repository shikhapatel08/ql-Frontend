import { configureStore } from '@reduxjs/toolkit'
import TrendingReducer from '../Features/TrendingSlice'
import SavedPostReducer from '../Features/SavedPost'
import RecentReducer from '../Features/RecentSlice'
import SearchingReducer from '../Features/SearchingSlice'
import SigninReducer from '../Features/SignInSlice'
import ForyouReducer from '../Features/ForyouSlice'
import InnercircleReducer from '../Features/InnercircleSlice'
import MypostReducer from '../Features/MypostSlice'
import SchedulepostReducer from '../Features/SchedulepostSlice'
import LikeReducer from '../Features/LikeSlice'
import FollowReducer from '../Features/FollowSlice'
import RepostReducer from '../Features/RepostSlice'
import CreatePostReducer from '../Features/CreatePostSlice'
import CommentReducer from '../Features/CommentSlice'
import FileUploadReducer from '../Features/FileUploadSlice'
import DeletepostReducer from '../Features/DeletepostSlice'
import AnswerPollReducer from '../Features/AnswerpollSlice'
import ProfileReducer from '../Features/UserprofileSlice'
import RecommentReducer from '../Features/RecommentSlice'

export const store = configureStore({
  reducer: {
    trending: TrendingReducer,
    savedPost: SavedPostReducer,
    recent: RecentReducer,
    search: SearchingReducer,
    signin: SigninReducer,
    foryou: ForyouReducer,
    innercircle: InnercircleReducer,
    profile:ProfileReducer,
    mypost: MypostReducer,
    schedulepost: SchedulepostReducer,
    like: LikeReducer,
    follow:FollowReducer,
    repost:RepostReducer,
    createpost:CreatePostReducer,
    comment:CommentReducer,
    fileupload:FileUploadReducer,
    deletepost:DeletepostReducer,
    answerpoll:AnswerPollReducer,
    recomment:RecommentReducer,
  },
})