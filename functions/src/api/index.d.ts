/**
 * @deprecated Este archivo está deprecado.
 *
 * La aplicación Express ahora está separada en:
 * - api/src/app.ts: Exporta la instancia de Express (sin listen)
 * - api/src/server.ts: Servidor para desarrollo local (con listen)
 *
 * Para desarrollo local, usa: npm run dev --workspace=api
 * Para Cloud Functions, functions/src/index.ts importa app.ts
 *
 * Este archivo se mantiene temporalmente para compatibilidad,
 * pero será eliminado en una versión futura.
 */
import './config/firebase';
//# sourceMappingURL=index.d.ts.map