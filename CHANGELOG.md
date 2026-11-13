# Changelog

## V2.2 — 2026-11-13

- Paul no longer summarizes the visitor's submission. He quotes 4–8 exact anchors and supplies search terms in German, English, and French.
- Passage retrieval also searches the attached document. Where possible, it selects passages from different works.
- Nietzsche reads the full submission and forms a judgment before choosing a response pattern: what he wants, praises, attacks, and his verdict.
- The runtime bank grows from one to six mechanics. Each pattern records which judgment it serves: interrogative reversal, the hammer, genealogy, praise that demands, the last man, and the dry aphorism.
- The general requirement to leave the conclusion open is removed. The response may deliver a clear verdict.
- Judgment and writing use `claude-sonnet-5-5` with adaptive thinking at medium effort; Paul remains on `claude-haiku-5-5`.
- Any summary of the submitted text is limited to one sentence. Coaching formulas, closing questions, and a minimum response length are removed.
- Nietzsche uses formal address throughout all six supported languages, including when the visitor uses an informal register.
- Paul's handoff message is now: “Je transmets à Monsieur Nietzsche.”
- API errors now expose the model, HTTP status, and the API's reason.
- Known retrieval limitation: *On the Genealogy of Morality* and *The Gay Science* are absent from the local RAG corpus.

## V2.1 — 2026-11-08

- Paul Rée welcomes the visitor in three bubbles, explains his role, and gathers a question or submitted text.
- A three-call AI chain checks whether a submission is suitable, extracts lines of meaning, selects a response pattern, and drafts Nietzsche's reply.
- Paul closes the exchange by explaining that Nietzsche has a migraine and inviting the visitor to return.
- The interface adds the Algorithm panel and developer view for the exchange's lines of meaning, selected pattern, and references.
- Community comments and a rate-limited AI summary of those comments are added.

## V2.0 — initial public source

- Initial public source and project documentation, corresponding to commit `82ed2ab`.
