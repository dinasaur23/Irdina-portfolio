import {
    planetSections,
} from "../../data/planetSections";
import ScrambleText from "./ScrambleText";
const destinations = [
    {
        id: "overview",
        label: "Overview",
    },
    {
        id: "about",
        label: "Earth",
    },
    {
        id: "projects",
        label: "Mars",
    },
    {
        id: "stack",
        label: "Jupiter",
    },
    {
        id: "contact",
        label: "Saturn",
    },
];

function SiteHUD({
                     activeStopId,
                     zoomMultiplier,
                     onZoomIn,
                     onZoomOut,
                     onZoomReset,
                     isSoundEnabled,
                     onToggleSound,
                     onHoverSound,
                     onClickSound,
                 }) {
    const activeSection =
        planetSections[
            activeStopId
            ];

    const visibleZoom =
        Math.round(
            100 /
            zoomMultiplier,
        );

    function navigateToPlanet(stopId) {
        window.dispatchEvent(
            new CustomEvent("planet-navigation", {
                detail: {
                    stopId,
                },
            }),
        );
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-20">
            <header className="flex items-start justify-between p-5 md:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
                        Irdina Binti Ismail
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                        Frontend Developer
                    </p>

                    {/* 3D model credit */}
                    <p className="pointer-events-auto mt-5 max-w-sm font-technical text-[8px] leading-4 tracking-[0.08em] text-zinc-600">
                        3D model:{" "}
                        <a
                            href="https://sketchfab.com/3d-models/solar-system-animation-b7c69a6b655b47c99f871d5ec5aee854"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 transition hover:text-zinc-200"
                        >
                            Solar System animation
                        </a>{" "}
                        by{" "}
                        <a
                            href="https://sketchfab.com/Samer_Arab_S5"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 transition hover:text-zinc-200"
                        >
                            Samer_Arab_S5
                        </a>
                        .{" "}
                        <a
                            href="https://creativecommons.org/licenses/by/4.0/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 transition hover:text-zinc-200"
                        >
                            CC BY 4.0
                        </a>
                        .
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                        Current destination
                    </p>

                    <p className="mt-2 text-lg font-medium text-zinc-100">
                        {activeSection
                            ? `${activeSection.planet} — ${activeSection.label}`
                            : "Portfolio overview"}
                    </p>
                </div>
            </header>


            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    Navigation
                </p>

                <div className="mt-2 space-y-1 text-sm text-zinc-300">
                    <p>
                        Scroll to travel
                    </p>

                    <p>
                        Click a planet or label
                    </p>

                </div>
            </div>

            <button
                type="button"
                onPointerEnter={onHoverSound}
                onClick={() => {
                    onToggleSound();
                }}
                className="pointer-events-auto absolute bottom-28 left-7 font-technical text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
            >
                Sound: {isSoundEnabled ? "On" : "Off"}
            </button>


            <div className="pointer-events-auto absolute bottom-7 right-7 flex items-center gap-1 font-mono">
                <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={onZoomOut}
                    className="flex h-9 w-9 items-center justify-center text-lg text-zinc-500 transition hover:text-white"
                >
                    −
                </button>

                <button
                    type="button"
                    onClick={onZoomReset}
                    className="min-w-14 px-2 py-2 text-xs text-zinc-500 transition hover:text-white"
                >
                    {visibleZoom}%
                </button>

                <button
                    type="button"
                    aria-label="Zoom in"
                    onPointerEnter={onHoverSound}
                    onClick={() => {
                        onClickSound();
                        onZoomIn();
                    }}
                >
                    +
                </button>

            </div>



            <div className="absolute bottom-7 left-1/2 w-full max-w-3xl -translate-x-1/2 px-5 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                    Journey
                </p>

                <nav
                    aria-label="Planet navigation"
                    className="pointer-events-auto mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
                >
                    {destinations.map((destination, index) => {
                        const isActive =
                            activeStopId === destination.id;

                        return (
                            <div
                                key={destination.id}
                                className="flex items-center gap-4"
                            >
                                {index > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="font-mono text-sm text-zinc-700"
                                    >
              /
            </span>
                                )}

                                <button
                                    type="button"
                                    onPointerEnter={onHoverSound}
                                    onClick={() => {
                                        onClickSound();
                                        navigateToPlanet(destination.id);
                                    }}
                                    aria-current={isActive ? "location" : undefined}
                                    className={
                                        isActive
                                            ? "font-technical text-sm uppercase tracking-[0.12em] text-zinc-100"
                                            : "font-technical text-sm uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-200"
                                    }
                                >
                                    <ScrambleText duration={400}>
                                        {destination.label}
                                    </ScrambleText>
                                </button>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

export default SiteHUD;