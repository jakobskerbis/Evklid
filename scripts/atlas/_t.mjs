import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
for (const f of process.argv.slice(2)) {
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(f);
let n=0,b=0; for (const a of doc.getRoot().listAccessors()) if (a.listParents().filter(p=>p.propertyType!=="Root").length===0) {n++; b+=a.getByteLength();}
console.log(f.split("/").pop(), "osirotelih", n, b);
}
