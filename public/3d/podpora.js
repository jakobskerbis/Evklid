// Ali brskalnik zmore 3D (docs/3d.md): three.js r187 uporablja statične bloke razreda (Safari 16.4 ali novejši). Ta modul
// ima enega; star brskalnik ga ne prebere in uvoz ne uspe, zato stran /3d in lekcija pokažeta »posodobi brskalnik«
// (napake.js preveriPodporo) namesto prazne strani. CSP ne dovoli eval/new Function, zato preverjamo z uvozom modula.
// Brez uvozov: ta datoteka se mora prenesti in prebrati sama.
class Preizkus {
  static da = false;
  static {
    Preizkus.da = true;
  }
}
export const podprto = Preizkus.da;
