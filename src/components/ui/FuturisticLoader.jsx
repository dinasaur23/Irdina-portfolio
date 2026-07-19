import { useProgress } from "@react-three/drei";

function FuturisticLoader() {
    const {
        active,
        progress,
        loaded,
        total,
    } = useProgress();

    if (!active && progress === 100) {
        return null;
    }

    const roundedProgress =
        Math.round(progress);

    return (
        <div className="futuristic-loader">
            <div className="futuristic-loader__grid" />

            <div className="futuristic-loader__content">
                <p className="futuristic-loader__eyebrow">
                    System initialization
                </p>

                <h1 className="futuristic-loader__title">
                    Loading solar environment
                </h1>

                <div className="futuristic-loader__status">
          <span>
            Asset synchronization
          </span>

                    <span>
            {roundedProgress
                .toString()
                .padStart(3, "0")}
                        %
          </span>
                </div>

                <div className="futuristic-loader__track">
                    <div
                        className="futuristic-loader__bar"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="futuristic-loader__footer">
          <span>
            Objects {loaded}/{total}
          </span>

                    <span>
            Please stand by
          </span>
                </div>
            </div>
        </div>
    );
}

export default FuturisticLoader;