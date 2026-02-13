import React, { useContext } from 'react';
import './CommonItem.css'
import { ThemeContext } from '../Context/ThemeContext';

const Baseurl = import.meta.env.VITE_ASSET_URL;


const CommentItem = ({
    comment,
    myId,
    onLike,
    onDislike,
    onRecomment,
    onReply,
    onEdit,
    onDelete,
    level = 0
}) => {
    const { getThemeStyle, theme } = useContext(ThemeContext);

    const hasAnyAction =
        comment?.is_liked ||
        comment?.is_disliked ||
        comment?.replyCount > 0;

    return (
        <div className={`comment-item ${level > 0 ? "reply-item" : "parent-comment"}`} style={{ ...getThemeStyle(theme), marginLeft: level * 20 }}>
            <div className="comment-content-col" style={getThemeStyle(theme)}>

                <div className="comment-card" style={getThemeStyle(theme)}>

                    <div className="comment-header" style={getThemeStyle(theme)}>
                        <img
                            className="profile-img"
                            src={
                                comment?.User?.profile
                                    ? `${Baseurl}${comment?.User?.profile}`
                                    : "/default-profile.png"
                            }
                            alt="profile"
                        />
                        <span className="comment-username">
                            {comment?.User?.user_name || "Unknown"}
                        </span>
                    </div>

                    {comment?.attachment && (
                        <div className="comment-image-wrapper">
                            <img
                                src={`${Baseurl}${comment.attachment}`}
                                alt="comment"
                                className="comment-image"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </div>
                    )}

                    {(comment?.text || comment?.comment_text)?.trim() && (
                        <p className="comment-text" style={getThemeStyle(theme)}>{comment.text || comment.comment_text}</p>
                    )}

                </div>

                {/* ACTIONS */}
                <div className="comment-actions">
                    <span onClick={() => onLike(comment)}>
                        <svg viewBox="0 0 24 24" width="22" height="22"
                            fill={comment?.is_liked ? 'red' : 'currentColor'}>
                            <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h7c.82 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.2l-.01-.02z" />
                        </svg>
                    </span>

                    <span onClick={() => onDislike(comment)}>
                        <svg viewBox="0 0 24 24" width="22" height="22"
                            fill={comment?.is_disliked ? 'red' : 'currentColor'}>
                            <path d="M2 3v12h4V3H2zm20 8c0 1.1-.9 2-2 2h-6.31l.95 4.57.03.32c0 .41-.17-.79-.44 1.06L13.17 22l-5.58-5.59C7.22 16.05 7 15.55 7 15V5c0-1.1.9-2 2-2h7c.82 0 1.54.5 1.84 1.22l3.02 7.05c.09.23.14.47.14.73v1.2l-.01-.02z" />
                        </svg>
                    </span>

                    {comment?.replyCount > 0 && (
                        <span className="reply-icon" onClick={() => onRecomment(comment)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </span>
                    )}

                    <span onClick={() => onReply(comment)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 7L4 12L9 17V13H14C17.314 13 20 10.314 20 7H18C18 9.209 16.209 11 14 11H9V7Z" />
                        </svg>
                    </span>

                    {comment?.User?.id === myId && (
                        <>
                            {!hasAnyAction &&
                                <span onClick={() => onEdit(comment)}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.41 2.41L4 18.83V20h1.17l.24-.34zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                                    </svg>
                                </span>
                            }
                            <span onClick={() => onDelete(comment)}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="red">
                                    <path d="M3 6h18v2H3V6zm2 3h14v12H5V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2z" />
                                </svg>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
