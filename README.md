# Product Management System

Products application for TCS frontend career

## Technology Stack

- **Framework**: Angular 20.3.0
- **State Management**: NgRx Signals 20.0.1
- **Testing**: Jasmine 5.1.0 + Karma 6.4.0
- **Build Tool**: Angular CLI 20.3.2
- **Language**: TypeScript 5.9.2
- **Styling**: CSS3

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Angular CLI (version 20 or higher)

## Backend Setup

This project consumes a local backend API. Follow these steps to run it:

1. Unzip the `repo-interview-main.zip` file.
2. Open a terminal pointing to the unzipped folder.
3. Install dependencies with `npm install`.
4. Start the backend with `npm run start:dev`.
5. The service will be available at `http://localhost:3002`.

> **Note:** If the backend does not have CORS enabled, you must add it manually. In the backend's main file (e.g. `app.ts` or `main.ts`), make sure CORS is configured to allow requests from `http://localhost:4200`.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/scaminom/prueba-tecnica-products-2025
cd prueba-tecnica-products-2025
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Server

Start the development server:
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

### Production Build

Build the project for production:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Running Unit Tests

Execute the unit tests:
```bash
npm test
# or
ng test
```

### Running Tests with Code Coverage

Generate test coverage reports:
```bash
ng test --watch=false
```

Code coverage is enabled by default in `angular.json`. The coverage reports will be generated in the `coverage/` directory. Open `coverage/index.html` in your browser to view the detailed coverage report.

### Test Configuration

- **Test Runner**: Karma
- **Testing Framework**: Jasmine
- **Coverage Tool**: karma-coverage
- **Browser**: Chrome (headless available)

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services and interceptors
│   │   └── interceptors/        # HTTP interceptors
│   ├── features/                # Feature modules
│   │   └── product/             # Product management feature
│   │       ├── components/      # Product components
│   │       ├── facade/          # Facade layer 
│   │       ├── pages/           # Product pages
│   │       ├── services/        # Product services
│   │       ├── store/           # NgRx Signals stores
│   │       ├── forms/           # Form factories
│   │       └── validators/      # Custom validators
│   └── shared/                  # Shared components and utilities
│       ├── components/          # Reusable components
│       ├── models/              # Data models
│       ├── services/            # Shared services
│       ├── utils/               # Utility functions
│       └── validators/          # Shared validators
```

## Key Components

### Product Management
- **Product List**: Displays products with search and pagination
- **Product Form**: Create and edit products with validation
- **Product Table**: Sortable and filterable product table
- **Product Search**: Real-time search functionality

### Core Features
- **Error Handling**: Global error interceptor
- **Form Validation**: Custom validators for business rules
- **State Management**: Reactive state with NgRx Signals
- **Routing**: Lazy-loaded feature modules

## Available Routes

- `/products` - Product list page (default)
- `/products/create` - Create new product
- `/products/edit/:id` - Edit existing product

## Testing Coverage

The project includes comprehensive test coverage for:

- Components with user interactions
- Services and business logic
- Form validation and custom validators
- Store state management
- Utility functions

## Scripts

- `npm start` - Start development server
- `npm test` - Run unit tests
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
