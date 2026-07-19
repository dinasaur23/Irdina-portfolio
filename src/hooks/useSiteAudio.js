import { useCallback, useEffect, useRef, useState } from "react";

function useSiteAudio() {
    const backgroundMusicRef = useRef(null);
    const hoverSoundRef = useRef(null);
    const clickSoundRef = useRef(null);

    const [isSoundEnabled, setIsSoundEnabled] = useState(false);

    useEffect(() => {
        const backgroundMusic = new Audio("/audio/space-ambient.mp3");
        const hoverSound = new Audio("/audio/button-hover.wav");
        const clickSound = new Audio("/audio/button-click.wav");

        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.22;

        hoverSound.volume = 0.38;
        clickSound.volume = 0.35;

        backgroundMusicRef.current = backgroundMusic;
        hoverSoundRef.current = hoverSound;
        clickSoundRef.current = clickSound;

        return () => {
            backgroundMusic.pause();

            backgroundMusicRef.current = null;
            hoverSoundRef.current = null;
            clickSoundRef.current = null;
        };
    }, []);

    const playSound = useCallback((audioRef) => {
        const audio = audioRef.current;

        if (!audio || !isSoundEnabled) {
            return;
        }

        /*
         * Return the sound to the beginning so it can be
         * played repeatedly during quick interactions.
         */
        audio.currentTime = 0;

        audio.play().catch(() => {
            // The browser may block sound before user interaction.
        });
    }, [isSoundEnabled]);

    const playHoverSound = useCallback(() => {
        playSound(hoverSoundRef);
    }, [playSound]);

    const playClickSound = useCallback(() => {
        playSound(clickSoundRef);
    }, [playSound]);

    const toggleSound = useCallback(async () => {
        const backgroundMusic = backgroundMusicRef.current;

        if (!backgroundMusic) {
            return;
        }

        if (isSoundEnabled) {
            backgroundMusic.pause();
            setIsSoundEnabled(false);
            return;
        }

        try {
            await backgroundMusic.play();
            setIsSoundEnabled(true);
        } catch (error) {
            console.error("The browser prevented audio playback:", error);
        }
    }, [isSoundEnabled]);

    return {
        isSoundEnabled,
        toggleSound,
        playHoverSound,
        playClickSound,
    };
}

export default useSiteAudio;