Meritev 2026-11-14T11:03:03.682Z, Node v22.23.4, Intel(R) Xeon(R) Processor @ 2.10GHz (4 jeder), strežnik pripet na 1 jedro (taskset -c 0).

### D6 Obremenitev (512 MB, 0,5 CPU)

cgroup v1: memory.limit_in_bytes 512 MB (memsw enako, swappiness 0), cpu.cfs_quota_us 50000 / cfs_period_us 100000, strežnik še pripet na jedro 0.

Trajanje stopnje 120 s, zaprta zanka brez premora, EVKLID_MOCK_DELAY_MS=15. /healthz po 4696 ms; po predgretju tiska (28.7 s) RSS 244.9 MB, cgroup 194.9 MB.

| Hkrati | zahtev (ok / ne) | 429 | 5xx / izjeme / napaka SSE | sporočilo p50/p95/p99 ms | prvi bajt SSE p50/p95 | s fotografijo p95 | scan/read p95 | zanka p99/max ms | največ cgroup / anon / RSS MB | failcnt | OOM | dušenje CPU s | preživel | mirovanje RSS / kopica MB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | 730 (730 / 0) | 0 | 0 / 0 / 0 | 4010.2/4877.4/5409.4 | 1306.5/1950.4 | 4957.2 | 428.8 | 430.66/795.31 | 289.6 / 241.9 / 298.2 | 0 | 0 | 48.9 | da | 273.3 / 140 |
| 40 | 694 (694 / 0) | 0 | 0 / 0 / 0 | 8301.8/9337.6/10249.6 | 4118.1/6714.2 | 12164.1 | 4691.2 | 1584.88/4022.82 | 368.5 / 266 / 322.2 | 0 | 0 | 52.3 | da | 306.7 / 170.4 |
| 60 | 681 (681 / 0) | 0 | 0 / 0 / 0 | 12781.4/15663.3/20933.4 | 2010.8/5945.7 | 18972.6 | 1879.1 | 906.98/1433.89 | 441.5 / 280.5 / 336.8 | 0 | 0 | 55.6 | da | 322.5 / 186.8 |
| 80 | 693 (693 / 0) | 0 | 0 / 0 / 0 | 16681.1/20056.1/33028.5 | 2971.2/6467.2 | 29906.8 | 8237.3 | 1062.69/1121.41 | 504.6 / 288.6 / 344.8 | 0 | 0 | 56.2 | da | 313.9 / 174.1 |

Po vrstah (ms; »ok« = 200/201 brez napake v toku SSE):

| Hkrati | Vrsta | n | ok | na s | p50 | p95 | p99 | max | prvi bajt p50/p95 | prvi delta p95 | statusi |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | sporočilo inštruktorju (SSE do konca) | 502 | 502 | 4.1 | 4010.2 | 4877.4 | 5409.4 | 6609.1 | 1306.5/1950.4 | 1950.4 | 200×502 |
| 20 | sporočilo s fotografijo 342 KB (SSE do konca) | 88 | 88 | 0.7 | 3907.1 | 4957.2 | 6880.8 | 6880.8 | 1334.9/2153.9 | 2153.9 | 200×88 |
| 20 | fotografija 342 KB v skeniranje (scan/read) | 80 | 80 | 0.7 | 211.9 | 428.8 | 597.8 | 597.8 | – | – | 200×80 |
| 20 | nov pogovor | 60 | 60 | 0.5 | 178.1 | 409.6 | 495.7 | 495.7 | – | – | 201×60 |
| 40 | sporočilo inštruktorju (SSE do konca) | 495 | 495 | 4.1 | 8301.8 | 9337.6 | 10249.6 | 11363.2 | 4118.1/6714.2 | 6714.2 | 200×495 |
| 40 | sporočilo s fotografijo 342 KB (SSE do konca) | 80 | 80 | 0.7 | 8403.1 | 12164.1 | 12985 | 12985 | 4832.7/6863.3 | 6863.3 | 200×80 |
| 40 | fotografija 342 KB v skeniranje (scan/read) | 79 | 79 | 0.6 | 893 | 4691.2 | 5673 | 5673 | – | – | 200×79 |
| 40 | nov pogovor | 40 | 40 | 0.3 | 384.1 | 1527.7 | 1774.2 | 1774.2 | – | – | 201×40 |
| 60 | sporočilo inštruktorju (SSE do konca) | 481 | 481 | 3.9 | 12781.4 | 15663.3 | 20933.4 | 21531.9 | 2010.8/5945.7 | 5945.7 | 200×481 |
| 60 | sporočilo s fotografijo 342 KB (SSE do konca) | 90 | 90 | 0.7 | 12319.3 | 18972.6 | 21951.3 | 21951.3 | 2018.5/8746.6 | 8746.6 | 200×90 |
| 60 | fotografija 342 KB v skeniranje (scan/read) | 68 | 68 | 0.6 | 446.4 | 1879.1 | 3292.7 | 3292.7 | – | – | 200×68 |
| 60 | nov pogovor | 42 | 42 | 0.3 | 231.1 | 1095.7 | 1315.8 | 1315.8 | – | – | 201×42 |
| 80 | sporočilo inštruktorju (SSE do konca) | 485 | 485 | 3.9 | 16681.1 | 20056.1 | 33028.5 | 35487.7 | 2971.2/6467.2 | 6467.2 | 200×485 |
| 80 | sporočilo s fotografijo 342 KB (SSE do konca) | 84 | 84 | 0.7 | 17098.7 | 29906.8 | 36299.8 | 36299.8 | 3206.2/16247.9 | 16247.9 | 200×84 |
| 80 | fotografija 342 KB v skeniranje (scan/read) | 66 | 66 | 0.5 | 614.7 | 8237.3 | 10209.7 | 10209.7 | – | – | 200×66 |
| 80 | nov pogovor | 58 | 58 | 0.5 | 462.6 | 9636 | 10054.2 | 10054.2 | – | – | 201×58 |