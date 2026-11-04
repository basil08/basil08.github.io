/**
 * Conference tracker -- read-only JSON feed for basillabib.com/conference-tracker/
 *
 * Deploy as a web app (Execute as: Me, Who has access: Anyone). The sheet
 * itself stays restricted; only the columns in COLUMNS below are ever sent.
 * Anything not listed (Status, Remarks, scratch columns added later) is
 * dropped on the server and never reaches the browser.
 *
 * Response:
 *   { "updated": "<when the sheet was last read>",
 *     "sheetModified": "<when the sheet file was last edited, or null>",
 *     "conferences": [ { ...fields } ] }
 * or on failure
 *   { "error": "message" }
 */

// ---- Configuration ---------------------------------------------------------

// The script must be bound to the sheet (Extensions > Apps Script). It uses the
// `spreadsheets.currentonly` scope: access to that one file only. SpreadsheetApp
// has no read-only scope; this code never writes.

// Tab to read. Empty = first tab.
const SHEET_NAME = '';

// Seconds to cache the JSON. Edits to the sheet show up after at most this long.
const CACHE_SECONDS = 600;

// Sheet header -> JSON key. Header matching ignores case and surrounding
// whitespace (so "Reviews Released " still matches). This is an ALLOWLIST.
const COLUMNS = {
  'Type': 'type',
  'Archival?': 'archival',
  'Track': 'track',
  'Presentation Type': 'presentationType',
  'Name': 'name',
  'Area': 'area',
  'Location': 'location',
  'Venue': 'venue',
  'URL': 'url',
  'CFP URL': 'cfpUrl',
  'Submission Platform': 'submissionPlatform',
  'Submission URL': 'submissionUrl',
  'Submission Template': 'submissionTemplate',
  'Page Limits': 'pageLimits',
  'Abstract deadline': 'abstractDeadline',
  'Paper deadline': 'paperDeadline',
  'Reviews Released': 'reviewsReleased',
  'Author Rebuttals Due': 'rebuttalsDue',
  'Discussion Period Start': 'discussionStart',
  'Discussion Period Ends': 'discussionEnd',
  'Final Decisions': 'finalDecisions',
  'Camera-Ready Deadline': 'cameraReady',
  'Conference Date Start': 'conferenceStart',
  'Conference Date End': 'conferenceEnd',
  'Conference duration (days)': 'durationDays',
};

// ---- Entry point -----------------------------------------------------------

function doGet() {
  let body;
  try {
    body = cachedPayload_();
  } catch (err) {
    body = JSON.stringify({ error: String(err && err.message || err) });
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

// Run this from the editor after editing the sheet structure to check output.
function debugPrint() {
  Logger.log(buildPayload_());
}

// Optional: Triggers > On edit > clearCache, so edits show up immediately.
function clearCache() {
  CacheService.getScriptCache().remove('payload');
}

// ---- Internals -------------------------------------------------------------

function cachedPayload_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('payload');
  if (hit) return hit;
  const body = buildPayload_();
  // CacheService values are capped at 100KB; just skip caching above that.
  if (body.length < 100000) cache.put('payload', body, CACHE_SECONDS);
  return body;
}

function buildPayload_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) throw new Error('Sheet not found: ' + SHEET_NAME);

  const tz = ss.getSpreadsheetTimeZone();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return JSON.stringify({ updated: new Date().toISOString(), sheetModified: sheetModified_(ss.getId()), conferences: [] });
  }

  const norm = (s) => String(s).trim().toLowerCase();
  const wanted = {};
  Object.keys(COLUMNS).forEach((h) => { wanted[norm(h)] = COLUMNS[h]; });

  // column index -> json key, for allowlisted headers only
  const picks = [];
  values[0].forEach((h, i) => {
    const key = wanted[norm(h)];
    if (key) picks.push([i, key]);
  });
  if (!picks.some(([, k]) => k === 'name')) throw new Error('No "Name" column found');

  const conferences = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const out = {};
    picks.forEach(([i, key]) => {
      const v = cell_(row[i], tz);
      if (v !== '') out[key] = v;
    });
    if (out.name) conferences.push(out);
  }

  return JSON.stringify({
    updated: new Date().toISOString(),
    sheetModified: sheetModified_(ss.getId()),
    conferences: conferences,
  });
}

// Last edit time of the spreadsheet file, via the Drive advanced service
// (metadata-only scope). Optional: if the service isn't enabled or the call
// fails, the feed still works and the page just omits the line.
function sheetModified_(id) {
  try {
    return Drive.Files.get(id, { fields: 'modifiedTime' }).modifiedTime || null;
  } catch (err) {
    console.warn('sheetModified_: ' + err);
    return null;
  }
}

// Dates -> "yyyy-MM-dd", in the sheet's timezone so the calendar day matches
// what you typed (the page reads a bare date as end of day AoE). If a time was
// entered too -> full ISO with the sheet's offset, e.g. "2026-11-14T23:59+05:30".
// Everything else -> trimmed string / number / boolean.
function cell_(v, tz) {
  if (v instanceof Date) {
    const t = Utilities.formatDate(v, tz, 'HH:mm');
    return t === '00:00'
      ? Utilities.formatDate(v, tz, 'yyyy-MM-dd')
      : Utilities.formatDate(v, tz, "yyyy-MM-dd'T'HH:mmXXX");
  }
  if (typeof v === 'string') return v.trim();
  return v;
}
