# Response pattern bank

Pattern data is stored separately from the code that resolves and applies it:

- `api/pattern_bank.json` contains stable IDs, names, source references, and abstract movements.
- `api/patterns.php` recognizes explicit selection and builds a pattern instruction.
- `api/chat.php` adds the instruction only after request validation and only for the Nietzsche chat mode.

## Current documented pattern

`P-JGB-001`, “Questioning reversal,” is based on *Beyond Good and Evil* §1. Its movement starts from an accepted value, examines it, turns the inquiry toward its assumptions, tests a reversal, and leaves a productive tension open. It borrows an argumentative movement, not the source's thesis or wording.

The resolver recognizes a request such as “Use aphorism 1 to comment on my book,” and the stable ID. An explicit negative request should prevent activation. When no pattern is selected, the usual character behavior applies.

Automatic selection of the best pattern for an incoming text is not active in this source snapshot. The 12–15 pattern initial-bank estimate is a design target; it is not the current number of implemented patterns.
