# GuitarRemedy 0.2.0 — Practice with a clear next step

Lessons now give you something specific to try, what to listen for, and a smaller step when you get stuck. The first week includes detailed open-string, fretting, Em, G, C, D, and chord-loop examples. Every later lesson connects its first drill with listening and troubleshooting guidance.

Before moving on, try the lesson target without the instructions and choose **Still building**, **Getting steady**, or **Ready to move on**. Any choice logs practice. Only **Ready to move on** completes a new lesson. These are self-assessments; the app does not grade or listen to your playing.

Lesson checkboxes, selected segments, and notes save on the device. Reviews are scheduled after 1, 3, or 7 calendar days according to your self-check and appear on Home when due. These are in-app reminders, not background notifications. Existing completions, favorites, profile settings, and saved tabs remain available.

The update also includes home-page and accessibility polish, cancellable tuner startup, full theory explanations, corrected lesson timing, actual completion percentages, and local-calendar practice dates.

## Validation

- Frontend: typecheck and 287 tests, including lesson completion/navigation, persistence, review scheduling, tuner lifecycle, and the full curriculum/diagram audit.
- Production web build and Rust tests.
- Browser smoke check: onboarding, day 1 guidance, self-check, saved practice feedback, and responsive lesson layout.

Windows installers and signed updater metadata are published through the existing GitHub release workflow. Android remains a debug APK for sideloading.
