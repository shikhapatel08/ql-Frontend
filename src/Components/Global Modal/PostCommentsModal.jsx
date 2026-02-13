import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import "./PostCommentsModal.css";
import Profile from "../../assets/Profile/profile.svg";
import { useDispatch, useSelector } from "react-redux";
import { addTempComment, CommentAction, CommentData, CommentDelete, CommentEdit, CommentLike, deleteCommentTree, incrementReplyCount } from "../../Redux/Features/CommentSlice";
import { ThemeContext } from "../../Context/ThemeContext";
import { AnswerPollAction } from "../../Redux/Features/AnswerpollSlice";
import { useModal } from "../../Context/ModalContext";
import EditCommentModal from "./EditCommentModal";
import GlobalModal from "./GlobalModal";
import CommentItem from "../../Common Components/CommentItem";
import { addTempReply, clearRecomments, RecommentData } from "../../Redux/Features/RecommentSlice";

const Baseurl = import.meta.env.VITE_ASSET_URL;

const PostCommentsModal = ({ postUser, comments, onClose, item, isResposted }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [currentParentComment, setCurrentParentComment] = useState(null);

  const loading = useSelector(state => state.comment.FetchingLoading);
  const commentLoading = useSelector(state => state.comment.loading);
  const { getThemeStyle, theme } = useContext(ThemeContext);
  const { openModal, closeModal } = useModal();
  const [commentStack, setCommentStack] = useState([]);

  const repliesRaw = useSelector(state => state.recomment.comments);
  const replyLoading = useSelector(state => state.recomment.loading);

  const localComments = comments || [];
  const currentUser = useSelector(state => state.signin.User?.data || {});
  const myId = currentUser?.id;

  useEffect(() => {
    if (item?.id) {
      dispatch(CommentAction({ poll_id: item.id }));
    }
  }, [dispatch, item?.id]);

  const mainComments = useMemo(() =>
    localComments.filter(c => !c.parent_comment_id),
    [localComments]
  );


  const handleSendComment = useCallback(async () => {
    const trimmedComment = newComment?.trim();
    if (!trimmedComment || !currentUser?.id) return;

    const parentId =
      replyingTo?.id ||
      replyingTo?.tempId ||
      currentParentComment?.id ||
      currentParentComment?.tempId ||
      null;

    let finalText = trimmedComment;

    if (replyingTo?.User?.user_name) {
      const mentionPrefix = `@${replyingTo.User.user_name}`;
      if (trimmedComment.startsWith(mentionPrefix)) {
        finalText = trimmedComment.slice(mentionPrefix.length).trim();
      }
    }

    const tempId = Date.now();
    const tempComment = {
      tempId,
      text: finalText,
      User: currentUser,
      parent_comment_id: parentId,
      is_liked: false,
      is_disliked: false,
    };

    if (parentId) {
      dispatch(addTempReply(tempComment));
    } else {
      dispatch(addTempComment(tempComment));
    }

    setNewComment("");
    setReplyingTo(null);

    try {
      await dispatch(CommentData({
        poll_id: item.id,
        text: finalText,
        user_id: currentUser.id,
        parent_comment_id: parentId,
        tempId
      })).unwrap();

      if (parentId && replyingTo) {
        dispatch(incrementReplyCount({ commentId: parentId }));
      }

      if (parentId && replyingTo) {
        setCommentStack(prev => {
          const last = prev[prev.length - 1];
          if (!currentParentComment) return prev;
          if (last?.id === currentParentComment?.id || last?.tempId === currentParentComment?.tempId) {
            return prev;
          }
          return [...prev, currentParentComment];
        });

        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  }, [newComment, replyingTo, currentUser, item.id, localComments, currentParentComment, dispatch]);

  const handleReply = useCallback((comment) => {
    setCurrentParentComment(comment);
    setReplyingTo(comment);
    setNewComment(`@${comment.User?.user_name || comment.user_name} `);
  }, []);

  const handleVote = useCallback((option_id) => {
    const poll_id = item.id;
    const group_id = item?.Groups?.[0]?.id;
    dispatch(AnswerPollAction({ poll_id, group_id, option_id }));
  }, [dispatch, item]);

  const handleCommentLike = useCallback((comment) => {
    dispatch(CommentLike({
      poll_id: item.id,
      comment_id: comment.id || comment.tempId,
      dislike: 0,
      del: comment.is_liked ? 1 : 0
    }));
  }, [dispatch, item.id]);

  const handleCommentDislike = useCallback((comment) => {
    dispatch(CommentLike({
      poll_id: item.id,
      comment_id: comment.id || comment.tempId,
      dislike: 1,
      del: comment.is_disliked ? 1 : 0
    }));
  }, [dispatch, item.id]);

  const handleRecomment = useCallback((comment) => {
    setCommentStack(prev => [...prev, currentParentComment]);

    setCurrentParentComment(comment);
    setReplyingTo(null);
    setNewComment("");

    const parentId = comment.id ?? comment.tempId;
    dispatch(RecommentData({
      poll_id: item.id,
      parent_comment_id: parentId,
      page: 1,
    }));
  }, [item.id, dispatch, currentParentComment]);


  const handleEditComment = useCallback((comment) => {
    openModal(
      <GlobalModal onClose={closeModal}>
        <EditCommentModal
          initialText={comment.text}
          onClose={closeModal}
          onSubmit={(updateText) => {
            dispatch(CommentEdit({
              comment_id: comment.id,
              text: updateText
            }));
          }}
        />
      </GlobalModal>
    );
  }, [dispatch, openModal, closeModal]);

  const handleDelete = useCallback((comment) => {
    dispatch(deleteCommentTree({ commentId: comment.id || comment.tempId }));

    dispatch(clearRecomments());

    setCurrentParentComment(null);
    setReplyingTo(null);

    dispatch(CommentDelete({ comment_id: comment.id }));
  }, [dispatch]);


  const renderSingleLevelComments = (list, level = 0) => {
    return list.map((comment) => (
      <CommentItem
        key={comment.id || comment.tempId}
        comment={comment}
        myId={myId}
        level={level}
        onLike={handleCommentLike}
        onDislike={handleCommentDislike}
        onRecomment={handleRecomment}
        onReply={handleReply}
        onEdit={handleEditComment}
        onDelete={handleDelete}
      />
    ));
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="post-comments-layout"
        onClick={(e) => e.stopPropagation()}
        style={getThemeStyle(theme)}
      >
        <div className="post-side">
          <div className="placeholder-post">
            <div className="left">
              <img
                src={postUser?.profile ? `${Baseurl}${postUser.profile}` : Profile}
                alt="Profile"
              />
              <span className="username">{postUser?.user_name}</span>
            </div>

            {(item.attachments?.length > 0 || item.attachment) && (
              <div className="post-image">
                {isResposted && <p className="circle-name">{item?.User?.user_name}</p>}
                {item.attachments?.length > 0 ? (
                  <img
                    className="post-img-a"
                    src={`${Baseurl}${item.attachments[0].attachment}`}
                    alt="post"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : item.attachment ? (
                  <img
                    src={`${Baseurl}${item.attachment}`}
                    alt="post"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : null}
              </div>
            )}

            <div className="content" style={getThemeStyle(theme)}>
              {(item.Options?.length > 0 || item.parentPoll?.Options?.length > 0) ? (
                <div className="poll-options">
                  <p style={{ textAlign: "start" }}>
                    <b>{item.question || item.parentPoll?.question}</b>
                  </p>
                  {(item.Options?.length > 0 ? item.Options : item.parentPoll.Options).map(
                    (opt) => (
                      <div
                        key={opt.id}
                        className="poll-option"
                        onClick={() => handleVote(opt.id)}
                      >
                        <span>{opt.option}</span>
                        <span>{opt.votesCount || 0} votes</span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={{ textAlign: "start" }}>
                  <b>{item.question}</b>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="comments-side" style={getThemeStyle(theme)}>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>

          <div className="comments-body">
            {loading && <p>Loading comments...</p>}

            {!currentParentComment && !loading && (
              mainComments.length === 0 ? (
                <div className="no-comments">
                  <h4>No comments yet!</h4>
                  <p>Be the first one to leave a comment</p>
                </div>
              ) : (
                renderSingleLevelComments(mainComments, 0)
              )
            )}

            {currentParentComment && (
              <div className="replies-page">
                <button
                  className="btn"
                  onClick={() => {
                    const previous = commentStack[commentStack.length - 1] || null;

                    setCommentStack(prev => prev.slice(0, -1)); // pop stack
                    setCurrentParentComment(previous);
                    setReplyingTo(null);
                  }}
                >
                  ← All Comments
                </button>

                <div className="replies-tree">
                  <div className="replies-tree">
                    {replyLoading ? (
                      <p>Loading replies...</p>
                    ) : (
                      <>
                        <CommentItem
                          comment={currentParentComment}
                          myId={myId}
                          level={0}
                          onLike={handleCommentLike}
                          onDislike={handleCommentDislike}
                          onRecomment={handleRecomment}
                          onReply={handleReply}
                          onEdit={handleEditComment}
                          onDelete={handleDelete}
                        />

                        {renderSingleLevelComments(
                          repliesRaw.filter(
                            r =>
                              r.parent_comment_id === currentParentComment.id ||
                              r.parent_comment_id === currentParentComment.tempId
                          ),
                          1
                        )}
                      </>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          <div className="comment-input">
            <div className="input-wrapper" style={getThemeStyle(theme)}>
              <input
                style={getThemeStyle(theme)}
                placeholder={replyingTo
                  ? `Replying to ${replyingTo.User?.user_name || replyingTo.user_name || 'user'}...`
                  : "Add your comment..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendComment()}
              />
              <button onClick={handleSendComment} disabled={commentLoading || !newComment.trim()}>
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentsModal;
