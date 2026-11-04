/* Conference tracker -- renders the Apps Script JSON feed into #conference-tracker.
   Everything is built with createElement/textContent; sheet text never goes
   through innerHTML, and only http(s) links are rendered. */
(function () {
  'use strict';

  var root = document.getElementById('conference-tracker');
  if (!root) return;
  var endpoint = root.getAttribute('data-src');
  var body = root.querySelector('.ct-body');
  var status = root.querySelector('.ct-status');

  var DAY = 864e5;
  var AOE_OFFSET = 12 * 36e5; // end of day AoE = 23:59:59 UTC-12

  // Milestones in chronological order. `submit` ones decide "open for submissions".
  var MILESTONES = [
    { key: 'abstractDeadline', label: 'Abstract deadline', submit: true },
    { key: 'paperDeadline', label: 'Paper deadline', submit: true },
    { key: 'reviewsReleased', label: 'Reviews released' },
    { key: 'rebuttalsDue', label: 'Rebuttals due' },
    { key: 'discussionStart', label: 'Discussion starts' },
    { key: 'discussionEnd', label: 'Discussion ends' },
    { key: 'finalDecisions', label: 'Final decisions' },
    { key: 'cameraReady', label: 'Camera-ready' },
    { key: 'conferenceStart', label: 'Conference starts' },
    { key: 'conferenceEnd', label: 'Conference ends' }
  ];

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ---- parsing ------------------------------------------------------------

  // "2026-11-14" -> { t: end of that day AoE, dateOnly } ; full ISO -> exact.
  // Anything else ("TBA", "late May") -> null; it is still shown as text.
  function parseWhen(v) {
    if (typeof v !== 'string') return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (m) {
      var y = +m[1], mo = +m[2] - 1, d = +m[3];
      return { t: Date.UTC(y, mo, d, 23, 59, 59) + AOE_OFFSET, y: y, mo: mo, d: d, dateOnly: true };
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(v)) {
      var t = Date.parse(v);
      if (isNaN(t)) return null;
      var dt = new Date(t);
      return { t: t, y: dt.getFullYear(), mo: dt.getMonth(), d: dt.getDate(), dateOnly: false, dt: dt };
    }
    return null;
  }

  function splitList(v) {
    if (v == null || v === '') return [];
    return String(v).split(/\s*[,;\/|]\s*/).filter(Boolean);
  }

  function truthy(v) {
    if (typeof v === 'boolean') return v;
    return /^(y|yes|true|archival|1)$/i.test(String(v || '').trim());
  }

  function safeUrl(v) {
    if (!v) return null;
    try {
      var u = new URL(String(v).trim());
      return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
    } catch (e) { return null; }
  }

  function normalise(c, now) {
    var ms = [];
    MILESTONES.forEach(function (m) {
      var raw = c[m.key];
      if (raw == null || raw === '') return;
      var w = parseWhen(String(raw));
      ms.push({ key: m.key, label: m.label, submit: !!m.submit, raw: String(raw), when: w, past: w ? w.t < now : false });
    });

    var dated = ms.filter(function (m) { return m.when; });
    var next = dated.filter(function (m) { return !m.past; })[0] || null;
    var nextSubmit = dated.filter(function (m) { return m.submit && !m.past; })[0] || null;
    var startM = ms.filter(function (m) { return m.key === 'conferenceStart'; })[0];
    var endM = ms.filter(function (m) { return m.key === 'conferenceEnd'; })[0] || startM;

    var group;
    if (nextSubmit) group = 'open';
    else if (endM && endM.when && endM.past) group = 'past';
    else if (!next && dated.length) group = 'past';
    else group = 'upcoming';

    return {
      raw: c,
      name: String(c.name),
      track: c.track ? String(c.track) : '',
      areas: splitList(c.area),
      type: c.type ? String(c.type) : '',
      archival: c.archival != null && c.archival !== '' ? truthy(c.archival) : null,
      milestones: ms,
      next: next,
      nextSubmit: nextSubmit,
      start: startM && startM.when,
      end: endM && endM.when,
      group: group,
      haystack: [c.name, c.track, c.area, c.location, c.venue, c.type, c.presentationType]
        .filter(Boolean).join(' ').toLowerCase()
    };
  }

  // ---- formatting ---------------------------------------------------------

  function fmtDate(w, withWeekday) {
    if (!w) return '';
    // Built as an array: Hugo's JS minifier rewrites `s = x + s` to `s += x`,
    // which reverses string concatenation.
    var parts = [];
    if (withWeekday) parts.push(WEEKDAYS[new Date(Date.UTC(w.y, w.mo, w.d)).getUTCDay()] + ',');
    parts.push((w.d < 10 ? '0' : '') + w.d, MONTHS[w.mo], w.y);
    var s = parts.join(' ');
    if (!w.dateOnly) {
      s += ', ' + w.dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return s;
  }

  function fmtRange(a, b) {
    if (!a) return '';
    if (!b || (a.y === b.y && a.mo === b.mo && a.d === b.d)) return fmtDate(a);
    if (a.y === b.y && a.mo === b.mo) return a.d + '–' + b.d + ' ' + MONTHS[a.mo] + ' ' + a.y;
    if (a.y === b.y) return a.d + ' ' + MONTHS[a.mo] + ' – ' + b.d + ' ' + MONTHS[b.mo] + ' ' + a.y;
    return fmtDate(a) + ' – ' + fmtDate(b);
  }

  // Short countdown for the left gutter.
  function countdown(t, now) {
    var ms = t - now;
    if (ms <= 0) return 'now';
    var h = ms / 36e5;
    if (h < 48) return Math.ceil(h) + 'h';
    return Math.floor(ms / DAY) + 'd';
  }

  // ---- DOM helpers --------------------------------------------------------

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function link(href, text) {
    var a = el('a', null, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  function joinInto(parent, parts, sep) {
    parts.filter(Boolean).forEach(function (p, i) {
      if (i) parent.appendChild(el('span', 'ct-sep', sep || ' · '));
      parent.appendChild(typeof p === 'string' ? document.createTextNode(p) : p);
    });
    return parent;
  }

  // ---- rendering ----------------------------------------------------------

  function renderItem(c, now) {
    var li = el('li', 'ct-item');
    var focus = c.group === 'open' ? c.nextSubmit : c.next;

    // left gutter: countdown to the milestone that matters, or the year for past ones
    var gutter = el('div', 'ct-when');
    if (c.group === 'past') {
      gutter.textContent = c.end ? String(c.end.y) : '';
      gutter.classList.add('is-past');
    } else if (focus) {
      gutter.textContent = countdown(focus.when.t, now);
      var daysLeft = (focus.when.t - now) / DAY;
      if (daysLeft <= 7) gutter.classList.add('is-soon');
      gutter.title = focus.label + ' in ' + Math.max(0, Math.ceil(daysLeft)) + ' day(s)';
    } else {
      gutter.textContent = '—';
    }
    li.appendChild(gutter);

    var main = el('div', 'ct-main');
    var head = el('div', 'ct-head');
    var url = safeUrl(c.raw.url);
    head.appendChild(url ? link(url, c.name) : el('strong', null, c.name));
    if (c.track) head.appendChild(el('span', 'ct-track', c.track));
    main.appendChild(head);

    // the "what's next" line
    if (focus && c.group !== 'past') {
      var nl = el('div', 'ct-next');
      nl.appendChild(el('span', 'ct-next-label', focus.label));
      nl.appendChild(el('span', 'ct-sep', ' · '));
      nl.appendChild(document.createTextNode(fmtDate(focus.when, true)));
      if (focus.when.dateOnly) nl.appendChild(el('span', 'ct-aoe', ' AoE'));
      main.appendChild(nl);
    }

    var where = [c.raw.location || c.raw.venue, fmtRange(c.start, c.end)].filter(Boolean);
    var tags = c.areas.slice();
    if (c.type) tags.unshift(c.type);
    if (c.archival === true) tags.push('archival');
    if (c.archival === false) tags.push('non-archival');
    if (where.length || tags.length) {
      main.appendChild(joinInto(el('div', 'ct-meta'), where.concat(tags.length ? [tags.join(', ')] : [])));
    }

    main.appendChild(renderDetails(c));
    li.appendChild(main);
    return li;
  }

  function renderDetails(c) {
    var d = el('details', 'ct-more');
    d.appendChild(el('summary', null, 'details'));
    var box = el('div', 'ct-more-body');

    if (c.milestones.length) {
      var ol = el('ol', 'ct-timeline');
      c.milestones.forEach(function (m) {
        var li = el('li');
        if (m.past) li.classList.add('is-past');
        if (c.next && m.key === c.next.key) li.classList.add('is-next');
        li.appendChild(el('span', 'ct-tl-label', m.label));
        li.appendChild(el('span', 'ct-tl-date', m.when ? fmtDate(m.when) : m.raw));
        ol.appendChild(li);
      });
      box.appendChild(ol);
    }

    var facts = [
      ['Venue', c.raw.venue && c.raw.venue !== c.raw.location ? c.raw.venue : ''],
      ['Presentation', c.raw.presentationType],
      ['Page limit', c.raw.pageLimits],
      ['Duration', c.raw.durationDays ? c.raw.durationDays + ' days' : ''],
      ['Platform', c.raw.submissionPlatform]
    ].filter(function (f) { return f[1] != null && f[1] !== ''; });
    if (facts.length) {
      var dl = el('dl', 'ct-facts');
      facts.forEach(function (f) {
        dl.appendChild(el('dt', null, f[0]));
        dl.appendChild(el('dd', null, String(f[1])));
      });
      box.appendChild(dl);
    }

    var links = [
      [c.raw.url, 'website'],
      [c.raw.cfpUrl, 'call for papers'],
      [c.raw.submissionUrl, 'submit'],
      [c.raw.submissionTemplate, 'template']
    ].map(function (l) {
      var u = safeUrl(l[0]);
      return u ? link(u, l[1]) : null;
    }).filter(Boolean);
    // Template is sometimes a name ("ACL style") rather than a link.
    if (c.raw.submissionTemplate && !safeUrl(c.raw.submissionTemplate)) {
      links.push('template: ' + c.raw.submissionTemplate);
    }
    if (links.length) box.appendChild(joinInto(el('p', 'ct-links'), links));

    d.appendChild(box);
    return d;
  }

  function renderGroup(title, items, now, collapsed) {
    var frag = document.createDocumentFragment();
    if (!items.length) return frag;
    var ul = el('ul', 'ct-list');
    items.forEach(function (c) { ul.appendChild(renderItem(c, now)); });

    if (collapsed) {
      var d = el('details', 'ds ct-past');
      d.appendChild(el('summary', null, title + ' (' + items.length + ')'));
      d.appendChild(ul);
      frag.appendChild(d);
    } else {
      var h = el('h2', 'ct-group', title);
      h.appendChild(el('span', 'ct-count', ' ' + items.length));
      frag.appendChild(h);
      frag.appendChild(ul);
    }
    return frag;
  }

  // ---- filters ------------------------------------------------------------

  var state = { q: '', area: '', type: '', archivalOnly: false };

  function buildFilters(all) {
    var bar = root.querySelector('.ct-filters');
    bar.hidden = false;

    var areas = {}, types = {};
    all.forEach(function (c) {
      c.areas.forEach(function (a) { areas[a] = 1; });
      if (c.type) types[c.type] = 1;
    });

    function fill(select, values) {
      Object.keys(values).sort(function (a, b) { return a.localeCompare(b); }).forEach(function (v) {
        var o = el('option', null, v);
        o.value = v;
        select.appendChild(o);
      });
    }
    var areaSel = bar.querySelector('[name=area]');
    var typeSel = bar.querySelector('[name=type]');
    fill(areaSel, areas);
    fill(typeSel, types);
    if (!Object.keys(areas).length) areaSel.closest('label').hidden = true;
    if (!Object.keys(types).length) typeSel.closest('label').hidden = true;
    if (!all.some(function (c) { return c.archival !== null; })) {
      bar.querySelector('[name=archival]').closest('label').hidden = true;
    }

    bar.addEventListener('input', function () {
      state.q = bar.querySelector('[name=q]').value.trim().toLowerCase();
      state.area = areaSel.value;
      state.type = typeSel.value;
      state.archivalOnly = bar.querySelector('[name=archival]').checked;
      draw();
    });
  }

  function matches(c) {
    if (state.q && c.haystack.indexOf(state.q) === -1) return false;
    if (state.area && c.areas.indexOf(state.area) === -1) return false;
    if (state.type && c.type !== state.type) return false;
    if (state.archivalOnly && c.archival !== true) return false;
    return true;
  }

  // ---- main ---------------------------------------------------------------

  var all = [];
  var updated = null;
  var sheetModified = null;

  function draw() {
    var now = Date.now();
    var shown = all.filter(matches);
    var by = function (g) { return shown.filter(function (c) { return c.group === g; }); };
    var t = function (m) { return m ? m.when.t : Infinity; };

    var open = by('open').sort(function (a, b) { return t(a.nextSubmit) - t(b.nextSubmit); });
    var upcoming = by('upcoming').sort(function (a, b) { return t(a.next) - t(b.next); });
    var past = by('past').sort(function (a, b) { return (b.end ? b.end.t : 0) - (a.end ? a.end.t : 0); });

    body.textContent = '';
    if (!shown.length) {
      body.appendChild(el('p', 'ct-empty', all.length ? 'Nothing matches those filters.' : 'No conferences listed yet.'));
    } else {
      body.appendChild(renderGroup('Open for submissions', open, now));
      body.appendChild(renderGroup('Under review & upcoming', upcoming, now));
      body.appendChild(renderGroup('Past', past, now, true));
    }

    status.textContent = '';
    status.appendChild(document.createTextNode('Dates without a time are end of day AoE (UTC−12).'));
    var stamps = [];
    if (sheetModified) stamps.push('Sheet last edited ' + fmtStamp(sheetModified));
    if (updated) stamps.push('last fetched ' + fmtStamp(updated));
    if (stamps.length) {
      var s = stamps.join(' · ');
      status.appendChild(el('br'));
      status.appendChild(document.createTextNode(s.charAt(0).toUpperCase() + s.slice(1) + '.'));
    }
  }

  function fmtStamp(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  if (!endpoint) {
    status.textContent = 'The tracker is not connected to its data source yet.';
    return;
  }

  status.textContent = 'Loading conferences…';
  fetch(endpoint, { credentials: 'omit' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      if (!data || data.error) throw new Error(data && data.error || 'empty response');
      var now = Date.now();
      all = (data.conferences || []).filter(function (c) { return c && c.name; })
        .map(function (c) { return normalise(c, now); });
      updated = data.updated;
      sheetModified = data.sheetModified;
      buildFilters(all);
      draw();
    })
    .catch(function (err) {
      if (window.console) console.warn('conference-tracker:', err);
      status.textContent = 'Couldn’t load the tracker right now. Try again in a bit.';
    });
})();
