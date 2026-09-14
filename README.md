# Hollywoodbets Athletics Club

Hollywoodbets Athletics Club is a web application consisting of a **React frontend** and a **Node.js backend**.

Both the frontend and backend must be running for the application to work correctly.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm
- Git
- A terminal such as Command Prompt, PowerShell, or the VS Code terminal

You can verify Node.js and npm are installed by running:

```bash
node --version
npm --version
```

---

# Running the Application

The application consists of two separate services:

1. Frontend
2. Backend

Run each service in its own terminal window.

---

## 1. Start the Frontend

Navigate to the frontend folder in File Explorer:

```text
C:\Users\AndileMN\Downloads\Hollywood-Athletics-club\Hollywoobets Athletic Club\hollywood-athletics-club\frontend
```

Once inside the `frontend` folder:

1. Click the File Explorer address bar.
2. Type:

```text
cmd
```

3. Press **Enter**.

A Command Prompt window will open directly inside the frontend directory.

### Install Dependencies

Run:

```bash
npm install
```

### Start the Frontend

Run:

```bash
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

Keep this terminal open while using the application.

---

## 2. Start the Backend

Open another File Explorer window and navigate to:

```text
C:\Users\AndileMN\Downloads\Hollywood-Athletics-club\Hollywoobets Athletic Club\hollywood-athletics-club\backend
```

Once inside the `backend` folder:

1. Click the File Explorer address bar.
2. Type:

```text
cmd
```

3. Press **Enter**.

A second Command Prompt window will open directly inside the backend directory.

### Install Dependencies

Run:

```bash
npm install
```

### Start the Backend

Run:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:3000
```

Keep this terminal open while using the application.

---

# Application URLs

Once both services are running:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:3000` |

Open the frontend in your browser:

```text
http://localhost:5173
```

---

# Quick Start

### Terminal 1 — Frontend

cd "C:\Users\AndileMN\Documents\GitHub\Hollywood-Athletics-club\Hollywoobets Athletic Club\hollywood-athletics-club\frontend"
npm install
npm run dev

### Terminal 2 — Backend

cd "C:\Users\AndileMN\Documents\GitHub\Hollywood-Athletics-club\Hollywoobets Athletic Club\hollywood-athletics-club\backend"
npm install
npm run dev

Then open:

```text
http://localhost:5173
```

---

# Important

The **frontend and backend must both be running at the same time**.

If the frontend is running but the backend is stopped, pages that require API data may display errors such as:

```text
Failed to fetch
```

or:

```text
Backend unavailable
```

If this happens, confirm that the backend terminal is running and that the server has started on port `3000`.

---

# Project Structure

```text
hollywood-athletics-club/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
│
└── README.md
```

---

# Stopping the Application

To stop either the frontend or backend server, go to its terminal and press:

```text
Ctrl + C
```

You will need to run `npm run dev` again the next time you want to start that service.
