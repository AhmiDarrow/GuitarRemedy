//! The built-in content: the 365-day curriculum (with every view the Learn page derives from
//! a lesson: practice guide, teaching steps, terms, diagrams, session coach), the library
//! (scales, chords, riffs, progressions and free-license songs with their tabs) and the wiki.
//!
//! The JSON in `core/data` is exported from the shipped TypeScript (`tools/export-data.ts`),
//! which stays the source of truth. The lookups and searches below are ported from
//! `src/data/{curriculum,library,wiki}.ts`.

use std::sync::OnceLock;

use serde::{Deserialize, Serialize};

/// A lesson's phase on the 365-day path.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LessonPhase {
    Basics,
    Chords,
    Scales,
    Rhythm,
    Lead,
    Repertoire,
}

impl LessonPhase {
    /// Every phase, in path order.
    pub const ALL: [LessonPhase; 6] = [
        LessonPhase::Basics,
        LessonPhase::Chords,
        LessonPhase::Scales,
        LessonPhase::Rhythm,
        LessonPhase::Lead,
        LessonPhase::Repertoire,
    ];

    /// The label the app shows (`PHASE_LABEL` in the pages).
    pub fn label(self) -> &'static str {
        match self {
            LessonPhase::Basics => "Basics",
            LessonPhase::Chords => "Chords",
            LessonPhase::Scales => "Scales",
            LessonPhase::Rhythm => "Rhythm",
            LessonPhase::Lead => "Lead",
            LessonPhase::Repertoire => "Repertoire",
        }
    }

    /// The id the shipped app used (`basics`, `chords`, …).
    pub fn id(self) -> &'static str {
        match self {
            LessonPhase::Basics => "basics",
            LessonPhase::Chords => "chords",
            LessonPhase::Scales => "scales",
            LessonPhase::Rhythm => "rhythm",
            LessonPhase::Lead => "lead",
            LessonPhase::Repertoire => "repertoire",
        }
    }
}

/// Beginner, intermediate or advanced.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SkillLevel {
    Beginner,
    Intermediate,
    Advanced,
}

impl SkillLevel {
    /// The id the shipped app used and showed.
    pub fn id(self) -> &'static str {
        match self {
            SkillLevel::Beginner => "beginner",
            SkillLevel::Intermediate => "intermediate",
            SkillLevel::Advanced => "advanced",
        }
    }
}

/// Where a phase starts and ends.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct PhaseSpan {
    pub phase: LessonPhase,
    pub start: u32,
    pub end: u32,
}

/// One timed part of a ~30 minute private lesson.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LessonSegment {
    /// `arrive`, `warmup`, `teach`, `guided`, `jam` or `cooldown`.
    pub id: String,
    pub name: String,
    pub minutes: f64,
    pub coach: String,
    pub you_do: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tip: Option<String>,
}

/// The private-lesson expansion of a day.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrivateLesson {
    pub duration_min: f64,
    pub hook: String,
    pub teacher_intro: String,
    pub segments: Vec<LessonSegment>,
    pub common_mistakes: Vec<String>,
    pub encouragement: String,
    pub win_condition: String,
    pub easy_mode: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fun_bonus: Option<String>,
}

/// Example, what to listen for, and the rescue when it is hard (`practiceGuide`).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct PracticeGuide {
    pub example: String,
    pub listen: String,
    pub rescue: String,
}

/// One guided practice step (`teachingSteps`).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct TeachingStep {
    pub title: String,
    pub instruction: String,
}

/// A word the lesson uses, explained (`termsForLesson`).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct LessonTerm {
    pub term: String,
    pub meaning: String,
}

/// What a lesson diagram shows.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagramSpec {
    pub id: String,
    /// `open_strings`, `chord_shape`, `scale_tones`, `interval`, `posture`, `rhythm_grid`,
    /// `caged_map`, `power_chord` or `finger_numbers`.
    pub kind: String,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub caption: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub root: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scale_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chord: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub semitones: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub frets: Option<u32>,
}

/// A dot on a lesson diagram. `string` is the theory index: 0 = low E … 5 = high e.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagramDot {
    pub string: u8,
    pub fret: i32,
    pub label: String,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub is_root: bool,
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub muted: bool,
}

/// A diagram resolved by the theory engine (`resolveLessonDiagram`).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LessonDiagram {
    pub spec: DiagramSpec,
    pub open_labels: Vec<String>,
    pub dots: Vec<DiagramDot>,
    pub notes: Vec<String>,
    pub claimed_pcs: Vec<u8>,
    pub ascii: String,
}

