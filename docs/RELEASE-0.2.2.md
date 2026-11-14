# GuitarRemedy 0.2.2 — Smoother practice tools

This update fixes the small things that got in the way while practicing.

**Typing numbers works.** BPM, A4, custom tuning, and the tab editor's tempo, fret, and timing fields now accept what you type. Previously, clearing a field and typing "120" could snap to the minimum after the first digit.

**Steadier tuner.** Changing A4 no longer restarts the microphone with every keystroke, and A4 accepts 400–480 Hz. If the tuner can't start, it releases the microphone instead of leaving it on. Readings drop fewer samples, and quiet-room calibration now listens to a full second of your room.

**Tab editor and players.** Changing a note's start beat or string keeps that note selected. If you start a scale or tab while the metronome is running (or the other way round), the player that stopped now shows that it stopped.

**Your tabs.** Older or hand-made `.grtab.json` files import cleanly. If your device can't store a tab (for example, storage is full), the app tells you and suggests exporting a copy so nothing is lost. Exports download reliably in more browsers and in the Android app.

**Security.** The Android app runtime includes the latest security fixes.

Your lesson progress, notes, reviews, and saved tabs carry over unchanged. Android is a debug APK for sideloading. Windows installs update in place via About → Check for updates.
