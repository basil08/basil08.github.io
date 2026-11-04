# Conference tracker backend

Read-only JSON feed for `/conference-tracker/`. The sheet stays restricted: the
web app runs as you and returns only the allowlisted columns in `COLUMNS`
(`Code.gs`). Status, Remarks and anything else are dropped on the server.

## Deploy

1. Open the sheet → **Extensions → Apps Script**.
2. Replace `Code.gs` with this folder's `Code.gs`. Enable *Project Settings →
   Show "appsscript.json" manifest file* and paste `appsscript.json`. This limits
   the script to **this one sheet** (`spreadsheets.currentonly`). SpreadsheetApp
   has no read-only scope, but the code never writes. The manifest also enables
   the **Drive** advanced service with `drive.metadata.readonly`. That scope
   can read file metadata only, never contents, and the script uses it solely
   for the sheet's "last edited" time. If you'd rather not grant it, remove both
   entries; the page then shows only "last fetched".
3. Set `SHEET_NAME` if the data isn't on the first tab.
4. Run `debugPrint` once from the editor to authorise and check the output.
5. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**.
6. Copy the `/exec` URL into `config.toml`:

   ```toml
   [params]
     conferenceTrackerURL = "https://script.google.com/macros/s/…/exec"
   ```

## Notes

- **Header row** is row 1. Matching ignores case and surrounding spaces. To
  publish a new column, add it to `COLUMNS`, then the page must also render it
  (`assets/js/conference-tracker.js`).
- **Dates**: format date cells as real dates. A bare date is treated as
  *end of day AoE*. A date with a time is sent with the sheet's timezone offset.
  Text like `TBA` is shown as-is and doesn't count toward sorting.
- **Area** can hold several values separated by `,` `;` `/` or `|`. Each one
  becomes a filter option.
- **Archival?** accepts `Yes`/`No`, `TRUE`/`FALSE` or a checkbox.
- **Caching**: responses are cached for 10 min (`CACHE_SECONDS`). For instant
  updates, add an *On edit* trigger that runs `clearCache`.
- **Updating code**: use *Manage deployments → Edit → New version*. That keeps
  the same `/exec` URL, whereas *New deployment* gives you a new one.
