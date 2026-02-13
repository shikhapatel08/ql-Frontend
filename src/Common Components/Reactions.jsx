import React, { useState } from "react";
import '../Common Components/Reactions.css';
import { useDispatch, useSelector } from "react-redux";
import { togglePost } from "../Redux/Features/SavedPost";
import { useNavigate } from "react-router-dom";
import { FetchLikeData } from "../Redux/Features/LikeSlice";
import { FetchSaveData } from "../Redux/Features/saveSlice";
import { FetchRepostData, UnoPost } from "../Redux/Features/RepostSlice";
import { toast } from "react-toastify";
import { useModal } from "../Context/ModalContext";
import PostCommentsContainer from "../Components/PostCommentContainer";
import { toggleIdInStorage, isIdStored } from "../Components/localStoragePosts";

const ReactionBar = ({ likes, isLiked, comments, postId, isScheduled, item }) => {

    const [liked, setLiked] = useState(() => isIdStored("likedPosts", postId) || isLiked || false);
    const [likeCount, setLikeCount] = useState(likes || 0);
    const { post } = useSelector(state => state.savedPost);
    const saved = isIdStored("savedPosts", postId) || post.some(p => p.id === postId);
    const [isResposted, setIsResposted] = useState(() => isIdStored("repostedPosts", postId));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { openModal, closeModal } = useModal();

    const bolckIfSchedule = (callback) => {
        if (isScheduled) return;
        callback && callback();
    }

    const isLoggedIn = () => localStorage.getItem("token");

    const requireLogin = (callback) => {
        if (!isLoggedIn()) {
            navigate('/signin');
            return;
        }
        callback && callback();
    }

    const handleLike = () => {
        bolckIfSchedule(() => {
            requireLogin(() => {
                const newLiked = !liked;
                setLiked(newLiked);
                setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

                toggleIdInStorage("likedPosts", postId);

                dispatch(FetchLikeData({
                    poll_id: postId,
                    dislike: newLiked ? 0 : 1,
                    deleteLike: newLiked ? 0 : 1
                }));
            });
        });
    };

    const handleSave = () => {
        bolckIfSchedule(() => {
            requireLogin(() => {
                dispatch(togglePost(postId));

                const isCurrentSave = post.some(p => p.id === postId);

                dispatch(FetchSaveData({
                    poll_id: postId,
                    unsave: isCurrentSave ? 1 : 0
                }));

                toggleIdInStorage("savedPosts", postId);
            });
        });
    };

    const handleRepost = () => {
        bolckIfSchedule(() => {
            requireLogin(async () => {
                const newState = !isResposted;

                // Optimistic UI
                setIsResposted(newState);
                toggleIdInStorage("repostedPosts", postId);

                try {
                    if (newState) {
                        await dispatch(FetchRepostData({ parent_pid: postId })).unwrap();
                        toast.success("Reposted successfully!");
                    } else {
                        await dispatch(UnoPost({ parent_pid: postId })).unwrap();
                        toast.success("Repost removed");
                    }
                } catch (err) {
                    setIsResposted(!newState);
                    toggleIdInStorage("repostedPosts", postId);
                    toast.error("Something went wrong. Try again.",err);
                }
            });
        });
    };


    const handleOpenComment = () => {
        openModal(
            <PostCommentsContainer
                poll_id={postId}
                onClose={closeModal}
                item={item}
                isResposted={isResposted}
            />
        )
    };

    return (
        <div className="reaction-bar">
            {/* like */}
            <div className="reaction-left">
                <button className="left-btn" onClick={handleLike}
                    style={{
                        color: 'inherit',
                        opacity: isScheduled ? 0.5 : 1,
                        cursor: isScheduled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isScheduled}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z"
                            stroke={liked ? 'none' : 'currentColor'}
                            strokeWidth="1.5"
                            fill={liked ? 'red' : 'none'}
                        />
                    </svg>
                    <span>{likeCount}</span>
                </button>
            </div>

            {/* comments */}
            <div className="reaction-left">
                <button className="left-btn" disabled={isScheduled}
                    onClick={handleOpenComment}
                    style={{
                        opacity: isScheduled ? 0.5 : 1,
                        cursor: isScheduled ? 'not-allowed' : 'pointer'
                    }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                        />
                    </svg>
                    <span>{comments}</span>
                </button>
            </div>

            {/* repost */}
            <div className="reaction-right" >
                <button className="right-btn" disabled={isScheduled}
                    onClick={handleRepost}
                    style={{
                        opacity: isScheduled ? 0.5 : 1,
                        cursor: isScheduled ? 'not-allowed' : 'pointer'
                    }}>
                    <div className='repost-icon'>
                        {isResposted ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 1l4 4-4 4" stroke="url(#grad)" strokeWidth="1.5" />
                                <path d="M3 11V9a4 4 0 014-4h14" stroke="url(#grad)" strokeWidth="1.5" />
                                <path d="M7 23l-4-4 4-4" stroke="url(#grad)" strokeWidth="1.5" />
                                <path d="M21 13v2a4 4 0 01-4 4H3" stroke="url(#grad)" strokeWidth="1.5" />
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        )}
                    </div>
                </button>
            </div>

            {/* save */}
            <div className="reaction-right" >
                <button className="right-btn" onClick={handleSave}
                    style={{
                        opacity: isScheduled ? 0.5 : 1,
                        cursor: isScheduled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isScheduled}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M6 2h12a2 2 0 012 2v18l-8-5-8 5V4a2 2 0 012-2z"
                            stroke={saved ? 'none' : 'currentColor'}
                            strokeWidth="1.5"
                            fill={saved ? 'currentColor' : 'none'}
                        />
                    </svg>
                </button>
            </div>

            {/* share */}
            <div className="reaction-right" >
                <button className="right-btn"
                    style={{
                        opacity: isScheduled ? 0.5 : 1,
                        cursor: isScheduled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isScheduled}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M16 6l-4-4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M12 2v14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ReactionBar;
