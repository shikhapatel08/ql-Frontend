import './CreatePost.css';
import Button from '../../Components/Button/Button';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreatePostAction } from '../../Redux/Features/CreatePostSlice';
import { UploadFile } from '../../Redux/Features/FileUploadSlice';
import { useModal } from '../../Context/ModalContext';
import GlobalModal from '../../Components/Global Modal/GlobalModal';
import PublishAckModal from '../../Components/Global Modal/PublishAckModal';
import { toast } from 'react-toastify';

const Baseurl = import.meta.env.VITE_ASSET_URL;

export default function CreatePost() {
    const { theme, getThemeStyle } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('post');
    const [question, setQuestion] = useState('');
    const [commentPermission, setCommentPermission] = useState('everyone');
    const [visibility, setVisibility] = useState('public');
    const [options, setOptions] = useState(['', '']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { openModal, closeModal } = useModal();
    const location = useLocation();

    // Redux File Upload state
    const { loading: fileLoading } = useSelector(state => state.fileupload);

    const tabs = [
        { id: 'poll', label: 'Create Poll', path: '/create-poll' },
        { id: 'post', label: 'Create Post', path: '/create-post' }
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file));
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    const publishPost = async () => {
        if (!question.trim() && !selectedFile) {
            toast.error("Please add text or upload a photo/video");
            return;
        }

        const payload = {
            temp_poll_id: `659_${Date.now()}`,
            type: activeTab,
            question: question.trim(),
            comment_permission: commentPermission,
            visibility,
            incognito: "0",
            ai_enhancement: "1",
            is_outcome: false,
            rmv_attachments: [],
            attachments: []
        };

        if (activeTab === "poll") {
            payload.options = options.map(o => o.trim()).filter(Boolean);
        }

        if (selectedFile) {
            const res = await dispatch(UploadFile(selectedFile));

            if (res.meta.requestStatus !== "fulfilled" || !res.payload?.file) {
                toast.error("File upload failed");
                return;
            }

            payload.attachments.push({
                attachment: res.payload.file,
                attch_name: selectedFile.name,
                attch_dimension: "auto,auto",
                thumbnail: null,
                is_in_html: 0
            });
        }

        const formData = new FormData();
        for (let key in payload) {
            if (Array.isArray(payload[key]) || typeof payload[key] === 'object') {
                formData.append(key, JSON.stringify(payload[key]));
            } else {
                formData.append(key, payload[key]);
            }
        }

        const res = await dispatch(CreatePostAction(formData));

        if (res.meta.requestStatus === "fulfilled") {
            toast.success(`Create ${activeTab} Successfully!`);
            const redirectPath = location.state?.form || "/";
            navigate(redirectPath);
        }
    };


    const handlePublish = () => {

        openModal(
            <GlobalModal onClose={closeModal}>
                <PublishAckModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await publishPost();
                        closeModal();
                    }}
                />
            </GlobalModal>
        )
    };

    return (
        <div className="create-post-container" style={getThemeStyle(theme)}>
            <div className="create-post-back">
                <br></br>
                <h2 style={{ color: 'inherit' }}>Create Post</h2>
            </div>

            <div className="create-post-tabs" style={getThemeStyle(theme)}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`create-post-tab ${activeTab === tab.id ? 'create-post-tab-main' : ''}`}
                        style={getThemeStyle(theme)}
                        onClick={() => handleTabClick(tab)}
                    >
                        <span style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            {tab.label}
                        </span>
                    </div>
                ))}
            </div>

            <textarea
                className="create-post-textarea"
                placeholder={activeTab === 'post' ? "What do you want to talk about?" : "What would you like to poll?"}
                maxLength={activeTab === 'post' ? 300 : 100}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={getThemeStyle(theme)}
            />
            <div className="create-post-counter" style={getThemeStyle(theme)}>
                {question.length} / {activeTab === 'post' ? 300 : 100}
            </div>

            {activeTab === 'poll' && (
                <>
                    <div className="create-post-label" style={getThemeStyle(theme)}>Poll Options</div>
                    <input
                        className="create-post-input"
                        placeholder="Option 1"
                        value={options[0]}
                        onChange={(e) => setOptions([e.target.value, options[1]])}
                        style={getThemeStyle(theme)}
                    />
                    <input
                        className="create-post-input"
                        placeholder="Option 2"
                        value={options[1]}
                        onChange={(e) => setOptions([options[0], e.target.value])}
                        style={getThemeStyle(theme)}
                    />
                </>
            )}

            <div className='create-post'>
                <label className="create-post-upload" style={getThemeStyle(theme)}>
                    📷 Photos/Videos
                    <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </label>
                {selectedFile && filePreview && (
                    <div className="preview">
                        <img src={filePreview} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
                        <button className="preview-remove" onClick={handleRemoveFile} title="Remove image">×</button>
                    </div>
                )}
            </div>

            <div className="create-post-label" style={getThemeStyle(theme)}>Allow Comments</div>
            <select
                className="create-post-select"
                style={getThemeStyle(theme)}
                value={commentPermission}
                onChange={(e) => setCommentPermission(e.target.value)}
            >
                <option value="everyone">From everyone</option>
                <option value="followers">Followers</option>
                <option value="followers_and_following">People | follow and people who follow me</option>
                <option value="inner_circle">Inner Circle</option>
            </select>

            <div className="create-post-label" style={getThemeStyle(theme)}>Allow Visibility</div>
            <select
                className="create-post-select"
                style={getThemeStyle(theme)}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
            >
                <option value="public">Public</option>
                <option value="followers">Followers</option>
                <option value="inner_circle">Inner Circle</option>
            </select>

            <div className="create-post-buttons" style={getThemeStyle(theme)}>
                <button className="create-post-cancel" style={getThemeStyle(theme)} onClick={handleCancel}>CANCEL</button>
                <Button className="create-post-publish" onClick={handlePublish} disabled={fileLoading || (!question.trim() && !selectedFile)}>
                    PUBLISH
                </Button>
            </div>
        </div>
    );
}
