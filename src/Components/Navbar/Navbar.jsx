import Black from '../../assets/search/black-search.png'
import White from '../../assets/search/white-search.png'
import Button from '../Button/Button'
import Profile from '../../assets/Profile/profile.svg'
import '../Navbar/Navbar.css'
import Logo from '../../assets/logo/logo.png'
import { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../Context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FetchSearchingData, Searching } from '../../Redux/Features/SearchingSlice'
import { useModal } from '../../Context/ModalContext'
import GlobalModal from '../Global Modal/GlobalModal'
import LogoutModal from '../Global Modal/LogoutModal'
import { toast } from 'react-toastify'

export default function Navbar() {
    const { theme, getThemeStyle } = useContext(ThemeContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { SearchingData } = useSelector(state => state.search);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const { User } = useSelector(state => state.signin);
    const Baseurl = import.meta.env.VITE_ASSET_URL;
    const { openModal, closeModal } = useModal();

    const handleSignIn = () => navigate(`/signin`);

    const handleOnChange = () => {
        dispatch(Searching());
    };
    useEffect(() => {
        if (typeof SearchingData === "string" && SearchingData.trim() !== "") {
            dispatch(FetchSearchingData(SearchingData));
        }
    }, [SearchingData, dispatch]);

    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutSide);
        return () => { document.removeEventListener('mousedown', handleClickOutSide) };
    }, []);

    const Logout = () => {
        localStorage.removeItem('token');
        navigate('/');
        toast.success('Logout Succesfully!');
    };

    const handleLogout = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <LogoutModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await Logout();
                        closeModal();
                    }}
                />
            </GlobalModal>
        )
    }

    const handleProfile = () => {
        navigate(`/CurrentuserProfile/${User?.data?.user_name}`);
    }

    const handlelogo = () => {
        navigate('/');
    }

    const handleCreatePost = () => {
        navigate('/createpost');
    }
    return (
        <>
            <div className='navbar-container' style={getThemeStyle(theme)}>
                <header>
                    <div className='nav-box'>
                            <img
                                className='nav-logo-btn' 
                                onClick={handlelogo}
                                src={Logo}
                                alt='logo'
                            />
                    </div>
                    <div className='navbar'>
                        <div className='navbar-item'>
                            <p className='post'>Posts</p>
                            <button className='navbar-button'>⮟</button>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M13.7053 0.761594L13.7056 0.761922C13.8307 0.886704 13.9 1.0561 13.9 1.23531C13.8998 1.41497 13.8304 1.58706 13.7056 1.71169L13.7055 1.71181L7.47572 7.95281C7.4757 7.95283 7.47568 7.95285 7.47566 7.95287C7.34494 8.08346 7.17701 8.16917 7.00506 8.16917H7.00267C6.82892 8.16917 6.66103 8.08347 6.53047 7.95296C6.53042 7.95292 6.53038 7.95288 6.53034 7.95283L0.294839 1.69491L0.294686 1.69476C0.0351048 1.43537 0.0351048 1.0126 0.294686 0.753215L0.29473 0.75317L0.753415 0.294257C0.753421 0.294251 0.753427 0.294246 0.753433 0.29424C0.878752 0.16893 1.04561 0.1 1.22438 0.1C1.40316 0.1 1.5699 0.168929 1.6951 0.294229L1.69512 0.294257L6.93242 5.53155L7.00313 5.60226L7.07384 5.53155L12.3051 0.30009C12.3051 0.30008 12.3051 0.300071 12.3051 0.300061C12.4306 0.174689 12.5974 0.105691 12.7761 0.105691C12.9548 0.105691 13.1213 0.174614 13.2468 0.299901C13.2468 0.299964 13.2469 0.300027 13.247 0.30009L13.7053 0.761594ZM6.93242 5.39013L1.76584 0.223547L7.07384 5.39013L7.00313 5.46084L6.93242 5.39013Z" fill="#0f1419" stroke="#C5C6C8" stroke-width="0.2"></path></svg> */}
                        </div>
                        <div className="divider"></div>
                        <input
                            text='text'
                            className='search-input'
                            placeholder='Search for posts, users & many more'
                            value={SearchingData}
                            onChange={(e) => (handleOnChange(e.target.value))}
                        />
                        <button className='search-btn'>
                            <img
                                src={theme === 'dark' ? Black : White}
                                alt='searchicon'
                                className='search-icon'
                            />
                        </button>
                    </div>
                    <div className='navbar-right'>
                        <div className='post-btn'>
                            <Button className='header-post-btn' onClick={handleCreatePost}>
                                Create Post
                            </Button>
                        </div>
                        {User && localStorage.getItem('token') ? (
                            <div className="profile-wrapper" ref={menuRef} >
                                <img
                                    src={User?.data?.profile
                                        ? `${Baseurl}${User.data.profile}`
                                        : Profile}
                                    alt='Profile'
                                    className="profile-img"
                                    onClick={() => setOpen(!open)}
                                />
                                {open && (
                                    <div className="profile-dropdown" style={getThemeStyle(theme)}>
                                        <button className="dropdown-item" onClick={handleProfile}>Your Profile</button>
                                        <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button onClick={handleSignIn}>Sign In</Button>
                        )}
                    </div>
                </header>
            </div>

        </>
    )
}