import {
    useEffect,
    useState,
} from "react";

import SpaceCanvas from "./components/scene/SpaceCanvas";
import SiteHUD from "./components/ui/SiteHUD";
import SectionPanel from "./components/ui/SectionPanel";
import useSiteAudio from "./hooks/useSiteAudio.js";
import {
    planetSections,
} from "./data/planetSections";

const MIN_ZOOM_MULTIPLIER =
    0.55;

const MAX_ZOOM_MULTIPLIER =
    2.5;

const ZOOM_STEP =
    0.12;

function clampZoom(value) {
    return Math.min(
        MAX_ZOOM_MULTIPLIER,

        Math.max(
            MIN_ZOOM_MULTIPLIER,
            value,
        ),
    );
}

function App() {
    const {
        isSoundEnabled,
        toggleSound,
        playHoverSound,
        playClickSound,
    } = useSiteAudio();

    const [
        selectedSectionId,
        setSelectedSectionId,
    ] = useState(null);

    const [
        activeStopId,
        setActiveStopId,
    ] = useState("overview");

    const [
        zoomMultiplier,
        setZoomMultiplier,
    ] = useState(1);

    const selectedSection =
        selectedSectionId
            ? planetSections[
                selectedSectionId
                ]
            : null;

    useEffect(() => {
        function handleZoomWheel(
            event,
        ) {
            if (
                !event.altKey ||
                selectedSection
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const direction =
                Math.sign(
                    event.deltaY,
                );

            setZoomMultiplier(
                (currentZoom) =>
                    clampZoom(
                        currentZoom +
                        direction * 0.08,
                    ),
            );
        }

        window.addEventListener(
            "wheel",
            handleZoomWheel,
            {
                passive: false,
                capture: true,
            },
        );

        return () => {
            window.removeEventListener(
                "wheel",
                handleZoomWheel,
                true,
            );
        };
    }, [selectedSection]);

    function zoomIn() {
        setZoomMultiplier(
            (currentZoom) =>
                clampZoom(
                    currentZoom -
                    ZOOM_STEP,
                ),
        );
    }

    function zoomOut() {
        setZoomMultiplier(
            (currentZoom) =>
                clampZoom(
                    currentZoom +
                    ZOOM_STEP,
                ),
        );
    }

    function resetZoom() {
        setZoomMultiplier(1);
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-[#010106] text-white">
            <SpaceCanvas
                onPlanetSelect={(sectionId) => {
                    playClickSound();
                    setSelectedSectionId(sectionId);
                }}
                onPlanetHover={playHoverSound}
                onActiveStopChange={
                    setActiveStopId
                }
                isPanelOpen={
                    Boolean(
                        selectedSection,
                    )
                }
                zoomMultiplier={
                    zoomMultiplier
                }
            />

            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035),transparent_58%)]" />

            <SiteHUD
                activeStopId={
                    activeStopId
                }
                zoomMultiplier={
                    zoomMultiplier
                }
                onZoomIn={
                    zoomIn
                }
                onZoomOut={
                    zoomOut
                }
                onZoomReset={
                    resetZoom
                }
                isSoundEnabled={isSoundEnabled}
                onToggleSound={toggleSound}
                onHoverSound={playHoverSound}
                onClickSound={playClickSound}
            />
            {selectedSection && (
                <SectionPanel
                    section={selectedSection}
                    onClose={() => {
                        setSelectedSectionId(null);
                    }}
                    onHoverSound={playHoverSound}
                    onClickSound={playClickSound}
                />
            )}
        </div>
    );
}

export default App;