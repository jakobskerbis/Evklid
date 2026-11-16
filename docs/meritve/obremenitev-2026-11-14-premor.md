Meritev 2026-11-14T11:27:42.343Z, Node v22.23.4, Intel(R) Xeon(R) Processor @ 2.10GHz (4 jeder), strežnik pripet na 1 jedro (taskset -c 0).

### D6 Obremenitev (512 MB, 0,5 CPU)

cgroup v1: memory.limit_in_bytes 512 MB (memsw enako, swappiness 0), cpu.cfs_quota_us 50000 / cfs_period_us 100000, strežnik še pripet na jedro 0.

Trajanje stopnje 120 s, zaprta zanka s premorom ~20000 ms, EVKLID_MOCK_DELAY_MS=15. /healthz po 4657 ms; po predgretju tiska (29.7 s) RSS 248.1 MB, cgroup 197.9 MB.

| Hkrati | zahtev (ok / ne) | 429 | 5xx / izjeme / napaka SSE | sporočilo p50/p95/p99 ms | prvi bajt SSE p50/p95 | s fotografijo p95 | scan/read p95 | zanka p99/max ms | največ cgroup / anon / RSS MB | failcnt | OOM | dušenje CPU s | preživel | mirovanje RSS / kopica MB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 40 | 205 (205 / 0) | 0 | 0 / 0 / 0 | 1009.3/1577.7/1696.8 | 253.3/880.8 | 1550.2 | 252.9 | 91.38/415.46 | 263.8 / 232.1 / 288.5 | 0 | 0 | 8.6 | da | 237.6 / 115.6 |
| 80 | 438 (438 / 0) | 0 | 0 / 0 / 0 | 1724.8/4628.6/5043.7 | 489.9/1975.3 | 4942.5 | 463 | 177.96/717.71 | 299.2 / 236 / 292.3 | 0 | 0 | 26.2 | da | 238.5 / 115.9 |
| 120 | 603 (603 / 0) | 0 | 0 / 0 / 0 | 5198.9/10275.6/11573 | 1534.7/3305.6 | 10704 | 1707.3 | 382.17/1079.47 | 363.1 / 253.7 / 310 | 0 | 0 | 45.9 | da | 239.4 / 116 |
| 160 | 632 (632 / 0) | 0 | 0 / 0 / 0 | 11068.1/21354.6/23893.4 | 2531.5/7473.4 | 22687.1 | 8806 | 487.29/1192.72 | 450.5 / 286.5 / 342.8 | 0 | 0 | 52.3 | da | 288.9 / 142.1 |

Po vrstah (ms; »ok« = 200/201 brez napake v toku SSE):

| Hkrati | Vrsta | n | ok | na s | p50 | p95 | p99 | max | prvi bajt p50/p95 | prvi delta p95 | statusi |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 40 | sporočilo inštruktorju (SSE do konca) | 153 | 153 | 1 | 1009.3 | 1577.7 | 1696.8 | 1750.9 | 253.3/880.8 | 880.8 | 200×153 |
| 40 | sporočilo s fotografijo 342 KB (SSE do konca) | 40 | 40 | 0.3 | 1020.4 | 1550.2 | 1814.6 | 1814.6 | 230.8/628.1 | 628.1 | 200×40 |
| 40 | fotografija 342 KB v skeniranje (scan/read) | 12 | 12 | 0.1 | 55.5 | 252.9 | 252.9 | 252.9 | – | – | 200×12 |
| 80 | sporočilo inštruktorju (SSE do konca) | 311 | 311 | 2 | 1724.8 | 4628.6 | 5043.7 | 5493.2 | 489.9/1975.3 | 1975.3 | 200×311 |
| 80 | sporočilo s fotografijo 342 KB (SSE do konca) | 63 | 63 | 0.4 | 1689.6 | 4942.5 | 5626 | 5626 | 587.1/1825 | 1825 | 200×63 |
| 80 | fotografija 342 KB v skeniranje (scan/read) | 45 | 45 | 0.3 | 149.9 | 463 | 698.6 | 698.6 | – | – | 200×45 |
| 80 | nov pogovor | 19 | 19 | 0.1 | 8 | 753.1 | 753.1 | 753.1 | – | – | 201×19 |
| 120 | sporočilo inštruktorju (SSE do konca) | 425 | 425 | 2.7 | 5198.9 | 10275.6 | 11573 | 12095.9 | 1534.7/3305.6 | 3305.6 | 200×425 |
| 120 | sporočilo s fotografijo 342 KB (SSE do konca) | 80 | 80 | 0.5 | 4692.1 | 10704 | 11944.7 | 11944.7 | 1310.1/2990.6 | 2990.6 | 200×80 |
| 120 | fotografija 342 KB v skeniranje (scan/read) | 62 | 62 | 0.4 | 384.8 | 1707.3 | 2075 | 2075 | – | – | 200×62 |
| 120 | nov pogovor | 36 | 36 | 0.2 | 152.1 | 1294 | 1460.8 | 1460.8 | – | – | 201×36 |
| 160 | sporočilo inštruktorju (SSE do konca) | 452 | 452 | 2.8 | 11068.1 | 21354.6 | 23893.4 | 24812.5 | 2531.5/7473.4 | 7473.4 | 200×452 |
| 160 | sporočilo s fotografijo 342 KB (SSE do konca) | 86 | 86 | 0.5 | 11441.3 | 22687.1 | 24154 | 24154 | 3005.5/7801.7 | 7801.7 | 200×86 |
| 160 | fotografija 342 KB v skeniranje (scan/read) | 56 | 56 | 0.3 | 839.4 | 8806 | 10736.4 | 10736.4 | – | – | 200×56 |
| 160 | nov pogovor | 38 | 38 | 0.2 | 458.7 | 5999.6 | 6725.2 | 6725.2 | – | – | 201×38 |