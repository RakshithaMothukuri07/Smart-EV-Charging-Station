# Smart EV Charging Station Finder and Slot Booking System

A web-based application designed to help users find electric vehicle (EV) charging stations, explore station details, and manage charging slot bookings.

The project combines a React frontend, Spring Boot backend, and a blockchain module.

## Project Overview

The Smart EV Charging Station system provides separate interfaces for users and administrators to interact with charging station information and booking functionality.

## Key Features

- User registration and login
- Charging station browsing
- Station and location management
- Charging slot booking
- Booking management
- User profile management
- Reviews and feedback
- Admin dashboard and management features
- Blockchain module with Solidity smart contract

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Java, Spring Boot, Maven |
| Blockchain | Python, Django, Solidity, Truffle |
| API Communication | REST APIs |

## Project Structure

```text
Smart-EV-Charging-Station/
│
├── BACKEND/
│   └── SmartEVChargingStation/
│       ├── src/
│       └── pom.xml
│
├── FRONTEND/
│   └── smart-ev/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── blockchain/
│   ├── adminapp/
│   ├── app/
│   ├── blocks/
│   │   ├── contracts/
│   │   ├── migrations/
│   │   └── truffle-config.js
│   └── manage.py
│
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RakshithaMothukuri07/Smart-EV-Charging-Station.git
cd Smart-EV-Charging-Station
```

### 2. Run the Frontend

```bash
cd FRONTEND/smart-ev
npm install
npm run dev
```

### 3. Run the Backend

Open the backend folder in your Java IDE.

Configure the required database settings in:

`src/main/resources/application.properties`

Then run the Spring Boot application.

### 4. Run the Blockchain Module

Navigate to the blockchain directory and configure the required Python environment and dependencies before running the Django application.

## Project Objective

The objective is to provide a convenient platform for EV users to discover charging stations and manage charging slot bookings through an integrated web application.

## Project Repository

**GitHub:** [Smart EV Charging Station](https://github.com/RakshithaMothukuri07/Smart-EV-Charging-Station)


*Developed as a collaborative software project.*
