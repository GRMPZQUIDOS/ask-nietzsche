# Response pattern bank

The runtime bank is `api/pattern_bank.json`. Each entry has a stable ID, exact source reference, a `serves` field describing the kind of judgment it supports, and a sequence of moves. The six patterns currently available are:

| ID | Pattern | Source | Judgment it serves |
| --- | --- | --- | --- |
| `P-JGB-001` | Interrogative reversal | *Beyond Good and Evil* §1 | Turns an apparently self-evident value back toward the desire or assumptions behind it. |
| `P-GD-001` | The hammer | *Twilight of the Idols*, Preface | Tests an admired value that may ring hollow, while noting what withstands the test. |
| `P-GM-001` | Genealogy | *On the Genealogy of Morality*, Preface §6; *Human, All Too Human* I §92 | Traces a supposedly natural value to a concrete, concealed origin and judges its present use. |
| `P-ZA-001` | Praise that demands | *Thus Spoke Zarathustra* I, “On the Bestowing Virtue” | Praises an overflowing strength while demanding that it go further. |
| `P-ZA-002` | The last man | *Thus Spoke Zarathustra*, Prologue §5 | Tests a text's longing for comfort, safety, moderation, or the end of anxiety. |
| `P-GD-002` | The dry aphorism | *Twilight of the Idols*, “Maxims and Arrows” | Compresses a judgment into a brief, sharp sentence when the material calls for it. |

## Runtime behavior

Nietzsche first reads the submission and forms a judgment. The system then selects the pattern whose `serves` field best fits that judgment; the pattern guides the movement of the answer rather than supplying a doctrine to repeat. The response may end with a clear verdict. Leaving the issue open is no longer a general requirement.

Patterns borrow an organization of thought, not the source passage's doctrine or wording. The bank is a small operational set, not a complete inventory of Nietzsche's ways of thinking. New candidates require source and distinctiveness review before they are activated.
