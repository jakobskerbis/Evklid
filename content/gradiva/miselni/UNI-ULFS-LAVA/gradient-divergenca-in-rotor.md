---
avtor: AI
stanje: osnutek
---

- Polja in nabla
  - skalarno $f$, vektorsko $\vec F = (P, Q, R)$
  - $\nabla = (\partial_x, \partial_y, \partial_z)$
- Gradient
  - $\nabla f = (f_x, f_y, f_z)$
  - kaže najhitrejšo rast, velikost $|\nabla f|$
  - pravokoten na nivojske ploskve
- Smerni odvod
  - $D_{\vec e}f = \nabla f \cdot \vec e$
  - napaka: smer ni enotska
- Divergenca
  - $\operatorname{div}\vec F = P_x + Q_y + R_z$
  - izvir ali ponor, rezultat je skalar
  - $\operatorname{div}\vec u$ je sprememba prostornine
- Rotor
  - $(R_y - Q_z,\; P_z - R_x,\; Q_x - P_y)$
  - togo vrtenje: $\operatorname{rot}\vec v = 2\vec\omega$
- Identitete
  - $\operatorname{rot}\nabla f = \vec 0$, $\operatorname{div}\operatorname{rot}\vec F = 0$
  - pogoj $C^2$, Schwarzov izrek
- Potencial
  - $\vec F = \nabla\varphi$, na $\mathbb R^3$ natanko pri rotorju nič
  - integriraj po $x$, nato $y$, $z$
