// Strežnik še nima /api/mobile/web (posodobitev aplikacije OTA je prišla pred novo različico strežnika na
// Renderju): aplikacija začasno pokaže naravne zaslone in spletno stran poskusi znova, ko se vrne v ospredje.
let pending = false;
export const setWebPending = (v: boolean) => void (pending = v);
export const webPending = () => pending;
