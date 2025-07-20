# SafeAid

A secure web application for NGOs to collect, store, and share sensitive beneficiary data, prioritising privacy, data protection, and misuse prevention—even under conditions of surveillance or server compromise.

## Features
- Modern React frontend (Vite, TypeScript, TailwindCSS)
- Express + MongoDB backend for secure API and data storage
- Client-side encryption for sensitive data
- JWT-based authentication
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


## Project Structure
```
SafeAid/
  frontend/      # React app
  backend/       # Express + MongoDB API
```

## Security Principles
- **End-to-end encryption**: Sensitive data is encrypted in the browser before being sent to the server.
- **Zero trust**: Server stores only encrypted data; compromise does not expose plaintext.
- **Role-based access**: Only authorised users can access or share data (planned).
- **Audit logging**: All access and sharing actions are logged (planned).

## Contact
For questions or support, please open an issue or contact the maintainers. 