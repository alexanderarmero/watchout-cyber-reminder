
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f24d296f-1762-4d19-b54d-56c3fa337e8c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f24d296f-1762-4d19-b54d-56c3fa337e8c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Building the Desktop Application

This project can be built as a desktop application for macOS, Windows, and Linux using Electron.

### Prerequisites

- Node.js and npm installed
- For macOS builds: A Mac computer
- For Windows builds: A Windows computer (or using virtual machine/cross-compilation)
- For Linux builds: A Linux system (or using virtual machine/cross-compilation)

### Development

To run the app in development mode:

```sh
# First terminal: Start the Vite dev server
npm run dev

# Second terminal: Start Electron
npm run electron:dev
```

### Building the Desktop App

To build the desktop application:

```sh
# Build for your current platform
npm run electron:build

# Build for specific platforms (on macOS)
npm run electron:build -- --mac
npm run electron:build -- --win
npm run electron:build -- --linux
```

The built applications will be available in the `release` directory:
- macOS: `.dmg` and `.zip` files
- Windows: `.exe` installer
- Linux: `.AppImage` file

### Running the Built App

#### macOS
1. Navigate to the `release` directory
2. Find the `.dmg` file
3. Double click to mount the disk image
4. Drag the app to your Applications folder
5. If you get a security warning, go to System Preferences > Security & Privacy > General and click "Open Anyway"

#### Windows
1. Navigate to the `release` directory
2. Find the `.exe` installer
3. Run the installer
4. Follow the installation wizard

#### Linux
1. Navigate to the `release` directory
2. Find the `.AppImage` file
3. Make it executable: `chmod +x <filename>.AppImage`
4. Run it: `./<filename>.AppImage`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Electron

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f24d296f-1762-4d19-b54d-56c3fa337e8c) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
