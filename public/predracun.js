// Gumb »Natisni ali shrani kot PDF« na predračunu (server/sole.js, predracunHtml). CSP ne dovoli vrinjenih
// skript in atributov onclick, zato je ukaz v tej datoteki (točka 1.5).
document.getElementById("natisni")?.addEventListener("click", () => window.print());