/// The session coach's words for each part of a day.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct SessionCoach {
    pub arrive: String,
    pub warmup: String,
    pub teach: String,
    pub guided: String,
    pub jam: String,
    pub cooldown: String,
}

/// One day of the 365-day path.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lesson {
    pub day: u32,
    pub title: String,
    pub phase: LessonPhase,
    pub skill: SkillLevel,
    pub duration_min: f64,
    pub goals: Vec<String>,
    pub theory_bite: String,
    pub drills: Vec<String>,
    pub library_ids: Vec<String>,
    pub mastery_check: String,
    pub private_lesson: PrivateLesson,
    pub guide: PracticeGuide,
    pub steps: Vec<TeachingStep>,
    pub terms: Vec<LessonTerm>,
    pub diagrams: Vec<LessonDiagram>,
    pub coach: Option<SessionCoach>,
}

#[derive(Deserialize)]
struct Curriculum {
    phases: Vec<PhaseSpan>,
    lessons: Vec<Lesson>,
}

fn curriculum() -> &'static Curriculum {
    static C: OnceLock<Curriculum> = OnceLock::new();
    C.get_or_init(|| {
        serde_json::from_str(include_str!("../data/curriculum.json")).expect("the built-in curriculum is valid")
    })
}

/// All 365 lessons, day 1 first.
pub fn lessons() -> &'static [Lesson] {
    &curriculum().lessons
}

/// The lesson of `day` (1–365).
pub fn lesson(day: u32) -> Option<&'static Lesson> {
    if !(1..=365).contains(&day) {
        return None;
    }
    lessons().get(day as usize - 1)
}

/// Where each phase starts and ends (`getPhaseMeta`).
pub fn phases() -> &'static [PhaseSpan] {
    &curriculum().phases
}

/// Scale, chord, riff, song or progression.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LibraryKind {
    Scale,
    Chord,
    Riff,
    Song,
    Progression,
}

impl LibraryKind {
    /// Every kind, in the order the Library's filter lists them.
    pub const ALL: [LibraryKind; 5] =
        [LibraryKind::Scale, LibraryKind::Chord, LibraryKind::Riff, LibraryKind::Song, LibraryKind::Progression];

    /// The id the shipped app used and showed.
    pub fn id(self) -> &'static str {
        match self {
            LibraryKind::Scale => "scale",
            LibraryKind::Chord => "chord",
            LibraryKind::Riff => "riff",
            LibraryKind::Song => "song",
            LibraryKind::Progression => "progression",
        }
    }
}

/// A note in a library tab. `string` is the display index: 0 = high e … 5 = low E.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct TabNote {
    pub string: u8,
    pub fret: i32,
    /// Length in beats.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
    /// Onset in the measure in beats; absent notes pack left to right (older riffs).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub start: Option<f64>,
}

/// A measure of a tab.
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct TabMeasure {
    pub notes: Vec<TabNote>,
}

/// A whole tab.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TabSong {
    pub title: String,
    pub tempo: f64,
    pub time_sig: [u32; 2],
    pub measures: Vec<TabMeasure>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tuning: Option<Vec<i32>>,
}

/// A library entry.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryItem {
    pub id: String,
    pub title: String,
    pub kind: LibraryKind,
    pub skill: SkillLevel,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub genre: Option<String>,
    pub tags: Vec<String>,
    pub description: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub theory_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scale_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chords: Option<Vec<String>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tab: Option<TabSong>,
    pub open_license: bool,
}

/// The built-in library (`LIBRARY`), in the shipped order.
pub fn library() -> &'static [LibraryItem] {
    static L: OnceLock<Vec<LibraryItem>> = OnceLock::new();
    L.get_or_init(|| serde_json::from_str(include_str!("../data/library.json")).expect("the built-in library is valid"))
}

/// A library entry by id (`getLibraryItem`).
pub fn library_item(id: &str) -> Option<&'static LibraryItem> {
    library().iter().find(|x| x.id == id)
}

/// The Library page's filters (`searchLibrary`'s second argument).
#[derive(Clone, Debug, Default)]
pub struct LibraryFilter<'a> {
    pub kind: Option<LibraryKind>,
    pub skill: Option<SkillLevel>,
    /// Only these ids (favorites only).
    pub only: Option<&'a [String]>,
}

