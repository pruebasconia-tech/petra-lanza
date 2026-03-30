# PETRA LANZA

Experiencia 3D con Vue + TresJS lista para publicarse en GitHub Pages.  
Incluye un sistema de audio reactivo con modo demo suavizado para que la animación nunca quede estática aunque el navegador no otorgue permisos de micrófono.

## Ejecutar

```bash
npm install
npm run dev
```

## Build (incluye base relativa para GitHub Pages)

```bash
npm run build
```

El `vite.config.ts` usa `base: './'` para que los assets funcionen correctamente bajo la ruta del repositorio en GitHub Pages.
