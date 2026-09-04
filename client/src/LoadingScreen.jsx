import { useEffect, useState } from "react";

function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3000;
        const stepTime = 30;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = Math.min(
                    prev + 100 / (duration / stepTime),
                    100
                );

                if (next >= 100) {
                    clearInterval(timer);

                    setTimeout(() => {
                        onComplete();
                    }, 450);
                }

                return next;
            });
        }, stepTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="mentorx-loader">

            <div className="loader-noise" />

            <div className="loader-glow loader-glow-one" />
            <div className="loader-glow loader-glow-two" />


            {/* =========================================
                BRAND
            ========================================= */}

            <div className="loader-brand">

                <div className="loader-logo">
                    MENTORX × RAJ
                </div>

                <div className="loader-subtitle">
                    AI PROJECT INTELLIGENCE
                </div>

            </div>


            {/* =========================================
                MAIN
            ========================================= */}

            <div className="loader-center">

                <div className="loader-status">

                    <span className="loader-status-dot" />

                    MENTORX SYSTEM

                    <b>
                        ONLINE
                    </b>

                </div>


                <h1 className="loader-title">

                    BUILT BY
                    <span>
                        RAJ.
                    </span>

                </h1>


                {/* =========================================
                    RACING AREA
                ========================================= */}

                <div className="raj-race">

                    <div className="raj-speed-lines">

                        {Array.from({
                            length: 14
                        }).map((_, index) => (
                            <span
                                key={index}
                                style={{
                                    animationDelay:
                                        `${index * -0.08}s`
                                }}
                            />
                        ))}

                    </div>


                    {/* Track */}

                    <div className="raj-track">

                        <div className="raj-track-line" />

                        <div className="raj-track-glow" />

                    </div>


                    {/* =====================================
                        RAJ RUNNER
                    ===================================== */}

                    <div
                        className="raj-runner"
                        style={{
                            left: `${Math.min(
                                progress,
                                92
                            )}%`
                        }}
                    >

                        <div className="raj-trail">
                            RAJ
                        </div>

                        <div className="raj-word">
                            RAJ
                        </div>

                        <div className="raj-shadow">
                            RAJ
                        </div>

                    </div>

                </div>


                {/* =========================================
                    PROGRESS
                ========================================= */}

                <div className="loader-progress-area">

                    <div className="loader-progress-top">

                        <span>
                            INITIALIZING RAJ ENGINE
                        </span>

                        <strong>
                            {Math.round(progress)}%
                        </strong>

                    </div>


                    <div className="loader-progress-bar">

                        <div
                            className="loader-progress-fill"
                            style={{
                                width:
                                    `${progress}%`
                            }}
                        />

                    </div>

                </div>


                {/* =========================================
                    MESSAGE
                ========================================= */}

                <div className="loader-message">

                    {progress < 20 &&
                        "Starting system..."}

                    {progress >= 20 &&
                        progress < 40 &&
                        "Loading MENTORX..."}

                    {progress >= 40 &&
                        progress < 60 &&
                        "Activating AI engine..."}

                    {progress >= 60 &&
                        progress < 80 &&
                        "Connecting intelligence..."}

                    {progress >= 80 &&
                        progress < 98 &&
                        "Almost ready..."}

                    {progress >= 98 &&
                        progress < 100 &&
                        "Final systems check..."}

                    {progress >= 100 &&
                        "RAJ × MENTORX READY."}

                </div>

            </div>


            {/* =========================================
                FOOTER
            ========================================= */}

            <div className="loader-footer">

                <span>
                    MENTORX
                </span>

                <i />

                <span>
                    RAJ
                </span>

                <i />

                <span>
                    AI ENGINE
                </span>

            </div>

        </div>
    );
}

export default LoadingScreen;