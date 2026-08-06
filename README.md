# Xtiles-snap

[![xtiles-snap](https://snapcraft.io/xtiles-snap/badge.svg)](https://snapcraft.io/xtiles-snap)

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/xtiles-snap)

A linux application of [Xtiles](https://xtiles.app/)

```
sudo snap install xtiles-snap
```

# Scripts

Here are the scripts available in our `package.json` file:

- `start`: Start the application.
```
pnpm run start
```

- `snap`: Create a snap package of the application.
```
pnpm run snap
```

- `deb`: Create a deb package of the application.
```
pnpm run deb
```

# Installation
To install the application, you must first clone the repository:

```
git clone https://github.com/andre-carbajal/xtiles-linux
```
Then, navigate to the project directory:
```
cd xtiles-snap
```
Install the project dependencies:
```
pnpm install
```
Finally, you can start the application with:
```
pnpm run start
```

For a clean development setup, use the lockfile and run the checks directly:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm test
```
