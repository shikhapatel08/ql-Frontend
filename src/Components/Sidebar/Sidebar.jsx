import { useContext } from 'react'
import '../Sidebar/Sidebar.css'
import { ThemeContext } from '../../Context/ThemeContext'
import { NavLink } from 'react-router-dom';
export default function Sidebar() {
    const { toggleTheme, theme, getThemeStyle } = useContext(ThemeContext);
    const isDark = theme === 'dark'

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    return (
        <>
            <div className='sidebar-container' style={getThemeStyle(theme)}>
                <div className='sidebar-menu'>
                    <div className='sidebar-menu-sections'>
                        <div className='sidebar-name'>
                            <br /><br />
                            <h3>Posts</h3>
                        </div>
                        <ul>
                            <li className='position-relative'>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) => isActive ? 'active-link' : ''}>
                                    Trending
                                </NavLink>
                            </li>
                            <li className='position-relative'>
                                <NavLink
                                    to="/latest"
                                    className={({ isActive }) => isActive ? 'active-link' : ''}>
                                    Latest
                                </NavLink>
                            </li>

                            {isLoggedIn && (
                                <>
                                    <li className='position-relative'>
                                        <NavLink
                                            to="/for-you"
                                            className={({ isActive }) => isActive ? 'active-link' : ''}>
                                            For You
                                        </NavLink>
                                    </li>
                                    <li className='position-relative'>
                                        <NavLink
                                            to="/inner-circle"
                                            className={({ isActive }) => isActive ? 'active-link' : ''}>
                                            Inner Circle
                                        </NavLink>
                                    </li>
                                    <li className='position-relative'>
                                        <NavLink
                                            to="/my-posts"
                                            className={({ isActive }) => isActive ? 'active-link' : ''}>
                                            My Posts
                                        </NavLink>
                                    </li>
                                    <li className='position-relative'>
                                        <NavLink
                                            to="/saved-posts"
                                            className={({ isActive }) => isActive ? 'active-link' : ''}>
                                            Saved Posts
                                        </NavLink>
                                    </li>
                                    <li className='position-relative'>
                                        <NavLink
                                            to="/scheduled-post"
                                            className={({ isActive }) => isActive ? 'active-link' : ''}>
                                            Scheduled Posts
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className='mode-toggle'>
                        <label className="theme-switcher">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={toggleTheme}
                                className="sr-only"
                            />

                            <span className={`slider ${isDark ? 'dark' : ''}`}>
                                <span className="dot"></span>
                            </span>

                            <span className="label">Mode</span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}