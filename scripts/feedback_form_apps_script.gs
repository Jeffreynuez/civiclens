/**
 * CivicView feedback — instant acknowledgement
 *
 * Fires whenever someone submits the "CivicView feedback" Google Form.
 * If they included a valid email, sends a templated thank-you within
 * seconds so they don't feel ghosted while waiting for the weekly
 * personal reply Jeffrey reviews on Mondays.
 *
 * Install: paste this entire file into the Sheet-bound Apps Script
 * editor (Sheet → Extensions → Apps Script), save, then set up an
 * "On form submit" trigger (Triggers tab in the left rail → + Add
 * Trigger → Function: onFormSubmit, Event source: From spreadsheet,
 * Event type: On form submit). Approve the Gmail / Spreadsheet
 * scopes when prompted on first run.
 */

function onFormSubmit(e) {
  // The event object Apps Script hands us. `namedValues` is an object
  // keyed by question text → array of answers (always length 1 for a
  // form submission). We look up fields by keyword rather than exact
  // header text so column-name tweaks in the form don't break us.
  if (!e || !e.namedValues) return;
  var vals = e.namedValues;

  var email   = pickField_(vals, 'email');
  var body    = pickField_(vals, 'going on', 'tell', 'message', 'comment');
  var selfTag = pickField_(vals, 'type');

  // Bail if no email or invalid format — instant ack is opt-in via
  // the "Your email (optional)" field.
  if (!email || !isLikelyEmail_(email)) return;

  var subject = 'Thanks for your CivicView feedback';

  var trimmedBody = body.length > 200 ? body.slice(0, 200) + '…' : body;

  // Plain text body. Kept short and human — readers spend ~3 seconds
  // on an auto-ack, so we want them to come away with: (1) we got it,
  // (2) a real person will follow up, (3) what happens next.
  var lines = [
    'Hi there,',
    '',
    'Thanks for taking the time to send us feedback on CivicView. We received your submission and our team will review it personally this week.',
    ''
  ];
  if (selfTag)     lines.push('You flagged this as: ' + selfTag + '.');
  if (trimmedBody) lines.push('Your message: "' + trimmedBody + '"');
  if (selfTag || trimmedBody) lines.push('');
  lines.push('If it\'s a bug, we\'ll dig into it. If it\'s a feature request, we\'ll add it to our roadmap and let you know if it ships. If it\'s praise — thank you, it means a lot at this stage.');
  lines.push('');
  lines.push('We\'ll be in touch soon.');
  lines.push('');
  lines.push('— Jeffrey');
  lines.push('Founder, CivicView');
  lines.push('civicview.app');

  GmailApp.sendEmail(email, subject, lines.join('\n'), {
    name: 'CivicView',
    replyTo: 'civicview@civicview.app'
  });
}

/**
 * Find the first value in a namedValues object whose key matches all
 * given keyword fragments (case-insensitive). Returns '' if nothing
 * matches. Tolerant to header drift like "Your email (optional)" or
 * trailing whitespace in column names.
 */
function pickField_(namedValues, /* ...keywords */) {
  var keywords = Array.prototype.slice.call(arguments, 1).map(function (k) { return k.toLowerCase(); });
  var keys = Object.keys(namedValues);
  for (var i = 0; i < keys.length; i++) {
    var lc = keys[i].toLowerCase();
    var match = keywords.every(function (kw) { return lc.indexOf(kw) !== -1; });
    if (match) {
      var arr = namedValues[keys[i]];
      var v = (arr && arr[0]) ? String(arr[0]).trim() : '';
      if (v) return v;
    }
  }
  // Fall back to OR-of-keywords if nothing matched the AND condition.
  for (var j = 0; j < keys.length; j++) {
    var lc2 = keys[j].toLowerCase();
    var any = keywords.some(function (kw) { return lc2.indexOf(kw) !== -1; });
    if (any) {
      var arr2 = namedValues[keys[j]];
      var v2 = (arr2 && arr2[0]) ? String(arr2[0]).trim() : '';
      if (v2) return v2;
    }
  }
  return '';
}

/**
 * Pragmatic email format check. Not a perfect RFC parser — just
 * rejects obvious typos before we hand the address to GmailApp.
 */
function isLikelyEmail_(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
