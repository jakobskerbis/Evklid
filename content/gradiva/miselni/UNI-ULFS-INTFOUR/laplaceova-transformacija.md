---
avtor: AI
stanje: osnutek
---

- Definicija
  - $F(s) = \int_0^\infty e^{-st} f(t)\,dt$
  - obstaja za $s > a$ pri eksponentnem redu $a$
  - $e^{t^2}$ nima slike
- Osnovne slike
  - $e^{at} \mapsto \frac{1}{s-a}$, $t^n \mapsto \frac{n!}{s^{n+1}}$
  - $\cos\omega t \mapsto \frac{s}{s^2+\omega^2}$, $\sin\omega t \mapsto \frac{\omega}{s^2+\omega^2}$
- Premika
  - $e^{at}f \mapsto F(s-a)$
  - $u(t-T)f(t-T) \mapsto e^{-Ts}F(s)$
- Slika odvoda
  - $f' \mapsto sF - f(0)$
  - $f'' \mapsto s^2F - sf(0) - f'(0)$
  - napaka: pozabljen člen $sf(0)$
- Inverz
  - Lerchov izrek: original je enoličen
  - parcialni ulomki, dopolnitev do kvadrata
  - $\frac{1}{s+2} \mapsto e^{-2t}$, ne $e^{2t}$
- Začetni problem
  - transformiraj, izrazi $Y$, razcepi
  - preberi original, preveri pogoje
- Poli in obnašanje
  - realni pol: eksponentni člen
  - kompleksni par: dušeno nihanje
  - večkratni pol: faktor $t^{k-1}$
