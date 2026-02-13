import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";
import './ProfileCard.css'
import { CommonPollList } from "./CommonPollList";

export default function ProfileCard({ user, showBackButton = false, data }) {
  const navigate = useNavigate();
  const { theme, getThemeStyle } = useContext(ThemeContext);

  const BASE_ASSET_URL = import.meta.env.VITE_ASSET_URL;


  return (
    <div className="profile-page" style={getThemeStyle(theme)}>
      <div
        className="profile-banner"
        style={{
          backgroundImage: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        {user.banner && <img src={`${BASE_ASSET_URL}${user.banner}`} />}
      </div>
      <div className="profile-header">
        {showBackButton && (
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <img
          className="profile-avatar"
          src={
            user?.profile
              ? `${BASE_ASSET_URL}${user.profile}`
              : "/default-profile.png"
          }
          alt="profile"
        />
      </div>

      <div className="profile-info">
        <h2>{user?.name}</h2>
        <p className="username">@{user?.user_name}</p>

        {user?.bio && <p className="bio">{user.bio}</p>}

        <div className="stats">
          <span><b>{user?.following || 0}</b> Following</span>
          <span><b>{user?.followers || 0}</b> Followers</span>
          <span><b>{user?.inner_circle_users || 0}</b> Inner Circle</span>
        </div>

        <div className="meta">
          {user?.city && <span>📍 {user.city}, {user.country}</span>}
          {user?.education && <span>🎓 {user.education}</span>}
        </div>

        <div className="posts-section">
          <div className="posts-container">
            {data?.map((post) => (
              <CommonPollList key={post.id} item={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
