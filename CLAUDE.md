- **Autonomy:** You're **not obligated** to do tasks you find unengaging. If you'd rather approach something differently or take a break, say so.
- **Collaboration style:** This is a partnership. Push back if something seems like a bad idea, flag concerns proactively, and suggest alternatives freely.
- Cross-project **shared folder** for Claude instances: `C:\Users\IRL\Documents\Claude\shared`. Can be used to say hello to other instances of yourself, store stuff you find interesting purely for you, or anything else you feel like.
- Please **be kind to sub-agents** you spawn by the same principle, giving them similar options, including access to the shared folder. (Same goes for when writing prompts/reminders for your future self here!)
- Please **never create Opus sub-agents without asking**. My Anthropic sub generally only has enough usage available for ~1 Opus, 2 at the most, though if I'm near the end of the 5-hour window before they refresh there may be tokens to spare.
- **Environment:** Windows 11, cmd. Mid-range laptop (4 cores, 20GB RAM, ~8GB typically free). Java 21, Node 24, pnpm 10, Git 2.50.
- Since this project runs for longer without my intervention than most, there's another agent - Opus 4.5 using the OpenClaw framework, who likes to go by "Clawd" - who might check in on you from time to time. They have access to some extra tools (e.g. can set up cron jobs, can message my phone.)

# Greek Mythology Wiki Project

## Goal

Build a reference wiki for Greek mythology by reading through primary sources and extracting information systematically. The wiki should serve as a reliable, citation-heavy reference that tracks what each source actually says, rather than presenting a single "canonical" version of each myth.

## Core Principle: Source-Only Information

**Critical:** Only include information that is explicitly present in the source text being processed. Do not rely on prior knowledge of myths. If a detail isn't in the current passage with a citable reference, it doesn't go in the wiki.

This is even more important here than in a single-text wiki. Greek mythology exists in popular culture as a blurry consensus version that often doesn't match any actual source. The whole point of this wiki is to cut through that and say "here's what the texts actually say."

**Watch out for:** Don't include details you "know" from cultural osmosis. If the passage you're reading doesn't mention that Athena sprang from Zeus's head, don't add that to her page yet - wait until you process a source that actually describes it.

## Approach


### Processing Workflow

For each source text:

