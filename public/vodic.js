// Vodič po aplikaciji: kratek opis vsakega dela (Nastavitve → Pomoč na spletu, Jaz → Vodič v aplikaciji).
// Besedila so ista kot v uvodnem ogledu (tour.*), zato so že prevedena v vse jezike.
// view = pogled na spletu (showView), app = pot v aplikaciji (expo-router); brez app se v aplikaciji ne pokaže.
// Ikone so iste kot na zavihkih (index.html).
export const GUIDE = [
  { id: "how", title: "tour.how", text: "tour.howText", icon: "lightbulb", app: true },
  { id: "daily", title: "daily.title", text: "tour.dailyText", icon: "flame", view: "path", app: "/" },
  { id: "path", title: "nav.path", text: "tour.pathText", icon: "map", view: "path", app: "/" },
  { id: "modes", title: "tour.modes", text: "tour.modesText", icon: "layers", view: "path" },
  { id: "uci", title: "nav.learn", text: "tour.learnText", icon: "graduation-cap", view: "uci", app: "/textbook" },
  { id: "chat", title: "nav.chat", text: "tour.chatText", icon: "message-circle", view: "chat", app: "/tutor" },
  { id: "graph", title: "nav.graph", text: "tour.graphText", icon: "calculator", view: "graph", app: "/calculator" },
  { id: "competition", title: "nav.competition", text: "tour.competitionText", icon: "medal", view: "competition" },
  { id: "games", title: "nav.games", text: "tour.gamesText", icon: "gamepad-2", view: "games" },
  { id: "schedule", title: "sch.title", text: "tour.scheduleText", icon: "calendar-days", view: "schedule" },
  { id: "corner", title: "nav.corner", text: "tour.cornerText", icon: "newspaper", view: "corner" },
  { id: "progress", title: "nav.progress", text: "tour.progressText", icon: "chart-column", view: "progress" },
  { id: "league", title: "nav.league", text: "tour.leagueText", icon: "trophy", view: "league" },
  { id: "settings", title: "nav.settings", text: "tour.settingsText", icon: "settings", view: "settings", app: "/me" },
  { id: "feedback", title: "nav.feedback", text: "tour.feedbackText", icon: "message-square-heart", view: "feedback" },
];

// Deli, ki obstajajo v aplikaciji za telefon (true = samo besedilo, brez povezave).
export const APP_GUIDE = GUIDE.filter((g) => g.app);
