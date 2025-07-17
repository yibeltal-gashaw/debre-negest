# Debre Negest Dashboard

Debre Negest is an Electron-based desktop application designed for managing church-related data and activities. The dashboard provides an intuitive interface for administrators to view statistics, manage users, and access various modules relevant to church operations.

## Features

- Sidebar navigation with Amharic labels and icons for:
  - Home
  - Priests (with dropdown for subcategories)
  - Assembly
  - Sunday School
  - Saints' Societies
  - Community House
  - Annual Events
  - Messages
  - Announcements
  - Attendance
  - Profile, Settings, Logout
- Main dashboard area with user cards showing statistics for different groups
- Search bar for quick access
- Notification and announcement icons
- Responsive and engaging UI with custom scrollbars and colored cards
- Database backup and restore functionality

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Electron](https://www.electronjs.org/)

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd debrenegest
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App
Start the Electron app in development mode:
```sh
npm run dev
```

## Project Structure
```
assets/
  images/           # Icon and image assets
  cache/            # Application cache
  debre_negest.db   # Main database file
src/
  css/              # Stylesheets
  js/               # JavaScript modules
  views/            # HTML views
main.js             # Electron main process
package.json        # Project metadata and scripts
```

## Troubleshooting
- If you see `require is not defined`, ensure `nodeIntegration: true` and `contextIsolation: false` in your Electron `BrowserWindow`.
- If you see `initDatabase is not defined`, check your imports and function definitions in `main.js`.

## License
This project is for educational and church management purposes. Please contact the author for licensing details.

## Author
Tesfaye (and contributors)
