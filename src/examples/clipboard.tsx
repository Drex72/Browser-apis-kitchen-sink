import React, { useState } from "react"
import styles from "../css/examples/clipboard.module.css"

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <ClipboardManager />
        </div>
    )
}

export default App

interface ClipboardItem {
    id: number
    content: string
}

const ClipboardManager: React.FC = () => {
    const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([])
    const [inputText, setInputText] = useState<string>("")

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            addClipboardHistory(text)
            alert("Text copied to clipboard!")
        } catch (error) {
            console.error("Failed to copy text: ", error)
        }
    }

    const addClipboardHistory = (content: string) => {
        setClipboardHistory((prevHistory) => [{ id: Date.now(), content }, ...prevHistory])
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
    }

    const handleCopyInput = () => {
        if (inputText.trim()) {
            handleCopy(inputText)
        }
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            addClipboardHistory(text)
            alert("Text pasted from clipboard!")
        } catch (error) {
            console.error("Failed to read clipboard contents: ", error)
        }
    }

    return (
        <div className={styles.container}>
            <h1>Clipboard Manager</h1>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type something to copy"
                />
                <button onClick={handleCopyInput}>Copy</button>
            </div>
            <div className={styles.actions}>
                <button onClick={handlePaste}>Paste from Clipboard</button>
            </div>
            <div className={styles.history}>
                <h2>Clipboard History</h2>
                <ul>
                    {clipboardHistory.map((item) => (
                        <li key={item.id}>{item.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
