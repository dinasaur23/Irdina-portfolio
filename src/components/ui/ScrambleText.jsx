import {
    useEffect,
    useRef,
    useState,
} from "react";

const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>-_";

function ScrambleText({
                          children,
                          duration = 450,
                      }) {
    const finalText = String(children);

    const [displayedText, setDisplayedText] =
        useState(finalText);

    const animationFrameRef = useRef(null);

    function stopAnimation() {
        if (animationFrameRef.current) {
            cancelAnimationFrame(
                animationFrameRef.current,
            );

            animationFrameRef.current = null;
        }
    }

    function startAnimation() {
        stopAnimation();

        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed =
                currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1,
            );

            const revealedCount = Math.floor(
                progress * finalText.length,
            );

            const scrambledText = finalText
                .split("")
                .map((character, index) => {
                    if (character === " ") {
                        return " ";
                    }

                    if (index < revealedCount) {
                        return character;
                    }

                    const randomIndex = Math.floor(
                        Math.random() *
                        CHARACTERS.length,
                    );

                    return CHARACTERS[randomIndex];
                })
                .join("");

            setDisplayedText(scrambledText);

            if (progress < 1) {
                animationFrameRef.current =
                    requestAnimationFrame(animate);
            } else {
                setDisplayedText(finalText);
                animationFrameRef.current = null;
            }
        }

        animationFrameRef.current =
            requestAnimationFrame(animate);
    }

    function resetText() {
        stopAnimation();
        setDisplayedText(finalText);
    }

    useEffect(() => {
        setDisplayedText(finalText);

        return () => {
            stopAnimation();
        };
    }, [finalText]);

    return (
        <span
            onPointerEnter={startAnimation}
            onFocus={startAnimation}
            onPointerLeave={resetText}
            onBlur={resetText}
        >
      {displayedText}
    </span>
    );
}

export default ScrambleText;