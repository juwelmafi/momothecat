# momothecat

A high-converting, vibrant e-commerce platform for **Momo - The Cat** (`momothecat.shop`), inspired by the Pettie theme aesthetic and built on Next.js 16 (App Router) and React 19.

## Overview

Momo - The Cat implements a phased e-commerce architecture:
- **Phase 1 (Affiliate Marketing Hub)**: Showcases curated cat essentials via Amazon Associates links, capturing buyer interest and collecting newsletter leads for future retail.
- **Phase 2 (In-House Retail Storefront)**: Seamless pivot to direct in-house product fulfillment, stock tracking, and integrated checkout without architectural overhaul.

## Key Features

- **Pettie Theme UI/UX**: Playful brand aesthetic featuring Fredoka and Readex Pro typography, vibrant color tokens, circular category selectors, and promotional banners.
- **Dual Product Model**: Smart product cards handle both external Amazon affiliate links and in-house retail items with full shopping cart support.
- **Interactive Storefront**:
  - Hero banner with promotional badges
  - Category showcase arches & interactive circle selectors
  - Deals countdown & Amazon Prime spotlight
  - Customer testimonials & social media integrations
  - Lead capture discount banner (10% off code generation)
- **Product Details & Cart**:
  - Dynamic product detail page (`/product/[id]`) with image gallery and stock indicators
  - Persistent slide-over cart drawer with threshold-based free shipping progress
- **Checkout & Order Flow**:
  - In-house checkout (`/checkout`) with address verification and promo discounts
  - Order confirmation receipt (`/order-confirmation/[id]`) with real-time status tracker
- **Admin Command Center (`/admin`)**:
  - Session-authenticated portal for product inventory (Affiliate & Real products)
  - Order fulfillment management with carrier tracking
  - Lead database with one-click CSV export
  - One-click Phase 2 flip switch to toggle retail mode or drop affiliate collections

## Tech Stack

- **Framework**: Next.js 16.3.8 (App Router, Turbopack)
- **UI & State**: React 19.2.8, React Context, LocalStorage
- **Styling**: Tailwind CSS v4, Lucide React
- **Database**: MongoDB via Mongoose 9.10.4 with resilient in-memory fallback

## Getting Started

### 1. Prerequisites
- Node.js 20+
- npm / yarn / pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your MongoDB connection string and admin credentials as needed.

### 3. Install Dependencies
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### 5. Production Build
```bash
npm run build
npm start
```
