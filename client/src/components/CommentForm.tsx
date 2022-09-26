import { FormEvent, FormEventHandler, useState } from "react"

type CommentFormProps = {
    loading?: boolean,
    error?: string
    autoFocus?: boolean
    initialValue: string
    onSubmit: (message: string) => void
}
export function CommentForm({ loading, error, autoFocus, initialValue, onSubmit }: CommentFormProps) {
    const [message, setMessage] = useState<string>(initialValue)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(message);
        setMessage("");
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} autoFocus={autoFocus} className="message-input" />
                <button type="submit" disabled={loading} className="btn">{loading ? "Loading" : "Post"}</button>
            </div>
            <div className="error-msg">{error}</div>
        </form>
    )
}