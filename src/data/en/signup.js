// Sign-up message (the numbered list you paste into the group after booking a court). The message itself is simple English.
export const SIGNUP = {
  title: 'Sign-up message',
  intro: 'Booked a court? Fill in the time and who\'s in, then copy it to IG, WhatsApp or LINE. Everyone adds their name in order.',
  session: 'Session {n}',
  addSession: 'Add a session',
  removeSession: 'Remove this session',
  fields: {
    place: 'Venue',
    placeHint: 'Court name',
    date: 'Date',
    start: 'Start',
    end: 'End',
    names: 'Already in (one entry per line)',
    namesHint: 'E.g. Amy & Ben',
    cap: 'Max players (optional)',
    blanks: 'Empty slots to leave',
  },
  preview: 'Preview',
  copy: 'Copy message',
  copied: 'Copied. Paste it in the group.',
  copyFailed: 'Couldn\'t copy automatically. Long-press the preview text to copy it.',
  shareTitle: 'Pickleball',
  errors: {
    place: 'Enter a venue.',
    date: 'Pick a date.',
    start: 'Enter a start time.',
    end: 'That end time doesn\'t look right.',
    cap: 'Max players: 1 to 40.',
  },
  // Fixed text inside the message (English).
  labels: {
    heading: '🏓 Pickleball',
    cap: 'Max {n} players',
    footer: 'via picobo.net',
  },
  // Entry point on venue cards and the courts page.
  fromVenue: 'Sign-up message',
};
