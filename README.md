
# WorkWithTrust - Frontend (React + Tailwind + Vite)

A modern, clean, and responsive freelance marketplace interface built using **React**, **Vite**, and **Tailwind CSS**. Integrates with the backend for gig management, order tracking, earnings, messaging, and user profiles.

---

## 📁 Folder Structure

workwithtrust-frontend/

1. src/
2.  pages/            # Dashboard.jsx, Register.jsx, Login.jsx, Profile.jsx, etc
3.  components/       # FreelancerSidebar.jsx, Navbar.jsx, etc
4.  utils/            # API configs, helpers
5.  App.jsx           # Root component
6.  index.js          # Entry point
7.  public/           # Static files (images, favicon)
8.  .env              # Environment variables

---

## ✨ Features

- Register / Login (JWT based authentication)
- Dashboard for freelancers (earnings, orders, gigs)
- Gig management: create, edit, delete gigs
- Order tracking: view, update, and manage orders
- Profile management: update user details
- Real-time notifications (React Toastify)
- Responsive layout (mobile + desktop)
- Modern UI with Tailwind CSS
- RESTful API integration

---

## 🧠 Pages

- `/register` → User registration
- `/login` → User login
- `/dashboard` → Freelancer dashboard (earnings, orders, gigs)
- `/profile` → User profile management
- `/gigs` → Gig management
- `/orders` → Order tracking

---

## 🧪 Components

- `FreelancerSidebar.jsx` → Sidebar navigation
- `Navbar.jsx` → Top navigation bar
- `GigCard.jsx` → Display gig details
- `OrderList.jsx` → List and manage orders
- `ProfileForm.jsx` → Edit user profile

---

## 🛠 Libraries Used

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify
- react-icons

---

## ⚠ Known Issues & Fixes

- Mobile sidebar toggle improved for better UX
- API error handling improved for all forms
- Image upload path bug fixed in gig creation

---

## 🚀 Deployment

- Backend: [Render] ([API](https://workwithtrust-backend.onrender.com))
- Frontend: [Vercel] ([Live Demo](https://workwithtrust-frontend.vercel.app))

---

## 📝 API Integration

The frontend communicates with the backend API at [https://workwithtrust-backend.onrender.com] for all data operations, including authentication, gig management, order tracking, and more.

-

## 👩‍💻 Author

**Shaik Akhila**  
Computer Science | MERN Stack Developer | Passionate about clean though messy UIs

**Email:** akhilashaik2605@gmail.com  
**GitHub (Frontend):** [shaikakhila26/workwithtrust-frontend] 
**GitHub (Backend):** [shaikakhila26/workwithtrust-backend]

