FROM node:22-slim
# Python za preverjanje s SymPy (server/cas.js); SymPy namesti postinstall v .pylib.
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY scripts/namesti-sympy.cjs scripts/
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production PORT=3000 EVKLID_DB=/data/evklid.db
# glibc vrne sproščen pomnilnik sistemu (render.yaml, 17. 11. 2026: RSS po prometu 653 → 381 MB).
ENV MALLOC_ARENA_MAX=2 MALLOC_TRIM_THRESHOLD_=131072 MALLOC_MMAP_THRESHOLD_=131072
VOLUME /data
EXPOSE 3000
CMD ["npm", "start"]
