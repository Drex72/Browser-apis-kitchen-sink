import React, { useEffect, useRef, useState } from "react"
import styles from "../css/examples/resize-observer.module.css"

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <ResizableComponent />
        </div>
    )
}

export default App

const ResizableComponent = () => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLHeadingElement | null>(null)
    const paragraphRef = useRef<HTMLParagraphElement | null>(null)

    const [isObserving, setIsObserving] = useState<boolean>(true)
    const [sliderValue, setSliderValue] = useState<string>("600")

    const handleCheckboxChange = () => {
        if (isObserving) {
            setIsObserving(false)
        } else {
            setIsObserving(true)
        }
    }

    const resizeObserver = new ResizeObserver((entries: any) => {
        for (let entry of entries) {
            if (!headerRef.current || !paragraphRef.current) return

            if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    headerRef.current.style.fontSize = `${Math.max(1.5, entry.contentBoxSize[0].inlineSize / 200)}rem`
                    paragraphRef.current.style.fontSize = `${Math.max(1, entry.contentBoxSize[0].inlineSize / 600)}rem`
                } else {
                    headerRef.current.style.fontSize = `${Math.max(1.5, entry.contentBoxSize.inlineSize / 200)}rem`
                    paragraphRef.current.style.fontSize = `${Math.max(1, entry.contentBoxSize.inlineSize / 600)}rem`
                }
            } else {
                headerRef.current.style.fontSize = `${Math.max(1.5, entry.contentRect.width / 200)}rem`
                paragraphRef.current.style.fontSize = `${Math.max(1, entry.contentRect.width / 600)}rem`
            }
        }
    })

    const handleResize = () => {
        if (!window.ResizeObserver) {
            alert("Resize observer not supported!")
            return
        }

        const element = document.querySelector(`.${styles.container}`)

        if (!element) return

        if (isObserving) {
            resizeObserver.observe(element)
        } else {
            resizeObserver.unobserve(element)
        }
    }

    useEffect(() => {
        handleResize()

        const element = document.querySelector(`.${styles.container}`)

        return () => {
            if (element) {
                resizeObserver.unobserve(element)
            }

            resizeObserver.disconnect()
        }
    }, [isObserving])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.width = sliderValue + "px"
        }
    }, [sliderValue])

    return (
        <div ref={containerRef} className={styles.container}>
            <h1 ref={headerRef} className={styles.heading}>
                So what happened?
            </h1>
            <p ref={paragraphRef} className={styles.paragraph}>
                And remember, don't do anything that affects anything, unless it turns out you were supposed to, in
                which case, for the love of God, don't not do it! Ow, my spirit! I don't want to be rescued. You guys
                aren't Santa! You're not even robots. I've got to find a way to escape the horrible ravages of youth.
                Suddenly, I'm going to the bathroom like clockwork, every three hours. And those jerks at Social
                Security stopped sending me checks. Now 'I' have to pay 'them'!
            </p>
            <form className={styles.form}>
                <div className={styles.inputContainer}>
                    <label>Observer enabled:</label>
                    <input type="checkbox" onChange={handleCheckboxChange} checked={isObserving} />
                </div>
                <div className={styles.inputContainer}>
                    <label>Adjust width:</label>
                    <input
                        type="range"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(e.target.value)}
                        min="300"
                        max="1300"
                    />
                </div>
            </form>
        </div>
    )
}