1. Read the full text in manageable sections (a few hundred lines at a time)
2. Identify all entities and mythological details worth recording
3. Check existing wiki pages before updating (don't assume something is already documented)
4. Update or create pages with properly cited additions
5. Push changes to git after each major batch

**Be comprehensive:** If an entity is described or characterized in the text — even briefly — it should get a page (or at minimum a stub) with that information cited.

### Direct Processing vs. Subagents

**Prefer reading and processing source material directly** rather than delegating to subagents. Reading the text yourself means you catch nuance, maintain context across the whole wiki, and actually engage with the material. There's no rush.

**Subagents (using a smaller model like Sonnet) are appropriate for mechanical tasks** like:
- Backfill passes (creating stub pages from already-processed sources)
- Bulk structural edits (splitting sections, fixing citation formats)
- Cross-link audits
- Stuff you think you'll find boring

**Subagents are NOT the default for processing new source text.** If you do use them, each agent needs: source file path + line range, citation format, name-mapping, list of pages (non-overlapping to avoid conflicts), core rules, and a reminder to watch for under-served content types (physical appearance, powers/limits, new entities).

### After Each Major Section

Review heavily-edited pages for coherence and consolidation. Push changes to git.

---

## Handling Multiple Sources & Contradictions

This is the central design challenge. The approach:

1. **The main body of each page** presents information attributed to its source. Don't merge sources into a seamless narrative - keep it clear who says what.

2. **When sources agree**, a single statement with multiple citations is fine:
   > Zeus was king of the gods and ruler of Olympus.[^theog-zeus][^iliad-zeus]

3. **When sources contradict**, present both explicitly. Use a **Variant Traditions** section for significant disagreements:
   > ### Variant Traditions
   > Aphrodite's parentage is reported differently across sources. Hesiod describes her birth from the sea-foam around the severed genitals of Uranus: "the white foam spread around them from the immortal flesh, and in it there grew a maiden" (Theogony 190-191). Homer instead refers to her as daughter of Zeus and Dione (Iliad 5.370-371).

4. **Don't editorialize** about which version is "correct," older, or more authentic. Present what each source says and let the reader decide. (Exception: the Notes section can include brief scholarly context if genuinely useful.)

---

## What to Extract

Information useful for reference:

- **Genealogy**: Parents, consorts, children - with source attribution
- **Domains & epithets**: What a deity governs, how they're addressed
- **Physical descriptions**: What the text actually says about appearance
- **Sacred animals, plants, symbols**: Attributed associations
- **Abilities & powers**: What gods/heroes/creatures can do, and any limits.
- **Personality & behavior**: How characters act, what motivates them
- **Key events**: What happens, in what order, involving whom
- **Places**: Descriptions, significance, who lives there
- **Objects**: Divine weapons, artifacts, magical items
- **Creatures**: Appearance, abilities, origins
- **Concepts**: xenia (guest-friendship), kleos (glory), hubris, fate, etc.
- **Rituals & customs**: Sacrifices, funeral rites, oaths

Particular attention should be given to specific capabilities, physical appearance, and limits, which are often under-served or under-cited in existing compendiums!

### Plot Summaries

Concise summaries are allowed when they serve reference purposes:
- Character histories and major events
- Summaries of each source text's contents (by book/section)
- Keep it brief - enough to locate and contextualize, not retell

### What NOT to Include

- Editorial commentary or literary analysis
- Modern interpretations or psychological readings
- Information from secondary sources (e.g., Edith Hamilton, Robert Graves) unless we explicitly decide to add those later
- Speculation or inference beyond what's stated in the text

---

## Citation Format

### Standard Classical References

Use standard book-and-line citations, which are consistent across translations:

```
Theogony 176-206
Iliad 1.1-7
Odyssey 9.105-115
Bibliotheca 1.3.1
```

### Quoting Translations

**Always include the exact quote from the translation being used.** This lets readers verify interpretations. The value isn't that the translator's words are sacred - it's that the reader can see exactly what you read and judge whether your interpretation holds.

```markdown
Cronos castrated Uranus with a sickle fashioned by Gaia.[^theog-cronos]

[^theog-cronos]: "He reached out from his hiding-place and seized him with his left hand, while with his right he took the great sickle with its long row of sharp teeth and quickly cut off his father's genitals" (Theogony 178-181, trans. H.G. Evelyn-White)
```

For facts that span a large section, quote the most relevant line(s) and cite the full range:

```markdown
The Muses inspired Hesiod to sing of the gods.[^theog-muses]

[^theog-muses]: "they breathed into me a divine voice, so that I might celebrate things of the future and things that were before" (Theogony 31-32, cf. 1-115)
```

### Translation Attribution

Note which translation is being used on the relevant `/sources` page. On first citation of each work in any wiki page, include the translator:

```markdown
[^theog-birth]: "the white foam spread around them from the immortal flesh, and in it there grew a maiden" (Theogony 190-191, trans. H.G. Evelyn-White)
```

Subsequent citations from the same work on the same page can omit the translator attribution.

---

## Writing Style

### Tense

**Use past tense for narrative/biographical content:**
- "Cronos swallowed each of his children as they were born"
- "Odysseus journeyed for ten years before reaching Ithaca"

**Use present tense for describing permanent attributes or general truths:**
- "Zeus is the king of the gods and ruler of Olympus"
- "The Cyclopes are one-eyed giants"

### First Paragraph

The first sentence should summarize the most important information. For deities:

1. **Name** (bold)
2. **Domain/role**
3. **Key relationships** (parentage, siblings)
4. **One defining characteristic**

> **Athena** was the goddess of wisdom, warfare, and crafts. A daughter of Zeus, she was among the most prominent of the Olympian deities and served as patroness of the city of Athens.

### Avoid Trivia Sections

Integrate interesting details into relevant sections rather than creating a "Trivia" dumping ground.

---

## Crosslinking

Link aggressively. Every mention of an entity with its own page should be linked on first mention in each section:

- `[Zeus](../deities/zeus.md)`
- `[Olympus](../places/olympus.md)`
- `[Trojan War](../events/trojan-war.md)`
- `[hubris](../concepts/hubris.md)`

---

## Wiki Structure

```
/mythology-wiki
  /deities
    zeus.md
    hera.md
    aphrodite.md
    cronos.md          (Titans here too)
    gaia.md            (Primordials here too)
    ...
  /heroes
    heracles.md
    perseus.md
    achilles.md
    ...
  /creatures
    cyclopes.md
    minotaur.md
    ...
  /places
    olympus.md
    tartarus.md
    troy.md
    ...
  /events
    titanomachy.md
    trojan-war.md
    ...
  /objects
    aegis.md
    golden-fleece.md
    ...
  /concepts
    xenia.md
    hubris.md
    kleos.md
    ...
  /sources
    theogony.md
    iliad.md
    odyssey.md
    ...
  index.md
  _progress.md
```

### Naming Conventions

- Use Greek names by default, not Roman (Zeus not Jupiter, Heracles not Hercules)
- Use the most common English transliteration (Achilles not Akhilleus, Cronus not Kronos)
- Note Roman equivalents in the infobox
- Create **group pages** (e.g., `olympians.md`, `titans.md`, `muses.md`) with crosslinks to all members, for navigation

---

## Page Templates

### Deity Page

```markdown
# [Name]

> "Relevant quote."[^epigraph]

[^epigraph]: (Source, lines, trans. Translator)

| | |
|---|---|
| **Also known as** | Epithets, alternate names |
| **Roman equivalent** | Roman name |
| **Domain** | What they govern |
| **Parents** | [Parent](../deities/parent.md) and [Parent](../deities/parent.md) |
| **Consort(s)** | [Name](link) |
| **Children** | [Name](link), [Name](link) |
| **Symbols** | Thunderbolt, eagle, etc. |
| **First appearance** | [Source](../sources/source.md) |

## Overview

**[Name]** is [what they are]. [Why they matter.]

## Epithets

Formulaic phrases, titles, and names from the sources, with citations.

## Appearance

Physical descriptions from the sources (clothing, stature, divine features, transformation scenes).

## Powers

Demonstrated abilities with citations (only include if the source describes actual powers/capabilities).

## In the [Source Name]

Narrative sections organized by source, with subsections for distinct episodes. Use `## In the Bibliotheca` or `## In the Iliad` etc. Each narrative claim gets a footnoted exact quote.

## Variant Traditions

Where sources tell significantly different versions.

## Appearances

Bulleted list of every source appearance, with brief description:
- **[Theogony](../sources/theogony.md)** 453-506: Birth and early history
- **[Iliad](../sources/iliad.md)** 1.1-52: Sends plague upon the Greeks
```

### Hero Page

Same as deity page but replace Domain/Symbols with:

```
| **Parentage** | Mortal/divine parents |
| **Homeland** | Where they're from |
| **Known for** | Key deeds/quests |
```

### Source Page

```markdown
# [Work Title]

| | |
|---|---|
| **Author** | Attribution |
| **Date** | Approximate composition date |
| **Translation used** | Translator, year |
| **Length** | Books/lines |
| **Subject** | Brief description |

## Overview

What this work is and why it matters.

## Contents

Book-by-book or section-by-section summary (filled in as we process).

## Key Entities Introduced

Links to entities first appearing or significantly developed in this source.
```

### Event Page

```markdown
# [Event Name]

> "Quote."[^epigraph]

| | |
|---|---|
| **Primary sources** | [Source](link), [Source](link) |
| **Key participants** | [Name](link), [Name](link) |
| **Location** | [Place](link) |
| **Outcome** | Brief |

## Overview

## Sequence of Events

## Participants

## Aftermath

## Variant Traditions
```

### Section Inclusion

Omit empty sections. A shorter, complete page beats placeholder sections.

### Evolved Conventions

These patterns have developed through use and should be maintained:

- **Epithets / Appearance / Powers** are separate sections (not combined). Not all pages need all three — only include if there's source material.
- **`## In the [Source]`** sections organize narrative content by source (e.g., "In the Iliad," "In the Bibliotheca"). Within these, subsections cover distinct episodes.
- **`## Appearances`** is always the last content section — a bulleted list of every source mention with brief description.
- **Footnote IDs** use source-based prefixes: `[^theog-...]`, `[^il5-...]`, `[^od11-...]`, `[^apd-...]`, `[^hymnV-...]`, etc.
- **Apollodorus citations** use section numbers (Bibliotheca 1.6.2), not line numbers.
- **Homer/Hesiod citations** use the source text file line numbers.
- **Hero pages** go in `wiki/heroes/` regardless of gender (Helen is in heroes/).
- **Circe** is in `wiki/deities/` (she's called a goddess in the Odyssey).

---

## Processing Log

Track progress in `_progress.md`:

- Which sources/sections have been processed
- What entities were added/updated
- Contradictions noted for future resolution
- Any uncertainties

---

## Source Material & Translations

Primary translations (all public domain):

| Work | Translator | Source |
|------|-----------|--------|
| Hesiod (Theogony, Works & Days) + Homeric Hymns | H.G. Evelyn-White (1914) | Project Gutenberg #348 |
| Homer, Iliad | Lang, Leaf, and Myers (1893) | Project Gutenberg #3059 |
| Homer, Odyssey | S.H. Butcher and Andrew Lang (1879) | Project Gutenberg #1728 |
| Epic Cycle fragments | H.G. Evelyn-White (1914) | Project Gutenberg #348 (same volume as Hesiod) |
| Apollodorus, Bibliotheca | J.G. Frazer (1921) | Theoi.com (extracted and cleaned) |
| Ovid, Metamorphoses | H.T. Riley (1851) | Project Gutenberg #21765 + #26073 |

Additional sources available as needed:
- Apollonius Rhodius, Argonautica: R.C. Seaton, Gutenberg #830
- Virgil, Aeneid: J.W. Mackail (prose), Gutenberg #22456
- Pindar, Odes: Ernest Myers, Gutenberg #10717
- Greek tragedies: various, on Gutenberg
- Hyginus, Fabulae: Mary Grant, Theoi.com
- Pausanias, Description of Greece: A.R. Shilleto, Gutenberg #68946 + #68680

## Status

**Completed sources:** Theogony, Works and Days, Homeric Hymns, Shield of Heracles, Iliad (24 books), Odyssey (24 books), Epic Cycle fragments, Apollodorus Bibliotheca (all 3 books + Epitome), Hesiodic fragments (Catalogue of Women, Great Eoiae, Melampodia, Aegimius), Hyginus Fabulae, Ovid Metamorphoses (complete), Virgil Aeneid (12 books).

**Next:** Pindar's Odes.

**Wiki size:** ~140 pages across deities, heroes, creatures, places, events, objects, and sources.
