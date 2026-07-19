import {
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    useFrame,
    useThree,
} from "@react-three/fiber";

import {
    useScroll,
} from "@react-three/drei";

import * as THREE from "three";
import gsap from "gsap";

import {
    journeyStops,
    planetSections,
    planetSectionList,
} from "../../data/planetSections";


const CAMERA_DIRECTION =
    new THREE.Vector3(
        0.3,
        0.22,
        1,
    ).normalize();

const FOCUS_DISTANCE = 0.17;

function smoothStep(value) {
    return (
        value *
        value *
        (3 - 2 * value)
    );
}

function getObjectRadius(object) {
    if (!object) {
        return 1;
    }

    object.updateWorldMatrix(
        true,
        false,
    );

    if (
        object.isMesh &&
        object.geometry
    ) {
        if (
            !object.geometry.boundingSphere
        ) {
            object.geometry.computeBoundingSphere();
        }

        const localRadius =
            object.geometry.boundingSphere?.radius ??
            1;

        const worldScale =
            new THREE.Vector3();

        object.getWorldScale(
            worldScale,
        );

        return (
            localRadius *
            Math.max(
                worldScale.x,
                worldScale.y,
                worldScale.z,
            )
        );
    }

    const box =
        new THREE.Box3().setFromObject(
            object,
        );

    const sphere =
        new THREE.Sphere();

    box.getBoundingSphere(
        sphere,
    );

    return sphere.radius || 1;
}

