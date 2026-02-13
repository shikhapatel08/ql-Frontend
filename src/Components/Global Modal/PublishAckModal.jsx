import Button from "../Button/Button";
export default function PublishAckModal({ onCancel, onConfirm }) {

    return (
        <div>
            <h3>Note</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",   // starting alignment
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong>Poll / Post Acknowledgement</strong>
                <br></br>
                Once your post or poll receives a like, comment, vote, or save,
                editing will be disabled. Please review your content carefully
                before publishing.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    )
}