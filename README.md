# xTiles

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/xtiles-snap)

Aplicación de escritorio no oficial de [xTiles](https://xtiles.app/) basada en
[Tauri](https://tauri.app/).

## Instalación

Los releases incluyen instaladores para Linux, Windows y macOS.

### Linux

Instalación desde Snap Store:

```bash
sudo snap install xtiles-snap
```

También puedes descargar el paquete `.deb`, `.rpm` o `.AppImage` correspondiente
a tu arquitectura desde [Releases](https://github.com/andre-carbajal/xtiles-snap/releases).

### Windows

Descarga el instalador NSIS `.exe` x64 desde
[Releases](https://github.com/andre-carbajal/xtiles-snap/releases) y ejecútalo.

El instalador no está firmado digitalmente; Windows puede mostrar una advertencia
de seguridad antes de permitir la instalación.

### macOS

Descarga el `.dmg` correspondiente a tu equipo:

- `x64`: Mac Intel.
- `arm64`: Apple Silicon.

Abre el DMG y arrastra xTiles a Applications. Los instaladores no están
notarizados; macOS puede requerir confirmar la apertura desde Finder con clic
secundario y **Abrir**.

## Desarrollo

Tauri necesita Rust y las dependencias nativas de WebView del sistema. Consulta
los [prerrequisitos de Tauri](https://v2.tauri.app/start/prerequisites/), clona el
repositorio e instala las dependencias con pnpm:

```bash
git clone https://github.com/andre-carbajal/xtiles-snap
cd xtiles-snap
pnpm install --frozen-lockfile
pnpm dev
```

## Scripts

- `pnpm dev`: inicia la aplicación Tauri en modo desarrollo.
- `pnpm run typecheck`: comprueba el proyecto Rust.
- `pnpm run lint`: ejecuta Clippy con warnings como errores.
- `pnpm test`: compila la aplicación sin bundle y ejecuta el smoke test WebDriver.
- `pnpm run build`: genera los bundles Tauri de la plataforma actual.
- `pnpm run linux`: genera AppImage, DEB y RPM.
- `pnpm run appimage`, `pnpm run deb`, `pnpm run rpm`: genera un bundle Linux específico.
- `pnpm run win`: genera el instalador NSIS x64.
- `pnpm run mac:x64`, `pnpm run mac:arm64`: genera el DMG de macOS indicado.

Para una validación completa desde un checkout limpio:

```bash
pnpm install --frozen-lockfile
cargo fmt --manifest-path src-tauri/Cargo.toml --all -- --check
pnpm run typecheck
pnpm run lint
cargo test --manifest-path src-tauri/Cargo.toml --all-targets
pnpm audit --audit-level high
pnpm test
```