function CameraJourney({
                           targets,
                           isPanelOpen,
                           zoomMultiplier,
                           onJourneyStateChange,
                       }) {
    const camera = useThree(
        (state) => state.camera,
    );

    const scroll = useScroll();
    useEffect(() => {
        function handlePlanetNavigation(event) {
            const stopId =
                event.detail?.stopId;

            const stopIndex =
                journeyStops.findIndex(
                    (stop) =>
                        stop.id === stopId,
                );

            if (stopIndex === -1) {
                return;
            }

            const scrollElement =
                scroll.el;

            if (!scrollElement) {
                return;
            }

            const maximumScroll =
                scrollElement.scrollHeight -
                scrollElement.clientHeight;

            const progress =
                stopIndex /
                (journeyStops.length - 1);

            const targetScroll =
                maximumScroll * progress;

            gsap.to(scrollElement, {
                scrollTop: targetScroll,
                duration: 1.5,
                ease: "power2.inOut",
                overwrite: true,
            });
        }

        window.addEventListener(
            "planet-navigation",
            handlePlanetNavigation,
        );

        return () => {
            window.removeEventListener(
                "planet-navigation",
                handlePlanetNavigation,
            );

            if (scroll.el) {
                gsap.killTweensOf(
                    scroll.el,
                );
            }
        };
    }, [scroll]);
    const previousJourneyStateRef =
        useRef("");

    const currentLookAtRef =
        useRef(
            new THREE.Vector3(),
        );
    /*
 * Measures how long scrolling has been inactive.
 */
    const scrollIdleTimeRef = useRef(0);

    /*
     * Stores which planet is currently being tracked.
     */
    const trackedStopRef = useRef(null);

    /*
     * Stores the planet's position from the previous frame.
     */
    const previousTrackedPositionRef = useRef(
        new THREE.Vector3(),
    );

    const vectors =
        useMemo(
            () => ({
                fromCamera:
                    new THREE.Vector3(),

                fromTarget:
                    new THREE.Vector3(),

                toCamera:
                    new THREE.Vector3(),

                toTarget:
                    new THREE.Vector3(),

                desiredCamera:
                    new THREE.Vector3(),

                desiredTarget:
                    new THREE.Vector3(),

                worldPosition:
                    new THREE.Vector3(),

                overviewCenter:
                    new THREE.Vector3(),

                overviewOffset:
                    new THREE.Vector3(),

                trackedPlanetPosition:
                    new THREE.Vector3(),

                planetMovement:
                    new THREE.Vector3(),
            }),
            [],
        );

    const planetRadii =
        useMemo(() => {
            const radii = {};

            planetSectionList.forEach(
                (section) => {
                    radii[section.id] =
                        getObjectRadius(
                            targets[section.id],
                        );
                },
            );

            return radii;
        }, [targets]);

    /*
     * Stop the ScrollControls container while the
     * expanded section panel is open.
     */
    useEffect(() => {
        const scrollElement =
            scroll.el;

        if (!scrollElement) {
            return;
        }

        const previousOverflow =
            scrollElement.style.overflowY;

        scrollElement.style.overflowY =
            isPanelOpen
                ? "hidden"
                : "auto";

        return () => {
            scrollElement.style.overflowY =
                previousOverflow;
        };
    }, [
        scroll,
        isPanelOpen,
    ]);

    function getOverviewPose(
        cameraPosition,
        lookAtPosition,
    ) {
        const availableSections =
            planetSectionList.filter(
                (section) =>
                    targets[section.id],
            );

        if (
            availableSections.length ===
            0
        ) {
            cameraPosition.set(
                0,
                10,
                40,
            );

            lookAtPosition.set(
                0,
                0,
                0,
            );

            return;
        }

        vectors.overviewCenter.set(
            0,
            0,
            0,
        );

        availableSections.forEach(
            (section) => {
                const target =
                    targets[section.id];

                target.updateWorldMatrix(
                    true,
                    false,
                );

                target.getWorldPosition(
                    vectors.worldPosition,
                );

                vectors.overviewCenter.add(
                    vectors.worldPosition,
                );
            },
        );

        vectors.overviewCenter.multiplyScalar(
            1 /
            availableSections.length,
        );

        let maximumExtent = 0;

        availableSections.forEach(
            (section) => {
                const target =
                    targets[section.id];

                target.updateWorldMatrix(
                    true,
                    false,
                );

                target.getWorldPosition(
                    vectors.worldPosition,
                );

                const distance =
                    vectors.worldPosition.distanceTo(
                        vectors.overviewCenter,
                    );

                maximumExtent =
                    Math.max(
                        maximumExtent,

                        distance +
                        (
                            planetRadii[
                                section.id
                                ] ?? 1
                        ),
                    );
            },
        );

        const overviewDistance =
            Math.max(maximumExtent * 1.6, 20) *
            2.5;

        lookAtPosition.copy(
            vectors.overviewCenter,
        );

        vectors.overviewOffset.set(
            0,
            overviewDistance * 0.35,
            overviewDistance,
        );

        cameraPosition
            .copy(
                vectors.overviewCenter,
            )
            .add(
                vectors.overviewOffset,
            );
    }

    function getPlanetPose(
        sectionId,
        cameraPosition,
        lookAtPosition,
    ) {
        const target =
            targets[sectionId];

        const section =
            planetSections[sectionId];

        if (
            !target ||
            !section
        ) {
            getOverviewPose(
                cameraPosition,
                lookAtPosition,
            );

            return;
        }

        target.updateWorldMatrix(
            true,
            false,
        );

        target.getWorldPosition(
            lookAtPosition,
        );

        const planetRadius =
            planetRadii[sectionId] ??
            1;

        const baseCameraDistance =
            THREE.MathUtils.clamp(
                planetRadius *
                section.cameraDistanceMultiplier,

                3,
                25,
            );

        const cameraDistance =
            baseCameraDistance *
            zoomMultiplier;

        cameraPosition
            .copy(
                lookAtPosition,
            )
            .addScaledVector(
                CAMERA_DIRECTION,
                cameraDistance,
            );
    }

    function getStopPose(
        stopId,
        cameraPosition,
        lookAtPosition,
    ) {
        if (
            stopId === "overview"
        ) {
            getOverviewPose(
                cameraPosition,
                lookAtPosition,
            );

            return;
        }

        getPlanetPose(
            stopId,
            cameraPosition,
            lookAtPosition,
        );
    }

    useFrame((_, delta) => {
        const lastStopIndex =
            journeyStops.length - 1;

        const scaledProgress =
            THREE.MathUtils.clamp(
                scroll.offset * lastStopIndex,
                0,
                lastStopIndex,
            );

        const nearestIndex =
            Math.round(scaledProgress);

        const nearestStop =
            journeyStops[nearestIndex];

        const scrollingHasStopped =
            Math.abs(scroll.delta) < 0.00015;

        if (scrollingHasStopped) {
            scrollIdleTimeRef.current += delta;
        } else {
            scrollIdleTimeRef.current = 0;
        }

        const isFocused =
            scrollIdleTimeRef.current > 0.18 &&
            nearestStop.id !== "overview" &&
            Boolean(targets[nearestStop.id]);

        if (isFocused) {

            getStopPose(
                nearestStop.id,
                vectors.desiredCamera,
                vectors.desiredTarget,
            );
        } else {

            const fromIndex =
                Math.floor(scaledProgress);

            const toIndex =
                Math.min(
                    fromIndex + 1,
                    lastStopIndex,
                );

            const localProgress =
                scaledProgress - fromIndex;

            const easedProgress =
                smoothStep(localProgress);

            const fromStop =
                journeyStops[fromIndex];

            const toStop =
                journeyStops[toIndex];

            getStopPose(
                fromStop.id,
                vectors.fromCamera,
                vectors.fromTarget,
            );

            getStopPose(
                toStop.id,
                vectors.toCamera,
                vectors.toTarget,
            );

            vectors.desiredCamera.lerpVectors(
                vectors.fromCamera,
                vectors.toCamera,
                easedProgress,
            );

            vectors.desiredTarget.lerpVectors(
                vectors.fromTarget,
                vectors.toTarget,
                easedProgress,
            );
        }

        if (isFocused) {
            const focusedPlanet =
                targets[nearestStop.id];

            focusedPlanet.updateWorldMatrix(
                true,
                false,
            );

            focusedPlanet.getWorldPosition(
                vectors.trackedPlanetPosition,
            );

            if (
                trackedStopRef.current ===
                nearestStop.id
            ) {
                vectors.planetMovement.subVectors(
                    vectors.trackedPlanetPosition,
                    previousTrackedPositionRef.current,
                );

                camera.position.add(
                    vectors.planetMovement,
                );

                currentLookAtRef.current.add(
                    vectors.planetMovement,
                );
            } else {

                trackedStopRef.current =
                    nearestStop.id;
            }

            previousTrackedPositionRef.current.copy(
                vectors.trackedPlanetPosition,
            );
        } else {

            trackedStopRef.current = null;
        }

        const cameraSpeed =
            isFocused
                ? 4
                : 2.2;

        const smoothing =
            1 -
            Math.exp(
                -delta * cameraSpeed,
            );

        camera.position.lerp(
            vectors.desiredCamera,
            smoothing,
        );

        currentLookAtRef.current.lerp(
            vectors.desiredTarget,
            smoothing,
        );

        camera.lookAt(
            currentLookAtRef.current,
        );

        /*
         * Inform React which section is active.
         */
        const stateKey =
            `${nearestStop.id}:${isFocused}`;

        if (
            stateKey !==
            previousJourneyStateRef.current
        ) {
            previousJourneyStateRef.current =
                stateKey;

            onJourneyStateChange({
                activeStopId:
                nearestStop.id,

                isFocused,
            });
        }
    });

    return null;
}

export default CameraJourney;