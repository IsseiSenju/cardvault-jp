// Cria api/db.json a partir de api/db.seed.json na primeira execução
// (ou sempre, com --reset). O db.json é alterado pelo JSON-Server e fica fora do git.
import { copyFileSync, existsSync } from 'node:fs';

const seed = new URL('../api/db.seed.json', import.meta.url);
const db = new URL('../api/db.json', import.meta.url);
const reset = process.argv.includes('--reset');

if (reset || !existsSync(db)) {
  copyFileSync(seed, db);
  console.log(reset ? 'Base de dados restaurada a partir do seed.' : 'Base de dados criada a partir do seed.');
}
