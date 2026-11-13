// Različica datoteke APK (versionCode, versionName) iz AndroidManifest.xml v njej.
// APK je ZIP; manifest je v binarni obliki AXML. Beremo samo, kar potrebujemo: konec arhiva,
// en vnos in atribute elementa <manifest>. Brez zunanjih orodij (aapt na strežniku ni na voljo).
import fs from "node:fs";
import zlib from "node:zlib";

const VERSION_CODE = 0x0101021b; // android:versionCode
const VERSION_NAME = 0x0101021c; // android:versionName

// En vnos iz arhiva ZIP (brez ZIP64: APK je manjši od 4 GB).
function readZipEntry(fd, size, name) {
  const tailLen = Math.min(size, 65557);
  const tail = Buffer.alloc(tailLen);
  fs.readSync(fd, tail, 0, tailLen, size - tailLen);
  const eocd = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) return null;
  const count = tail.readUInt16LE(eocd + 10);
  const cdSize = tail.readUInt32LE(eocd + 12);
  const cdOffset = tail.readUInt32LE(eocd + 16);
  if (cdOffset + cdSize > size) return null;
  const cd = Buffer.alloc(cdSize);
  fs.readSync(fd, cd, 0, cdSize, cdOffset);
  for (let p = 0, i = 0; i < count && p + 46 <= cd.length; i++) {
    if (cd.readUInt32LE(p) !== 0x02014b50) return null;
    const method = cd.readUInt16LE(p + 10);
    const compSize = cd.readUInt32LE(p + 20);
    const nameLen = cd.readUInt16LE(p + 28);
    const extraLen = cd.readUInt16LE(p + 30);
    const commentLen = cd.readUInt16LE(p + 32);
    const local = cd.readUInt32LE(p + 42);
    if (cd.toString("utf8", p + 46, p + 46 + nameLen) === name) {
      if (compSize > 8 * 1024 * 1024) return null;
      const lh = Buffer.alloc(30);
      fs.readSync(fd, lh, 0, 30, local);
      if (lh.readUInt32LE(0) !== 0x04034b50) return null;
      const start = local + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28);
      const data = Buffer.alloc(compSize);
      fs.readSync(fd, data, 0, compSize, start);
      if (method === 0) return data;
      if (method === 8) return zlib.inflateRawSync(data, { maxOutputLength: 16 * 1024 * 1024 });
      return null;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

// Niz iz zbirke nizov AXML (UTF-8 ali UTF-16).
function poolString(buf, pool, idx) {
  if (idx < 0 || idx >= pool.count) return null;
  let p = pool.start + buf.readUInt32LE(pool.offsets + idx * 4);
  if (pool.utf8) {
    p += buf[p] & 0x80 ? 2 : 1; // dolžina v znakih UTF-16
    let len = buf[p];
    if (len & 0x80) {
      len = ((len & 0x7f) << 8) | buf[p + 1];
      p += 2;
    } else p += 1;
    return buf.toString("utf8", p, p + len);
  }
  let len = buf.readUInt16LE(p);
  if (len & 0x8000) {
    len = ((len & 0x7fff) << 16) | buf.readUInt16LE(p + 2);
    p += 4;
  } else p += 2;
  return buf.toString("utf16le", p, p + len * 2);
}

// Atributa versionCode in versionName elementa <manifest> iz binarnega AndroidManifest.xml.
export function manifestVersion(buf) {
  if (buf.length < 8 || buf.readUInt16LE(0) !== 0x0003) return null;
  let pool = null;
  let ids = [];
  for (let p = buf.readUInt16LE(2); p + 8 <= buf.length; ) {
    const type = buf.readUInt16LE(p);
    const chunk = buf.readUInt32LE(p + 4);
    if (chunk < 8 || p + chunk > buf.length) return null;
    if (type === 0x0001) {
      pool = { count: buf.readUInt32LE(p + 8), utf8: (buf.readUInt32LE(p + 16) & 0x100) !== 0, start: p + buf.readUInt32LE(p + 20), offsets: p + buf.readUInt16LE(p + 2) };
    } else if (type === 0x0180) {
      ids = [];
      for (let q = p + 8; q < p + chunk; q += 4) ids.push(buf.readUInt32LE(q));
    } else if (type === 0x0102 && pool) {
      const el = poolString(buf, pool, buf.readInt32LE(p + 20));
      if (el === "manifest") {
        const attrStart = p + 16 + buf.readUInt16LE(p + 24);
        const attrSize = buf.readUInt16LE(p + 26);
        const n = buf.readUInt16LE(p + 28);
        const out = {};
        for (let i = 0; i < n; i++) {
          const a = attrStart + i * attrSize;
          const nameIdx = buf.readInt32LE(a + 4);
          const name = ids[nameIdx] === VERSION_CODE ? "versionCode" : ids[nameIdx] === VERSION_NAME ? "versionName" : poolString(buf, pool, nameIdx);
          const raw = buf.readInt32LE(a + 8);
          const dataType = buf[a + 15];
          const data = buf.readUInt32LE(a + 16);
          if (name === "versionCode" && dataType >= 0x10 && dataType <= 0x11) out.versionCode = data;
          if (name === "versionName") out.versionName = dataType === 0x03 ? poolString(buf, pool, data) : raw >= 0 ? poolString(buf, pool, raw) : null;
        }
        return Number.isInteger(out.versionCode) ? { versionCode: out.versionCode, versionName: out.versionName || null } : null;
      }
    }
    p += chunk;
  }
  return null;
}

// { versionCode, versionName } datoteke APK ali null, če je ne znamo prebrati.
export function apkVersion(file) {
  let fd;
  try {
    fd = fs.openSync(file, "r");
    const manifest = readZipEntry(fd, fs.fstatSync(fd).size, "AndroidManifest.xml");
    return manifest ? manifestVersion(manifest) : null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}
