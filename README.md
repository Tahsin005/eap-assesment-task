# Smart Inventory Management System

A full-stack inventory and order management system designed for efficient tracking of products, categories, stock movements, and customer orders. Built with React for the frontend and Express/Prisma for the backend.

## 🚀 Features

### **Core Modules**
- **Dashboard**: Real-time analytics, including total items, pending orders, and system-wide metrics.
- **Inventory Management**: Complete CRUD operations for Products and Categories with stock threshold monitoring.
- **Order Processing**: Automated stock deduction and order history tracking.
- **Stock Tracking**: Detailed audit trail (Movement History) for every inventory change (Restock, Order, Manual Adjust).
- **Restock Queue**: Priority-based replenishment system (High, Medium, Low) for low-stock items.
- **Role-Based Access (RBAC)**: Distinct permissions for Admin and Manager roles.
- **Activity Logs**: Global history of system actions for accountability.
- **Secure Authentication**: JWT-based login and signup flow.

### **Technical Features**
- **Frontend**: Modern, responsive UI with Tailwind CSS & Shadcn UI.
- **State Management**: Redux Toolkit & RTK Query for efficient data synchronization.
- **Backend Architecture**: Scalable Service-Repository-Handler pattern.
- **Database**: PostgreSQL with Prisma ORM for type-safe queries.

---

## 🛠️ Technology Stack

| Area | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Shadcn UI, Lucide Icons |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **State Management** | Redux Toolkit, RTK Query |
| **Routing** | React Router 7 |

---

## 💻 Local Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/Tahsin005/eap-assesment-task.git
cd eap-assesment-task
```

### **2. Backend Setup**
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and set your credentials:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   JWT_SECRET="your_strong_secret"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   ```
4. Push the database schema:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### **3. Frontend Setup**
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and point to your local or live backend:
   ```bash
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is for assessment purposes.
