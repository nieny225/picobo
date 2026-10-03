// Home page copy. One slogan line per element; keep it an image, not an explanation.
export const HOME = {
  slogan: ['Pick a day,', 'pick a place,', 'picobo.'],
  entriesLabel: 'Start here',
  intro: 'Picobo is your courtside pickleball buddy.',
  courtAlt: 'A player serving, with the service court across the net lit up',
  // The top-bar "Install" button and the steps it opens.
  install: {
    title: 'Add Picobo to your home screen',
    ios: 'Tap the browser\'s Share button, then "Add to Home Screen". It opens like an app and works without signal.',
    mac: 'In Safari\'s menu bar, choose File, then "Add to Dock". It opens like an app.',
    android: 'Tap the "⋮" menu at the top right, then "Install app" or "Add to Home screen". It opens like an app. Already installed? Just open Picobo from your home screen.',
    inApp: 'Pages opened inside LINE, Facebook or Instagram can\'t be installed. Tap the menu at the top right, choose "Open in browser", then install from Chrome or Safari.',
    // Top-bar install button; when the browser gives no install prompt (iPhone, iPad, Mac Safari,
    // Android right after an uninstall, in-app browsers like LINE), it shows the steps above.
    short: 'Install',
    aria: 'Install Picobo as an app',
    close: 'Got it',
    // Once installed (or when this browser can't install), the same spot becomes an invite/share icon.
    invite: { aria: 'Invite friends to Picobo', title: 'Picobo', text: 'Picobo: pickleball rules in pictures, a scoreboard and a draw tool for your games.' },
  },
  entries: [
    { route: 'rules', title: 'Learn the rules', en: '', desc: 'Step-by-step rules in pictures' },
    { route: 'score', title: 'Scoreboard', en: '', desc: 'Who serves, where to stand, what\'s the score' },
    { route: 'draw', title: 'Draw', en: '', desc: 'Random draw, round robin, king of the court. Lots of players, no chaos.' },
    { route: 'meetup', title: 'Find players', en: '', desc: 'Time, place, players needed. One card for the group chat.' },
    { route: 'venues', title: 'Courts', en: '', desc: 'Where to play, how to book, how to get there. Rally a group fast.' },
    // Partnership form (Google Form, no owner email shown).
    { href: 'https://forms.gle/X8Rsieeez7oDLZMFA', title: 'Partner with us', en: '', desc: 'Venues, coaches, brands, events' },
  ],
};
