import React, { useEffect, useState } from "react"

const App: React.FC = () => {
    const [taskCompleted, setTaskCompleted] = useState<boolean>(false)
    const [taskTimeInfo, setTaskTimeInfo] = useState<string>("")

    useEffect(() => {
        // Performance Observer
        const perfObserver = (list: PerformanceObserverEntryList) => {
            list.getEntries().forEach((entry) => {
                console.log(`${entry.name}'s duration: ${entry.duration}ms`)
                setTaskTimeInfo(`${entry.name}'s duration: ${entry.duration}ms`)
            })
        }

        const observer = new PerformanceObserver(perfObserver)
        observer.observe({ entryTypes: ["measure"] })

        return () => {
            observer.disconnect()
        }
    }, [])

    const performTask = () => {
        performance.mark("task-started")

        // Simulate a task by using a timeout
        setTimeout(() => {
            performance.mark("task-completed")

            performance.measure(
                "task-duration", // measure name
                "task-started", // start mark
                "task-completed", // end mark
            )

            setTaskCompleted(true)
        }, 5000)
    }

    return (
        <div id="app">
            <button id="btn" style={{ display: "block", marginBottom: "1rem" }} onClick={performTask}>
                Start Task
            </button>
            <p>{taskTimeInfo}</p>
            {taskCompleted && <p>Task completed!</p>}
        </div>
    )
}

export default App
