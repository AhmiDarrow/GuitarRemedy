//! GuitarRemedy's own logic, kept apart from the interface so it builds and tests quickly on
//! every platform: ported from the shipped TypeScript (`src/lib`, `src/data`, `src/store`)
//! and checked against it by the parity tests in `core/tests`, whose fixtures are made by
//! running the shipped code itself (`remedyui/tools/gen-*.ts`).

pub mod data;
