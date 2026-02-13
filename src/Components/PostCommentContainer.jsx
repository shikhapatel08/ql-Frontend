import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCommentsModal from "../Components/Global Modal/PostCommentsModal";
import { CommentAction } from "../Redux/Features/CommentSlice";

const PostCommentsContainer = ({ poll_id, onClose, item, isResposted }) => {
  const dispatch = useDispatch();
  
  const FetchingLoading = useSelector(state => state.comment.FetchingLoading);
  // const loading = useSelector(state => state.comment.loading);
  // const error = useSelector(state => state.comment.error);
  const commentsData = useSelector(state => state.comment.comments || { comments: [] });
  const localComments = commentsData.comments || [];

  useEffect(() => {
    if (poll_id) {
      dispatch(CommentAction({ poll_id }));
    }
  }, [dispatch, poll_id]);


  return (
    <PostCommentsModal
      postUser={item?.User?.data || item?.User}      
      comments={localComments}                       
      loading={FetchingLoading}                      
      item={item}
      isResposted={isResposted}
      onClose={onClose}
    />
  );
};

export default PostCommentsContainer;
