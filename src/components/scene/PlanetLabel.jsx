import {createPortal} from "@react-three/fiber";
import {Html} from "@react-three/drei";
import ScrambleText from "../ui/ScrambleText.jsx";

function PlanetLabel({
                         target,
                         section,
                         isActive,
                         onSelect,
                         onHoverSound,
                     }) {
    if (!target) {
        return null;
    }

    const screenOffset =
        section.labelScreenOffset ?? [75, -45];

    return createPortal(
        <Html
            position={[0, 0, 0]}
            center
            distanceFactor={10}
            zIndexRange={[30, 0]}
            style={{
                pointerEvents: "auto",
            }}
        >
            <div
                className="planet-label-positioner"
                style={{
                    transform: `translate(${screenOffset[0]}px, ${screenOffset[1]}px)`,
                }}
            >
                <button
                    type="button"
                    className={
                        isActive
                            ? "planet-label planet-label--active"
                            : "planet-label"
                    }
                    onPointerEnter={() => {
                        onHoverSound?.();
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onSelect(section.id);
                    }}
                >
                    <span className="planet-label__planet">
                      <ScrambleText duration={420}>
                        {section.planet}
                      </ScrambleText>
                    </span>

                    <span className="planet-label__section">
                      <ScrambleText duration={480}>
                        {section.label}
                      </ScrambleText>
                    </span>

                    <span className="planet-label__action">
                      <ScrambleText duration={520}>
                        Open section
                      </ScrambleText>
                    </span>
                </button>
            </div>
        </Html>,
        target,
    );
}

export default PlanetLabel;