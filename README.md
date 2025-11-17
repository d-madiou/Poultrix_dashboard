
# Poultrix Dashboard

A web application dashboard for visualizing and managing Poultrix data. This project is built with React and Vite.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/))

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone <your-repository-url>
    cd Poultrix_dashboard
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Start the development server:
    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Configuration

The API configuration is located in `/src/utils/api.config.js`.

By default, the development environment points to `http://localhost:8000/api/`. For production, you will need to update the `BASE_URL` to point to your actual production API endpoint.

```javascript
// /src/utils/api.config.js
export const API_CONFIG = {
  BASE_URL: isDev
    ? 'http://localhost:8000/api/'
    : 'https://api.yourproductiondomain.com/api', // <-- Update this for production
  TIMEOUT: 5000,
};
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Serves the production build locally to preview it.

## Deployment

After running `npm run build`, the `dist/` directory will contain the optimized static files for your application. You can deploy this directory to any static hosting service like Vercel, Netlify, or GitHub Pages.