# P2P Trading Platform

A sophisticated peer-to-peer trading platform leveraging blockchain technology for secure, multi-currency transactions with real-time communication capabilities.

## Overview

This P2P Trading Platform enables users to safely trade cryptocurrencies and fiat currencies directly with one another through an escrow system. The platform provides a secure environment with integrated wallet authentication, real-time chat, dispute resolution, and a comprehensive rating system.

## Features

- **Wallet Connection Authentication**: Secure login using cryptocurrency wallet signatures
- **Multi-Currency Support**: Trade various cryptocurrencies and fiat currencies
- **Escrow System**: Built-in security for all transactions
- **Real-Time Chat**: Communicate directly with trading partners
- **Dispute Resolution**: Resolve conflicts with admin assistance
- **User Ratings**: Build trust through a comprehensive rating system
- **Transaction History**: Complete record of all trading activity
- **Mobile & Web Support**: Cross-platform compatibility with responsive design
- **Admin Dashboard**: Monitor trades, ratings, disputes, and wallet balances

## Tech Stack

### Frontend
- React: UI library for building the user interface
- Tailwind CSS: Utility-first CSS framework for styling
- Redux: State management
- React Router: Navigation and routing
- Axios: HTTP client for API requests
- ethers.js: Ethereum wallet integration

### Backend
- Node.js: JavaScript runtime environment
- Express: Web application framework
- PostgreSQL: Relational database
- Drizzle ORM: SQL toolkit and query builder
- Passport: Authentication middleware
- Connect-PG-Simple: Session store for PostgreSQL
- WebSockets: Real-time communication

### DevOps
- Vite: Frontend build tool and development server
- TypeScript: Type-safe JavaScript
- ESLint: Code linting
- Replit: Development and deployment environment

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Metamask or other Ethereum wallet (for wallet authentication)

### Installation

1. Clone the repository
2. Install dependencies for server and client
3. Set up environment variables for database connection
4. Initialize the database
5. Start the server and client applications

## Usage

### User Workflows

1. Connect Wallet: Click the "Connect Wallet" button on the homepage to authenticate
2. Browse Trades: View available buy/sell offers on the Trades page
3. Create Trade: Post a new buy or sell offer with your desired terms
4. Complete Trade: Follow the escrow process to safely complete transactions
5. Rate Partners: Leave feedback for trading partners to build platform trust

### Admin Access

Admin users have access to:
- User management
- Trade monitoring
- Dispute resolution
- System statistics

## Database Schema

The platform uses a PostgreSQL database with the following main entities:
- Users
- Trades
- Messages
- Disputes
- Ratings
- Wallet Balances
- Transactions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
