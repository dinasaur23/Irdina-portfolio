import * as THREE from "three";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useAnimations,
    useCursor,
    useGLTF,
} from "@react-three/drei";

import {
    planetSectionList,
} from "../../data/planetSections";

import PlanetLabel from "./PlanetLabel";

function findSectionFromClick(
    clickedObject,
    targets,
) {
    let currentObject = clickedObject;

    while (currentObject) {
        const matchingEntry =
            Object.entries(targets).find(
                ([, target]) =>
                    target === currentObject,
            );

        if (matchingEntry) {
            const [sectionId] =
                matchingEntry;

            return sectionId;
        }

        currentObject =
            currentObject.parent;
    }

    return null;
}

function getObjectChain(object) {
    const chain = [];

    let currentObject = object;

    while (currentObject) {
        chain.push({
            type: currentObject.type,

            name:
                currentObject.name ||
                "(no name)",
        });

        currentObject =
            currentObject.parent;
    }

    return chain;
}

function SolarSystemModel({
                              onPlanetSelect,
                              onPlanetHover,
                              onTargetsReady,
                              activeStopId,
                          }) {

    const modelRef = useRef();

    const [
        hoveredSectionId,
        setHoveredSectionId,
    ] = useState(null);

    const {
        scene,
        animations,
    } = useGLTF(
        "/models/solar-system.glb",
    );

    const { actions } = useAnimations(
        animations,
        modelRef,
    );

    useEffect(() => {
        const animationActions =
            Object.values(actions);

        animationActions.forEach(
            (action) => {
                if (!action) {
                    return;
                }

                action
                    .reset()
                    .play();
            },
        );

        return () => {
            animationActions.forEach(
                (action) => {
                    action?.stop();
                },
            );
        };
    }, [actions]);

    useEffect(() => {
        const animationActions =
            Object.values(actions).filter(Boolean);

        animationActions.forEach((action) => {

            action.enabled = true;

            action.clampWhenFinished = false;

            action.setLoop(
                THREE.LoopPingPong,
                Infinity,
            );

            if (!action.isRunning()) {
                action.play();
            }
        });

        return () => {
            animationActions.forEach((action) => {
                action.stop();
            });
        };
    }, [actions]);

    useEffect(() => {
        const meshNames = [];

        scene.traverse(
            (object) => {
                if (!object.isMesh) {
                    return;
                }

                meshNames.push({
                    meshName:
                        object.name ||
                        "(no name)",

                    parentName:
                        object.parent?.name ||
                        "(no parent)",

                    material:
                        Array.isArray(
                            object.material,
                        )
                            ? "Multiple materials"
                            : object.material?.name ||
                            "(unnamed material)",
                });
            },
        );

        console.group(
            "Clickable meshes inside solar-system.glb",
        );

        console.table(meshNames);

        console.groupEnd();
    }, [scene]);


    const targets =
        useMemo(() => {
            const foundTargets = {};
            scene.updateMatrixWorld(true);

            planetSectionList.forEach(
                (section) => {

                    const target =
                        scene.getObjectByName(
                            section.objectName,
                        );

                    foundTargets[section.id] =
                        target ?? null;

                    if (!target) {
                        console.warn(
                            `Could not find "${section.objectName}" for ${section.planet}.`,
                        );

                        return;
                    }

                    console.log(
                        `${section.planet} target:`,
                        target,
                    );
                },
            );

            return foundTargets;
        }, [scene]);

    useEffect(() => {
        onTargetsReady(targets);
    }, [
        targets,
        onTargetsReady,
    ]);

    useCursor(
        Boolean(hoveredSectionId),
    );

    function handlePointerMove(event) {
        event.stopPropagation();

        const sectionId =
            findSectionFromClick(
                event.object,
                targets,
            );

        setHoveredSectionId(
            sectionId,
        );
    }

    function handlePointerOut() {
        setHoveredSectionId(null);
    }

    function handleClick(event) {
        event.stopPropagation();

        const sectionId =
            findSectionFromClick(
                event.object,
                targets,
            );

        if (sectionId) {
            onPlanetSelect(sectionId);

            return;
        }

        console.group(
            "Clicked object is not a configured portfolio planet",
        );

        console.log(
            "Clicked mesh:",
            event.object.name,
        );

        console.table(
            getObjectChain(
                event.object,
            ),
        );

        console.groupEnd();
    }

    return (
        <>
            <group ref={modelRef}>
                <primitive
                    object={scene}
                    onPointerMove={
                        handlePointerMove
                    }
                    onPointerOut={
                        handlePointerOut
                    }
                    onClick={
                        handleClick
                    }
                />
            </group>


            {planetSectionList.map(
                (section) => (
                    <PlanetLabel
                        key={section.id}
                        target={
                            targets[section.id]
                        }
                        section={section}
                        isActive={
                            activeStopId ===
                            section.id
                        }
                        onSelect={
                            onPlanetSelect
                        }
                        onHoverSound={onPlanetHover}
                    />
                ),
            )}
        </>
    );
}


useGLTF.preload(
    "/models/solar-system.glb",
);

export default SolarSystemModel;