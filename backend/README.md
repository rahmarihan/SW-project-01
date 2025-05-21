# Online Event Ticketing System 🎟️  

## Overview  
This project is a **full-stack web application** designed for users to browse, search, and purchase tickets for various events, such as concerts, sports games, and theater shows. It provides a seamless experience for event organizers to manage events and for users to book tickets conveniently.  

## 🚀 Project Objectives  
- Implement **CRUD operations** for users, events, and bookings.  
- Develop a **functional and interactive application** using frontend and backend technologies.  
- Apply **version control best practices** through GitHub collaboration.  
- Utilize **MongoDB** for efficient data storage and retrieval.  

## 👥 User Roles  
1. **Standard User**: Can browse events, book tickets, and view booking history.  
2. **Event Organizer**: Can create, update, and delete their own events.  
3. **System Admin**: Has full control over the system, including user and event management.  

## 📌 Key Features  
✅ **Homepage** – Displays a list of upcoming events with key details.  
✅ **Event Details Page** – Provides comprehensive event information and a booking option.  
✅ **Ticket Booking System** – Users can select tickets, view availability, and proceed to checkout.  
✅ **Search & Filter** – Find events by name, category, date, or location.  
✅ **User Dashboard** – Displays booked tickets and past events.  
✅ **Admin Panel** – Allows event organizers to manage events.  
✅ **MongoDB Database** – Stores users, events, and bookings.  

## 🛠️ Project Milestones  
- **Task 1**: GitHub setup, version control, and database schema creation.  
- **Task 2**: Backend development, including ticket booking and user dashboard.  
- **Task 3**: Frontend development (homepage, event listings, admin panel, event details).  
- **Task 4**: Full project integration.  
- **Task 5**: Testing, deployment, and final submission.  

## 📌 Task 1 (Version Control & Database Setup)  
- ✅ Set up **GitHub repository** and manage branches.  
- ✅ Create a **README.md** file (this document).  
- ✅ Set up a `.gitignore` file to ignore unnecessary files.  
- ✅ Implement **Mongoose schemas** for users, events, and bookings.  
- ✅ Practice **pull requests (PRs)** and code reviews.  
- ✅ Collaboratively resolve merge conflicts and ensure code quality.  

## 💾 Database Schemas  
### 1️⃣ **User Schema**  
- Contains user details: name, email, profile picture, and password.  
- Defines user roles (**Standard User, Organizer, System Admin**).  
- Includes account creation timestamps.  

### 2️⃣ **Event Schema**  
- Stores **event details** (title, description, date, location, category, image, ticket pricing).  
- Tracks ticket availability.  
- Links each event to its **organizer**.  

### 3️⃣ **Booking Schema**  
- Links **users** with **events** they booked.  
- Tracks **number of tickets booked**, **total price**, and **status** (pending, confirmed, canceled).  
- Stores booking timestamps.  

## 📌 How to Run Locally  
1. **Clone the repository**:  
   ```bash
   git clone https://github.com/rahmarihan/SW-project-01.git
   cd SW-project-01
