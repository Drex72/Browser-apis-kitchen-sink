import React, { useEffect, useState } from "react"
import styles from "../css/examples/network-information.module.css"

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <NetworkInfoManager />
        </div>
    )
}

export default App

const NetworkInfoManager: React.FC = () => {
    const [effectiveType, setEffectiveType] = useState<string>("4g")
    const [imageSrc, setImageSrc] = useState<string>("")

    useEffect(() => {
        const updateNetworkInfo = () => {
            const connection =
                (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

            if (connection) {
                setEffectiveType(connection.effectiveType)
                let src =
                    "https://images.unsplash.com/photo-1633174787703-1bebf6b4b131?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

                switch (connection.effectiveType) {
                    case "slow-2g":
                        setImageSrc(
                            "https://static.hollywoodreporter.com/sites/default/files/2015/02/pulp_fiction_a_h.jpg",
                        )
                        break
                    case "2g":
                        setImageSrc(
                            "https://static.hollywoodreporter.com/sites/default/files/2015/02/pulp_fiction_a_h.jpg",
                        )
                        break
                    case "3g":
                        setImageSrc(
                            "https://plus.unsplash.com/premium_photo-1679002404709-c289bb84dfa2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        )
                        break
                    default:
                        setImageSrc(src)
                        break
                }
            } else {
                console.warn("Network Information API not supported")
            }
        }

        updateNetworkInfo()

        const connection =
            (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        if (connection) {
            connection.addEventListener("change", updateNetworkInfo)

            return () => {
                connection.removeEventListener("change", updateNetworkInfo)
            }
        }
    }, [])

    return (
        <div className={styles.container}>
            <h1>Network Speed-Based Content Loading</h1>
            <p>Current Network Speed: {effectiveType}</p>
            <div className={styles.images}>
                <div className={styles.imageContainer}>
                    <img src={imageSrc} alt="Sample" className={styles.image} />
                    <p>Image Quality: {effectiveType}</p>
                </div>
            </div>
        </div>
    )
}
