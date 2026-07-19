import {
    useState,
} from "react";

import {
    Stars,
} from "@react-three/drei";

import CameraJourney from "./CameraJourney";
import SolarSystemModel from "./SolarSystemModel";

function SolarSystemScene({
                              onPlanetSelect,
                              onPlanetHover,
                              onActiveStopChange,
                              isPanelOpen,
                              zoomMultiplier,
                          }) {
    const [
        planetTargets,
        setPlanetTargets,
    ] = useState({});

    const [
        journeyState,
        setJourneyState,
    ] = useState({
        activeStopId: "overview",
        isFocused: false,
    });

    function handleJourneyStateChange(
        nextState,
    ) {
        setJourneyState(
            (previousState) => {
                if (
                    previousState.activeStopId ===
                    nextState.activeStopId &&
                    previousState.isFocused ===
                    nextState.isFocused
                ) {
                    return previousState;
                }

                return nextState;
            },
        );

        onActiveStopChange(
            nextState.activeStopId,
        );
    }

    return (
        <>
            <color
                attach="background"
                args={["#010106"]}
            />

            <ambientLight
                intensity={0.7}
            />

            <directionalLight
                position={[10, 15, 12]}
                intensity={1.8}
                color="#dbeafe"
            />

            <Stars
                radius={180}
                depth={100}
                count={4500}
                factor={5}
                saturation={0}
                fade
                speed={0.12}
            />

            <SolarSystemModel
                onPlanetSelect={
                    onPlanetSelect
                }
                onPlanetHover={onPlanetHover}
                onTargetsReady={
                    setPlanetTargets
                }
                activeStopId={
                    journeyState.activeStopId
                }
            />

            <CameraJourney
                targets={
                    planetTargets
                }
                isPanelOpen={
                    isPanelOpen
                }
                zoomMultiplier={
                    zoomMultiplier
                }
                onJourneyStateChange={
                    handleJourneyStateChange
                }
            />
        </>
    );
}

export default SolarSystemScene;