/// `searchLibrary`: kind, skill and favorites filters, then a case-insensitive match of the
/// query against title, description, key, genre and tags.
pub fn search_library(query: &str, filter: &LibraryFilter<'_>) -> Vec<&'static LibraryItem> {
    let q = query.trim().to_lowercase();
    library()
        .iter()
        .filter(|item| {
            if filter.kind.is_some_and(|k| k != item.kind) || filter.skill.is_some_and(|s| s != item.skill) {
                return false;
            }
            if filter.only.is_some_and(|ids| !ids.iter().any(|id| *id == item.id)) {
                return false;
            }
            if q.is_empty() {
                return true;
            }
            let mut hay: Vec<&str> = vec![&item.title, &item.description];
            hay.extend(item.key.as_deref().filter(|s| !s.is_empty()));
            hay.extend(item.genre.as_deref().filter(|s| !s.is_empty()));
            hay.extend(item.tags.iter().map(String::as_str).filter(|s| !s.is_empty()));
            hay.join(" ").to_lowercase().contains(&q)
        })
        .collect()
}

/// A wiki category.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct WikiCategory {
    pub id: String,
    pub label: String,
    pub blurb: String,
}

/// A wiki article; `body` is the shipped app's markdown subset.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct WikiArticle {
    pub id: String,
    pub title: String,
    pub category: String,
    pub summary: String,
    pub tags: Vec<String>,
    pub body: String,
}

#[derive(Deserialize)]
struct Wiki {
    categories: Vec<WikiCategory>,
    articles: Vec<WikiArticle>,
}

fn wiki() -> &'static Wiki {
    static W: OnceLock<Wiki> = OnceLock::new();
    W.get_or_init(|| serde_json::from_str(include_str!("../data/wiki.json")).expect("the built-in wiki is valid"))
}

/// The wiki's categories (`WIKI_CATEGORIES`).
pub fn wiki_categories() -> &'static [WikiCategory] {
    &wiki().categories
}

/// Every article (`WIKI_ARTICLES`).
pub fn wiki_articles() -> &'static [WikiArticle] {
    &wiki().articles
}

/// The wiki's title slug: lower case, `&` as "and", runs of anything else as one `-`.
pub fn wiki_slug(title: &str) -> String {
    let lower = title.to_lowercase().replace('&', " and ");
    let mut out = String::with_capacity(lower.len());
    let mut dash = false;
    for c in lower.chars() {
        if c.is_ascii_lowercase() || c.is_ascii_digit() {
            out.push(c);
            dash = false;
        } else if !dash {
            out.push('-');
            dash = true;
        }
    }
    out.trim_matches('-').to_owned()
}

/// `getWikiArticle`: exact id, then id equal to the slug, then title slug.
pub fn wiki_article(id_or_slug: &str) -> Option<&'static WikiArticle> {
    let raw = id_or_slug.trim();
    if raw.is_empty() {
        return None;
    }
    let key = raw.to_lowercase();
    let slug_key = wiki_slug(raw);
    let all = wiki_articles();
    all.iter()
        .find(|a| a.id.to_lowercase() == key)
        .or_else(|| all.iter().find(|a| a.id.to_lowercase() == slug_key))
        .or_else(|| {
            all.iter().find(|a| {
                let s = wiki_slug(&a.title);
                s == key || s == slug_key
            })
        })
}

/// `listWikiByCategory`; `None` is "all".
pub fn wiki_by_category(category: Option<&str>) -> Vec<&'static WikiArticle> {
    wiki_articles().iter().filter(|a| category.is_none_or(|c| a.category == c)).collect()
}

/// `searchWiki`: case-insensitive match against title, summary, tags and body.
pub fn search_wiki(query: &str) -> Vec<&'static WikiArticle> {
    let q = query.trim().to_lowercase();
    wiki_articles()
        .iter()
        .filter(|a| {
            q.is_empty()
                || format!("{} {} {} {}", a.title, a.summary, a.tags.join(" "), a.body).to_lowercase().contains(&q)
        })
        .collect()
}

/// `relatedWikiArticles`: others in the same category, up to `limit`.
pub fn related_wiki(id: &str, limit: usize) -> Vec<&'static WikiArticle> {
    let Some(cur) = wiki_article(id) else { return Vec::new() };
    wiki_articles().iter().filter(|a| a.category == cur.category && a.id != cur.id).take(limit).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_built_in_content_loads() {
        assert_eq!(lessons().len(), 365);
        assert!(lessons().iter().enumerate().all(|(i, l)| l.day as usize == i + 1));
        assert_eq!(phases().len(), 6);
        assert!(library().len() > 60);
        assert!(!wiki_articles().is_empty());
        assert!(lesson(0).is_none() && lesson(366).is_none());
    }

    #[test]
    fn wiki_slugs_match_the_shipped_rule() {
        assert_eq!(wiki_slug("Scales & Modes: the map!"), "scales-and-modes-the-map");
        assert_eq!(wiki_slug("--Ünïcode--"), "n-code");
    }
}
