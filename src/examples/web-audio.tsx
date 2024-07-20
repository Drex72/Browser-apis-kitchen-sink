import React, { useRef, useState } from "react"
import styles from "../css/examples/web-audio.module.css"

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <AudioAnalyzer />
        </div>
    )
}

export default App

const AudioAnalyzer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [msg, setMsg] = useState("Click Start to play audio")
    const [node, setNode] = useState<any>()

    const handleStart = async () => {
        if (!canvasRef.current) return

        setMsg("Loading audio…")
        setIsPlaying(true)

        const audioContext = new AudioContext()

        try {
            const response = await fetch("/assets/seyi.mp3")
            const arrayBuffer = await response.arrayBuffer()
            const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer)

            setMsg("Configuring audio stack…")

            const sourceNode = audioContext.createBufferSource()
            sourceNode.buffer = decodedBuffer
            sourceNode.loop = true

            setNode(sourceNode)

            const analyserNode = audioContext.createAnalyser()
            const javascriptNode = audioContext.createScriptProcessor(1024, 1, 1)

            sourceNode.connect(analyserNode)
            analyserNode.connect(javascriptNode)
            javascriptNode.connect(audioContext.destination)
            sourceNode.connect(audioContext.destination)

            sourceNode.start(0)

            setMsg("Audio playing…")

            javascriptNode.onaudioprocess = () => {
                if (canvasRef.current) {
                    const canvas = canvasRef.current
                    const canvasContext = canvas.getContext("2d")
                    if (canvasContext) {
                        const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount)
                        analyserNode.getByteTimeDomainData(amplitudeArray)

                        canvasContext.clearRect(0, 0, canvas.width, canvas.height)

                        for (let i = 0; i < amplitudeArray.length; i++) {
                            const value = amplitudeArray[i] / 256
                            const y = canvas.height - canvas.height * value
                            canvasContext.fillStyle = "white"
                            canvasContext.fillRect(i, y, 1, 1)
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }

    const handleStop = () => {
        setIsPlaying(false)
        setMsg("Audio stopped.")
        node.stop(0)
    }

    return (
        <div>
            <h1 style={{textAlign:"center", marginBottom:"1em"}}>Web Audio API - Visualizer</h1>
            <canvas ref={canvasRef} width="512" height="256" id="canvas" className={styles.canvas}></canvas>
            <div id="controls" className={styles.controls}>
                <button onClick={handleStart} id="start_button" disabled={isPlaying}>
                    Start
                </button>

                <button onClick={handleStop} id="stop_button" disabled={!isPlaying}>
                    Stop
                </button>

                <br />
                <br />
                <output className={styles.msg} id="msg">
                    {msg}
                </output>
            </div>
        </div>
    )
}
