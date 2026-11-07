# Retrieval corpus and search

## Contents

`rag/nietzsche.sqlite` contains 5,180 passages from 15 selected work/edition records, indexed in German, English, and French. Original Project Gutenberg text files are in `rag/sources/`. The corpus is deliberately described as a selected corpus, not Nietzsche's complete works.

## Search method

The server extracts search keywords from the conversation, then searches the SQLite FTS5 index and ranks matches with BM25. This is lexical full-text retrieval, not semantic embeddings or vector search. A relevant passage can be missed when it uses different vocabulary, and a lexical match can be weakly relevant. Retrieval should support interpretation rather than determine it.

## Metadata and caveats

Each passage stores work, siglum, section label, language, source kind, edition, translator, Nietzsche Source URL where available, Project Gutenberg source URL, and text. Translations do not have the same wording or nuance as the German originals. The *Will to Power* record is Max Brahn's posthumous compilation and must not be presented as a book Nietzsche completed and published.

See [`../DATA-LICENSES.md`](../DATA-LICENSES.md) for provenance and redistribution terms. Rebuild instructions live in `rag/build_corpus.py` when included; the checked-in SQLite database is the corpus snapshot used by the project.
