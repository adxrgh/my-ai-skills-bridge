# Source fidelity and rights

## Fidelity labels

- `decoded_text_normalized_newlines`: TXT/Markdown characters come from the decoded local file; newline style is normalized.
- `canonical_rendered_text`: EPUB prose comes from the OPF spine and semantic HTML blocks. HTML entities and rendered whitespace are normalized; this is not byte-for-byte XHTML.
- `extracted_pdf_text_not_page_facsimile`: PDF text comes from its text layer through `pdftotext` or `pypdf`. Reading order, ligatures, hyphenation, headers, and OCR errors may differ from the visible page.

For scanned PDFs, run OCR before ingest. OCR output remains an OCR transcription. Do not call it exact original text without checking the relevant page images.

The manifest records the source SHA-256, extractor version, canonical-text SHA-256, locator, and per-block hashes. These prove what local canonical text was materialized; they do not prove an OCR engine or PDF layout reconstruction was correct.

## Rights boundary

Use complete copyrighted sources only when the user is authorized to process them. Store indexes, excerpts, and rendered editions in a private local work directory by default. A private transformation request does not authorize publishing, sharing, selling, or uploading a substantial substitute for the book.

Before any artifact leaves the private workspace, separately confirm the source's public-domain/licence status or the user's publication rights and assess the amount and purpose of the excerpts.
