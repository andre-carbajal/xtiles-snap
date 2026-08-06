# xTiles

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/xtiles-snap)

Aplicación de escritorio no oficial de [xTiles](https://xtiles.app/) basada en Electron.

## Instalación

Los releases incluyen instaladores para Linux, Windows y macOS.

### Linux

Instalación desde Snap Store:

```bash
sudo snap install xtiles-snap
```

También puedes descargar el paquete `.deb` correspondiente a tu arquitectura desde
[Releases](https://github.com/andre-carbajal/xtiles-snap/releases) e instalarlo con:

```bash
sudo apt install ./xTiles-<version>.deb
```

### Windows

Descarga el instalador NSIS `.exe` x64 desde
[Releases](https://github.com/andre-carbajal/xtiles-snap/releases) y ejecútalo.

Las primeras versiones no están firmadas digitalmente; Windows puede mostrar una
advertencia de seguridad antes de permitir la instalación.

### macOS

Descarga el `.dmg` correspondiente a tu equipo:

- `x64`: Mac Intel.
- `arm64`: Apple Silicon.

Abre el DMG y arrastra xTiles a Applications. Las primeras versiones no están
notarizadas; macOS puede requerir confirmar la apertura desde Finder con clic
secundario y **Abrir**.

## Desarrollo

Clona el repositorio e instala las dependencias con pnpm:

```bash
git clone https://github.com/andre-carbajal/xtiles-snap
cd xtiles-snap
pnpm install --frozen-lockfile
pnpm run start
```

## Scripts

- `pnpm run start`: inicia la aplicación desde el código compilado.
- `pnpm run typecheck`: valida los tipos de TypeScript.
- `pnpm run lint`: ejecuta ESLint.
- `pnpm test`: ejecuta el smoke test de Electron.
- `pnpm run build`: compila el código a `dist/`.
- `pnpm run snap`: genera el paquete Snap.
- `pnpm run deb`: genera el paquete DEB.
- `pnpm run win`: genera el instalador NSIS x64 para Windows.
- `pnpm run mac`: genera DMG para macOS x64 y arm64.

Para una validación completa desde un checkout limpio:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm audit --audit-level high
pnpm test
```
