# English-only repository

English is the only language permitted in content tracked by Git in this repository. All natural-language text added to or modified in the repository must be written in English, including:

- User-facing interface copy, accessibility text, and media containing text, outside `src/content/` and `src/i18n/locales/`.
- Documentation, examples, fixtures, and test data.
- Source-code identifiers, comments, and developer-facing messages.
- Configuration, scripts, filenames, directory names, and commit messages.

The one exception is the product's own user-facing copy. The landing page is deliberately bilingual, and the Portuguese and English editions under `src/content/` and `src/i18n/locales/` are both first-class product content. Editing, extending, or correcting either edition is expected work, and a change that makes one edition true must make the other true as well.

Everything outside those two directories stays English, including documentation, specs, plans, commit messages, code identifiers, comments, developer-facing messages, configuration, and scripts. Translate non-English source material into English before storing it anywhere else in the repository.

Proper nouns, trademarks, package names, protocol keywords, API values, and other standardized technical tokens may retain their official spelling when translating them would make them incorrect or unrecognizable. Files with no natural-language content are unaffected.
