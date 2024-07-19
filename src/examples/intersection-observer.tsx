import React, { useEffect, useRef, useState } from "react"
import styles from "../css/examples/intersection-observer.module.css"

const App: React.FC = () => {
    const images = [
        "https://images.unsplash.com/photo-1645461497191-0adcbbd547de?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1688757622193-a919f5e8bafe?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1623627484632-f041d1fb366d?q=80&w=3348&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1648922509277-fa5a92429523?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1677622477694-4a070d322982?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1679002404709-c289bb84dfa2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ]

    return (
        <div className={styles.app}>
            <h1>Scroll Down to See Sections Fade In</h1>

            {Array.from({ length: 20 }).map((_, index) => (
                <FadeInSection>
                    <p>This is Section Number {index + 1} that fades in.</p>
                </FadeInSection>
            ))}

            {images.map((src, index) => (
                <LazyLoadImage
                    key={index}
                    src={src}
                    alt={`Image ${index + 1}`}
                    placeholder="https://via.placeholder.com/600x400?text=Loading..."
                />
            ))}
        </div>
    )
}

export default App

interface LazyLoadImageProps {
    src: string
    alt: string
    placeholder?: string
}

/**
 * LazyLoadImage component.
 *
 * This component lazily loads an image when it comes into the viewport. It uses the Intersection Observer API
 * to detect when the image is in view and switches the source from a placeholder to the actual image.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.src - The source URL of the actual image.
 * @param {string} props.alt - The alt text for the actual image.
 * @param {string} props.placeholder - The source URL of the placeholder image.
 * @returns {JSX.Element} The LazyLoadImage component.
 */
const LazyLoadImage: React.FC<LazyLoadImageProps> = ({ src, alt, placeholder }) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsIntersecting(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
            },
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current)
            }
        }
    }, [])

    return (
        <div className={styles.imageContainer}>
            {isIntersecting ? (
                <img ref={imgRef} src={src} alt={alt} className={styles.image} />
            ) : (
                <img ref={imgRef} src={placeholder} alt="Placeholder" className={styles.placeholder} />
            )}
        </div>
    )
}

interface FadeInSectionProps {
    children: React.ReactNode
}

/**
 * FadeInSection component.
 *
 * This component fades its children into view when it enters the viewport. It uses the Intersection Observer API
 * to detect when the section is in view and applies a visible class for the fade-in effect.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content to be rendered inside the section.
 * @returns {JSX.Element} The FadeInSection component.
 */
const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
            },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    return (
        <div ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ""}`}>
            {children}
        </div>
    )
}
