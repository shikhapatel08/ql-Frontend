import { useContext, useEffect, useRef, useState } from 'react';
import '../Common Components/CommonPollList.css';
import Button from '../Components/Button/Button';
import { ThemeContext } from '../Context/ThemeContext';
import ReactionBar from './Reactions';
import Profile from '../assets/Profile/profile.svg';
import { useDispatch, useSelector } from 'react-redux';
import { FetchFollowData } from '../Redux/Features/FollowSlice';
import { AnswerPollAction, updatePoll } from '../Redux/Features/AnswerpollSlice';
import { DeletePost } from '../Redux/Features/DeletepostSlice';
import { toast } from 'react-toastify';
import { useModal } from '../Context/ModalContext';
import GlobalModal from '../Components/Global Modal/GlobalModal';
import DeleteModal from '../Components/Global Modal/DeletePostModal';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';

export const CommonPollList = ({ item }) => {
    const { theme, getThemeStyle } = useContext(ThemeContext);
    const Baseurl = import.meta.env.VITE_ASSET_URL;
    const Url = import.meta.env.VITE_URL;
    const dispatch = useDispatch();
    const { FollowedUser } = useSelector(state => state.follow);
    // const currentUser = useSelector(state => state.profile.userDetail);
    // const myId = currentUser?.id;

    // const isFollowing = Array.isArray(FollowedUser)
    //     ? FollowedUser.some(user => user.id === item?.User?.id)
    //     : !!FollowedUser?.[item?.User?.id];

    const isScheduled = item?.scheduled === 1;

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const { openModal, closeModal } = useModal();

    const navigate = useNavigate();

    // Select the poll from Redux state
    const pollFromRedux = useSelector(state =>
        state.answerpoll?.polls?.find(p => p.id === item.id)
    ) || { ...item, userVotedOptionId: null };

    const pollOptions = pollFromRedux?.Options || [];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // const handleFollow = () => {
    //     dispatch(FetchFollowData({ poll_id: item?.User?.id }));
    // };

    const handleVote = (option_id) => {
        const poll_id = item.id;
        const group_id = item?.Groups?.[0]?.id;
        const prevVoted = pollFromRedux.userVotedOptionId;

        const updatedOptions = pollOptions.map(opt => {
            if (prevVoted && opt.id === prevVoted) {
                return { ...opt, votesCount: Math.max((opt.votesCount || 1) - 1, 0) };
            }
            if (opt.id === option_id) {
                return { ...opt, votesCount: (opt.votesCount || 0) + 1 };
            }
            return opt;
        });

        dispatch(updatePoll({
            ...pollFromRedux,
            Options: updatedOptions,
            userVotedOptionId: option_id,
        }));

        dispatch(AnswerPollAction({ poll_id, group_id, option_id }));
    };

    const handleCopyText = () => {
        const pollText = item.question || item.parentPoll?.question;
        navigator.clipboard.writeText(pollText)
            .then(() => toast.success('Text copied to clipboard!'))
            .catch(err => console.error('Failed to copy text:', err));
    };

    const handleCopyLink = async () => {
        const postLink = `${Url}/user/${item?.User?.user_name}/${item?.id}`;
        try {
            await navigator.clipboard.writeText(postLink);
            toast.success('Link Copied!');
        } catch (error) {
            toast.error('Failed to copy link', error);
        }
    };

    const handleDelete = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <DeleteModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await dispatch(DeletePost({ poll_id: item.id }));
                        toast.success('Post deleted successfully!');
                        closeModal();
                    }}
                />
            </GlobalModal>
        );
    };

    const handleProfile = () => {
        navigate(`/user/${item?.User?.user_name}`);
    }
    return (
        <div className='common-polllist' style={getThemeStyle(theme)}>
            <div className='user-info'>
                <div className='left'>
                    <img
                        src={item?.User?.profile ? `${Baseurl}${item?.User?.profile}` : Profile}
                        alt='Profile'
                        onClick={handleProfile}
                    />
                    <span className='username'>{item?.User?.user_name}</span>
                    <span className='time'>{new Date(item?.createdAt).toLocaleString()}</span>
                </div>
                <div className='right-controls' ref={menuRef}>
                    {/* {item?.User?.id !== myId && (
                        <Button className='follow-btn' onClick={handleFollow}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                    )} */}
                    <span className='menu-icon' onClick={() => setOpen(!open)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                        </svg>
                        {open && (
                            <div className='menu-dropdown' style={getThemeStyle(theme)}>
                                <button style={getThemeStyle(theme)} onClick={handleCopyLink}>Copy Link</button>
                                {(item.question || item.parentPoll?.question) && (
                                    <button style={getThemeStyle(theme)} onClick={handleCopyText}>Copy Text</button>
                                )}
                                <button style={{ ...getThemeStyle(theme), color: 'red' }} onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </span>
                </div>
            </div>

            {(item.attachments?.length > 0 || item.attachment) && (
                <div className='post-img'>
                    <img
                        src={`${Baseurl}${item.attachments?.[0]?.attachment || item.attachment}`}
                        alt='post'
                        onError={(e) => (e.target.style.display = "none")}
                    />
                </div>
            )}

            <div className='content' style={getThemeStyle(theme)}>
                {pollOptions.length > 0 ? (
                    <div className='poll-options'>
                        <p style={{ textAlign: 'start' }}>
                            <b>{item.question || item.parentPoll?.question}</b>
                        </p>
                        {pollOptions.map(opt => (
                            <div
                                key={opt.id}
                                className={`poll-option ${pollFromRedux.userVotedOptionId === opt.id ? 'voted' : ''}`}
                                onClick={() => handleVote(opt.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span>{opt.option}</span>
                                <span>{opt.votesCount || 0} votes</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'start', color: 'inherit' }}>
                        <b>{item.question}</b>
                    </p>
                )}
            </div>

            <ReactionBar
                style={getThemeStyle(theme)}
                postId={item?.id}
                likes={item?.totalLikes}
                isLiked={item?.isLiked}
                comments={item?.totalComments}
                isSaved={item?.isSaved}
                isScheduled={isScheduled}
                item={item}
            />
        </div>
    );
};
