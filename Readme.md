# Avito Moderation Tool

This is a web application developed for the Avito internship test task. It's a simplified version of an internal tool used by moderators to review, approve, or reject user-submitted advertisements.

## Features

### Core Functionality

- **Ad Listing (`/list`):** Displays all advertisements with pagination, advanced filtering (by search, status, category, price), and sorting (by date, price, priority).
- **Detailed Ad View (`/item/:id`):** Shows complete ad details, including an image gallery, seller information, characteristics, and full moderation history.
- **Moderation Actions:** Moderators can Approve, Reject (with a required reason), or flag an ad for changes directly from the detail page.
- **Statistics Dashboard (`/stats`):** Provides an overview of moderator performance with key metrics and charts visualizing activity over different time periods (Today, 7 Days, 30 Days).

### Advanced Features Implemented (⭐)

- **Hotkeys:** Keyboard shortcuts for efficient moderation (`'a'` to approve, `'d'` to reject, arrow keys for navigation, `'/'` to focus search).
- **Bulk Operations:** Users can select multiple ads on the list page to approve or reject them in a single batch.
- **Advanced Filtering & URL Sync:** The application state (filters, sorting, pagination) is synchronized with the URL, making the view shareable and bookmarkable. Users can also save and load their favorite filter sets using `localStorage`.
- **Dark Theme:** A persistent dark mode toggle is available for user comfort, with the preference saved in `localStorage`.
- **Data Export:** Statistics can be exported as a **CSV** file or a **PDF** report.
- **Real-time Updates:** The application polls the server for changes:
  - A notification button appears in the header when new ads are available, which loads them on click.
  - An ad's status will update in real-time on the detail page if it's moderated elsewhere.
- **Animations:** Subtle animations for page transitions, card loading, and a global progress bar for background data fetching provide a smooth and modern user experience.
- **Containerization:** The entire full-stack application can be built and run using **Docker and Docker Compose**, ensuring a consistent and reproducible environment for development and production.
- **Request Cancellation:** By leveraging TanStack React Query, in-flight API requests are automatically aborted when their component unmounts, saving bandwidth and resources.
- **Unit Tests:** Key components, hooks, and utility functions are covered by unit tests written with **Vitest and React Testing Library**.

## Technology Choices

This section outlines the key libraries and technologies used in the project and the reasoning behind their selection.

- **Framework:** **React (v19.2.0) with Vite**

  - **Reasoning:** Chosen as per the task requirements. Vite provides an extremely fast development server and optimized build process, significantly improving developer experience.

- **Language:** **TypeScript**

  - **Reasoning:** Adds static typing to JavaScript, which helps catch errors during development. It improves code quality, readability, and maintainability, a standard for modern web applications.

- **UI Components:** **Material--UI (MUI)**

  - **Reasoning:** A comprehensive component library that accelerates development by providing a wide range of pre-built, accessible, and themeable components.

- **Data Fetching & State Management:** **TanStack React Query**

  - **Reasoning:** Chosen for its powerful out-of-the-box capabilities:
    - **Server State Caching:** Intelligently caches API data, preventing redundant network requests.
    - **Automatic Background Refetching:** The real-time update features were implemented effortlessly using `refetchInterval`.
    - **Request Cancellation:** Automatically aborts obsolete network requests when components unmount, which is a critical performance optimization.
    - **Mutation and Invalidation:** Simplifies data mutations and provides a declarative way to keep the UI in sync with the backend.

- **Routing:** **React Router DOM**

  - **Reasoning:** The standard library for routing. The project uses the URL as the "single source of truth" for filters and pagination via the `useSearchParams` hook, allowing for shareable URLs.

- **Animations:** **Framer Motion**

  - **Reasoning:** A declarative and powerful animation library used for smooth page transitions and card animations, providing a polished user experience.

- **Testing:** **Vitest & React Testing Library**
  - **Reasoning:** A modern, Vite-native test runner combined with a testing philosophy that encourages testing application behavior from a user's perspective, leading to more resilient tests.

## How to Run the Project

### Prerequisites

- Node.js (v20.19+)
- npm
- Docker and Docker Compose (for containerized setup)

### Method 1: Running with Docker (Recommended)

This is the simplest way to run the full-stack application, as it manages both the client and server.

1.  **Clone the repository.**
2.  Navigate to the project's root directory (the one containing `docker-compose.yml`).
3.  Build and start the containers in detached mode:
    ```bash
    docker-compose up --build -d
    ```
4.  The application will be available at **`http://localhost:9090`**.
5.  To stop the application, run:
    ```bash
    docker-compose down
    ```

### Method 2: Running Locally (Manual)

If you prefer to run the client and server separately without Docker.

**Server:**

1.  Navigate to the `tech-int3-server` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
4.  The server will be running on `http://localhost:3001`.

**Client:**

1.  In a new terminal, navigate to the `tech-int3-client` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  The client will be available at `http://localhost:5173`.

### Running Tests

To run the unit tests for the client application:

1.  Navigate to the `tech-int3-client` directory.
2.  Run the tests:
    ```bash
    npm test
    ```
3.  To run tests in the interactive UI mode:
    ```bash
    npm run test:ui
    ```
