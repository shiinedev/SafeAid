# SafeAid

A secure web application for NGOs to collect, store, and share sensitive beneficiary data, prioritizing privacy, data protection, and misuse prevention—even under conditions of surveillance or server compromise.

## Features
- Modern React frontend (Vite, TypeScript, TailwindCSS)
- Planned Express + MongoDB backend for secure API and data storage
- Client-side encryption for sensitive data
- JWT-based authentication (planned)
- Role-based access control (planned)
- Audit logging and secure data sharing (planned)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend Setup (Planned)
- The backend will be implemented in Express (Node.js) with MongoDB for secure data storage and API endpoints.
- Backend code will reside in a `/backend` directory or a separate repository.

## Project Structure
```
SafeAid/
  frontend/      # React app (current)
  backend/       # Express + MongoDB API (planned)
```

## Security Principles
- **End-to-end encryption**: Sensitive data is encrypted in the browser before being sent to the server.
- **Zero trust**: Server stores only encrypted data; compromise does not expose plaintext.
- **Role-based access**: Only authorized users can access or share data (planned).
- **Audit logging**: All access and sharing actions are logged (planned).

## Contact
For questions or support, please open an issue or contact the maintainers. 