import React, { useEffect, useState } from "react"
import styles from "../css/examples/battery-status.module.css"

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <BatteryStatusApp />
        </div>
    )
}

export default App

const BatteryStatusApp: React.FC = () => {
    const [batteryLevel, setBatteryLevel] = useState<number>(100)
    const [isCharging, setIsCharging] = useState<boolean>(true)
    const [batteryStatus, setBatteryStatus] = useState<string>("")
    const [batteryThreshold, setBatteryThreshold] = useState<number>(20)

    useEffect(() => {
        const updateBatteryStatus = async () => {
            if ("getBattery" in navigator) {
                const battery = await (navigator as any).getBattery()
                const updateInfo = () => {
                    setBatteryLevel(battery.level * 100)
                    setIsCharging(battery.charging)
                    setBatteryStatus(battery.charging ? "Charging" : "Discharging")
                    // Adjust functionality based on battery level
                    if (battery.level < batteryThreshold / 100) {
                        document.body.classList.add(styles.lowBattery)
                    } else {
                        document.body.classList.remove(styles.lowBattery)
                    }
                }

                battery.addEventListener("levelchange", updateInfo)
                battery.addEventListener("chargingchange", updateInfo)

                // Initial call
                updateInfo()

                return () => {
                    battery.removeEventListener("levelchange", updateInfo)
                    battery.removeEventListener("chargingchange", updateInfo)
                }
            } else {
                console.warn("Battery Status API is not supported")
            }
        }

        updateBatteryStatus()
    }, [batteryThreshold])

    return (
        <div className={styles.container}>
            <h1>Battery Status</h1>
            <p>Battery Level: {batteryLevel}%</p>

            <p>Charging: {isCharging ? "Yes" : "No"}</p>
            <p>Status: {batteryStatus}</p>
            <p>
                Low Battery Threshold:{" "}
                <input
                    type="number"
                    max={100}
                    min={1}
                    value={batteryThreshold}
                    onChange={(e) => setBatteryThreshold(parseInt(e.target.value))}
                />
            </p>
            <div className={styles.animationContainer}>
                <div className={styles.animation}></div>
            </div>

            <p style={{ textAlign: "center" }}>
                Animation Stops when the current battery level is below the low battery threshold
            </p>
        </div>
    )
}
