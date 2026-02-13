import Button from "../Button/Button";

export default function DeleteModal({ onCancel, onConfirm }) {

    return (
        <div>
            <h3>Delete Post</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",   
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong>Are you sure you want to delete this post permanetly?</strong>
                <br></br>
            You won't be able to restore it again.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    )
}