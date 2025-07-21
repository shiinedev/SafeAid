# 🛡️ SafeAid — Offline-First, Client-Only NGO Data Manager

SafeAid is a **secure, offline-capable, client-only** React application designed for NGOs to collect, store, and manage sensitive beneficiary data **without any backend infrastructure**. Built with privacy in mind, it uses modern encryption (Web Crypto API), localStorage, and a smooth UX with Tailwind and shadcn/ui components.

---

## 🚀 Project Goals

- Help NGOs operate in areas with **low connectivity or hostile environments**
- Enable **safe, encrypted** collection and viewing of **beneficiary records**
- Ensure **zero backend dependency** to protect from server compromise
- Provide **great UX** even for non-technical field workers

---

## 🧠 Key Features

| Feature                     | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| 🔐 **Offline Authentication**   |login stored locally                             |
| 👥 **Beneficiary Management**  | Add, edit, delete and search sensitive records                  |
| 🔒 **AES Encryption**         | Encrypt all beneficiary data before storing in `localStorage`           |`localStorage`           |
| 📦 **Client-only Data**       | No API or external server used                                           |
| 🧠 **Form Validation**        | Built using React Hook Form + Zod                                        |
|                |
| 🧭 **Offline Awareness**      | Detect online/offline status in real-time                               |
| 📱 **Mobile Friendly**        | Fully responsive and accessible UI                                      |

---

## 🧰 Tech Stack

- **React + Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form + Zod** (form validation)
- **React Query** (for simulated client-only fetches)
- **Web Crypto API** (AES-GCM for encryption)
- **localStorage** (persistence)

---

---

## 🧪 How to Run

```bash
# 1. Clone the repo
git clone https://github.com/shiinedev/SafeAid.git

cd safeaid

# 2. change directory
cd client

# 3.  Install dependencies
npm install

# 4. Run the app
npm run dev

```

### 📌 TODO (Optional Improvements)
 
 - Export encrypted data (for backup/import)

 - Role-based access (read-only, admin)

 - Biometric or PIN login (for devices in the field)

 - Support for PWA / device install
  

  ## 📄 License
MIT — free to use, modify, and distribute. Contributions welcome!