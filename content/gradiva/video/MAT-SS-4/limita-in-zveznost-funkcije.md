---
naslov: Leva in desna limita
simulacija: graf
moznosti: {"preset": "limita"}
trajanje: 1:36
avtor: AI
stanje: pregledano
---

## 0:00

Funkcija $f(x) = \dfrac{x^2 - 1}{x - 1}$ pri $x = 1$ ni definirana, zato ima graf tam luknjo. Oranžna točka kaže $f(1 - h)$ levo od $1$, turkizna $f(1 + h)$ desno: pri $h = 0{,}5$ sta to $1{,}5$ in $2{,}5$.

- nastavi: funkcija = luknja
- nastavi: razdalja h = 0,5

## 0:14

Zmanjšajmo $h$ na $0{,}1$. Z leve dobimo $1{,}9$, z desne $2{,}1$. Opazuj, kako se točki z obeh strani bližata luknji.

- nastavi: razdalja h = 0,1

## 0:26

Pri $h = 0{,}001$ sta vrednosti $1{,}999$ in $2{,}001$. Leva in desna limita sta $2$, zato je $\lim\limits_{x \to 1} f(x) = 2$, čeprav $f(1)$ ne obstaja.

- nastavi: razdalja h = 0,001

## 0:40

Zdaj funkcija s skokom pri $x = 1$. Z leve se vrednosti bližajo $1$, z desne $2$. Leva in desna limita sta različni, zato limita pri $x = 1$ ne obstaja in funkcija tam ni zvezna.

- nastavi: funkcija = skok

## 0:54

Pri $f(x) = \dfrac{1}{(x - 1)^2}$ vrednosti na obeh straneh rastejo čez vse meje: pri $h = 0{,}001$ so že $1\,000\,000$. Funkcija ima pri $x = 1$ pol in končne limite tam ni.

- nastavi: funkcija = pol

## 1:08

Še $f(x) = \dfrac{\sin x}{x}$, ki pri $x = 0$ ni definirana. Pri $h = 0{,}1$ dobimo z obeh strani $0{,}9983$, pri manjših $h$ tabela pod grafom zaokroženo kaže že $1$. Zato je $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$.

- nastavi: funkcija = sinx

## 1:22

Pravilo: $\lim\limits_{x \to a} f(x)$ obstaja, ko sta leva in desna limita enaki; vrednost $f(a)$ pri tem ne šteje. Funkcija je zvezna v $a$, če $f(a)$ obstaja in je enaka limiti.
