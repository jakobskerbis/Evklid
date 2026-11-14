Meritev 2026-11-14T10:53:06.519Z, Node v22.23.4, Intel(R) Xeon(R) Processor @ 2.10GHz (4 jeder), strežnik pripet na 1 jedro (taskset -c 0).

### D6 Obremenitev (512 MB, 0,5 CPU)

cgroup v1: memory.limit_in_bytes 512 MB (memsw enako, swappiness 0), cpu.cfs_quota_us 50000 / cfs_period_us 100000, strežnik še pripet na jedro 0.

Trajanje stopnje 120 s, zaprta zanka brez premora, EVKLID_MOCK_DELAY_MS=15. /healthz po 4800 ms; po predgretju tiska (28.8 s) RSS 244.3 MB, cgroup 194.3 MB.

| Hkrati | zahtev (ok / ne) | 429 | 5xx / izjeme / napaka SSE | sporočilo p50/p95/p99 ms | prvi bajt SSE p50/p95 | s fotografijo p95 | scan/read p95 | zanka p99/max ms | največ cgroup / anon / RSS MB | failcnt | OOM | dušenje CPU s | preživel | mirovanje RSS / kopica MB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | 727 (727 / 0) | 0 | 0 / 0 / 0 | 4007.3/4694.5/6562.8 | 1271.1/1985.5 | 5641.5 | 494.4 | 395.8/896.49 | 304.2 / 249.8 / 306.1 | 0 | 0 | 49.1 | da | 271.4 / 131.2 |
| 40 | 653 (653 / 0) | 0 | 0 / 0 / 0 | 8891.8/10448.4/11219.3 | 4655.5/7595.5 | 13171.4 | 3276.5 | 2359.78/3494.34 | 377.3 / 272.4 / 328.7 | 0 | 0 | 52.6 | da | 295.3 / 158.3 |
| 60 | 665 (665 / 0) | 0 | 0 / 0 / 0 | 12922.7/17468.6/22255.6 | 2196.9/6680.2 | 20856.8 | 3601.1 | 1345.81/3282.53 | 434.4 / 273.2 / 329.5 | 0 | 0 | 55.9 | da | 310.1 / 175 |
| 80 | 693 (693 / 0) | 0 | 0 / 0 / 0 | 17011.2/25548.1/31102.5 | 2795.2/11253 | 26171.4 | 7768.3 | 1496.8/2766.63 | 492.2 / 287.9 / 344.1 | 0 | 0 | 56.7 | da | 311.1 / 179 |

Po vrstah (ms; »ok« = 200/201 brez napake v toku SSE):

| Hkrati | Vrsta | n | ok | na s | p50 | p95 | p99 | max | prvi bajt p50/p95 | prvi delta p95 | statusi |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | sporočilo inštruktorju (SSE do konca) | 500 | 500 | 4.1 | 4007.3 | 4694.5 | 6562.8 | 7846 | 1271.1/1985.5 | 1985.5 | 200×500 |
| 20 | sporočilo s fotografijo 342 KB (SSE do konca) | 87 | 87 | 0.7 | 4000.1 | 5641.5 | 8153.9 | 8153.9 | 1286.2/2958.3 | 2958.3 | 200×87 |
| 20 | fotografija 342 KB v skeniranje (scan/read) | 80 | 80 | 0.7 | 211.1 | 494.4 | 782.7 | 782.7 | – | – | 200×80 |
| 20 | nov pogovor | 60 | 60 | 0.5 | 136.6 | 296.9 | 369.5 | 369.5 | – | – | 201×60 |
| 40 | sporočilo inštruktorju (SSE do konca) | 466 | 466 | 3.8 | 8891.8 | 10448.4 | 11219.3 | 11802.7 | 4655.5/7595.5 | 7595.5 | 200×466 |
| 40 | sporočilo s fotografijo 342 KB (SSE do konca) | 80 | 80 | 0.7 | 8911.8 | 13171.4 | 13993.1 | 13993.1 | 5020.5/7682.4 | 7682.4 | 200×80 |
| 40 | fotografija 342 KB v skeniranje (scan/read) | 67 | 67 | 0.6 | 776.9 | 3276.5 | 4715.8 | 4715.8 | – | – | 200×67 |
| 40 | nov pogovor | 40 | 40 | 0.3 | 656.7 | 1772.6 | 3767.1 | 3767.1 | – | – | 201×40 |
| 60 | sporočilo inštruktorju (SSE do konca) | 470 | 470 | 3.9 | 12922.7 | 17468.6 | 22255.6 | 23279.2 | 2196.9/6680.2 | 6680.2 | 200×470 |
| 60 | sporočilo s fotografijo 342 KB (SSE do konca) | 86 | 86 | 0.7 | 13196.3 | 20856.8 | 23458.7 | 23458.7 | 2319.2/9654.9 | 9654.9 | 200×86 |
| 60 | fotografija 342 KB v skeniranje (scan/read) | 69 | 69 | 0.6 | 492.9 | 3601.1 | 4685 | 4685 | – | – | 200×69 |
| 60 | nov pogovor | 40 | 40 | 0.3 | 423.7 | 1695.5 | 2897.8 | 2897.8 | – | – | 201×40 |
| 80 | sporočilo inštruktorju (SSE do konca) | 482 | 482 | 3.9 | 17011.2 | 25548.1 | 31102.5 | 34008.7 | 2795.2/11253 | 11253 | 200×482 |
| 80 | sporočilo s fotografijo 342 KB (SSE do konca) | 82 | 82 | 0.7 | 17227.5 | 26171.4 | 31039.7 | 31039.7 | 2932.7/11880.6 | 11880.6 | 200×82 |
| 80 | fotografija 342 KB v skeniranje (scan/read) | 69 | 69 | 0.6 | 501.6 | 7768.3 | 9757.7 | 9757.7 | – | – | 200×69 |
| 80 | nov pogovor | 60 | 60 | 0.5 | 476.3 | 8684.7 | 9565.6 | 9565.6 | – | – | 201×60 |