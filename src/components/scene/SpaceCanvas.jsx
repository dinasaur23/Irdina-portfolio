import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
    ScrollControls,
} from "@react-three/drei";

import SolarSystemScene from "./SolarSystemScene";
import {
    journeyStops,
} from "../../data/planetSections";
import FuturisticLoader from "../ui/FuturisticLoader";

function SpaceCanvas({
                         onPlanetSelect,
                         onPlanetHover,
                         onActiveStopChange,
                         isPanelOpen,
                         zoomMultiplier,
                     }) {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{
                    position: [0, 10, 40],
                    fov: 45,
                    near: 0.01,
                    far: 2000,
                }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                }}
            >
                <Suspense fallback={null}>
                    <ScrollControls
                        pages={journeyStops.length}
                        damping={0.45}
                        maxSpeed={0.22}
                        distance={1}
                    >
                        <SolarSystemScene
                            onPlanetSelect={
                                onPlanetSelect
                            }
                            onPlanetHover={onPlanetHover}
                            onActiveStopChange={
                                onActiveStopChange
                            }
                            isPanelOpen={
                                isPanelOpen
                            }
                            zoomMultiplier={
                                zoomMultiplier
                            }
                        />
                    </ScrollControls>
                </Suspense>
            </Canvas>

            <FuturisticLoader />
        </div>
    );
}

export default SpaceCanvas;