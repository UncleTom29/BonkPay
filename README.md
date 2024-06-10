# BonkPay Documentation

## Overview

BonkPay is a payment solution for online merchants that enables them to accept payments in $BONK tokens via the Solana blockchain. This documentation provides all the necessary information for merchants to integrate BonkPay into their online stores easily.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
2. [API Reference](#api-reference)
   - [Authentication](#authentication)
     - [Register](#register)
     - [Login](#login)
   - [Transactions](#transactions)
     - [Create Transaction](#create-transaction)
     - [Get Transactions](#get-transactions)
3. [Merchant Dashboard](#merchant-dashboard)
4. [Integration Guide](#integration-guide)
   - [Frontend Integration](#frontend-integration)
5. [Examples](#examples)
6. [FAQ](#faq)
7. [Support](#support)
8. [Test the Application](#test-the-application)

## Getting Started

### Prerequisites

To integrate BonkPay, you need:

- A Solana wallet (e.g., Phantom wallet)
- An online store

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bonkpay.git
cd bonkpay
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

4. Open the Merchant Dashboard:

Open [http://localhost:5000/merchant-dashboard.html](http://localhost:5000/merchant-dashboard.html) in your browser.

## API Reference

### Authentication

#### Register

Registers a new merchant and returns an API key.

- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Parameters**:
  - `name` (string): Merchant's name
  - `email` (string): Merchant's email
  - `password` (string): Merchant's password
  - `recipientPublicKey` (string): Solana wallet address for receiving payments
  - `redirectUrl` (string): URL to redirect after payment
- **Response**:
  - `token` (string): Authentication token
  - `apiKey` (string): Merchant's API key

#### Login

Logs in a merchant and returns an authentication token.

- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Parameters**:
  - `email` (string): Merchant's email
  - `password` (string): Merchant's password
- **Response**:
  - `token` (string): Authentication token
  - `apiKey` (string): Merchant's API key

### Transactions

#### Create Transaction

Creates a new transaction.

- **Endpoint**: `/api/transactions`
- **Method**: POST
- **Parameters**:
  - `amountUSD` (number): Amount in USD
  - `amountBonk` (number): Amount in BONK
  - `recipientPublicKey` (string): Recipient's Solana wallet address
- **Response**:
  - `transactionId` (string): Transaction ID
  - `status` (string): Transaction status

#### Get Transactions

Gets a list of transactions for the authenticated merchant.

- **Endpoint**: `/api/transactions`
- **Method**: GET
- **Headers**:
  - `Authorization`: Bearer token
- **Response**:
  - `transactions` (array): List of transactions

## Merchant Dashboard

The Merchant Dashboard allows merchants to manage their accounts, view transactions, and obtain their API key. The dashboard has the following sections:

- **Registration**: Allows new merchants to register.
- **Login**: Allows existing merchants to log in.
- **Transactions**: Displays a list of transactions for the logged-in merchant.
- **API Key**: Displays the merchant's API key for integration.

## Integration Guide

### Frontend Integration

#### Step 1: Add Payment Button to Your Store

Include a payment button on your product pages. This can be done by adding the following HTML snippet to your product page template:

```html
<button id="payWithBonk" data-amount="10">Pay with Bonk</button>
```

#### Step 2: Add BonkPay Script

Include the BonkPay script on your product pages. Add this script at the end of your HTML file:

```html
<script>
document.getElementById('payWithBonk').addEventListener('click', async function () {
  const amountUSD = this.getAttribute('data-amount');
  const transactionId = 'your_generated_transaction_id'; // Generate or fetch a unique transaction ID for each transaction

  // Redirect to BonkPay checkout page
  window.location.href = `http://localhost:5000/checkout.html?amountUSD=${amountUSD}&transactionId=${transactionId}`;
});
</script>
```

## Examples

### Example Checkout Page

To test the checkout process, visit the following URL with the appropriate parameters:

```
http://localhost:5000/checkout.html?amountUSD=10&transactionId=your_transaction_id
```

## FAQ

### How do I get a Solana wallet?

You can get a Solana wallet by installing a browser extension like Phantom. Visit [Phantom's website](https://phantom.app) for more information.

### How do I check the status of my transactions?

You can check the status of your transactions by logging into the Merchant Dashboard and navigating to the Transactions section.

### What should I do if a payment fails?

If a payment fails, ensure that your Solana wallet is properly connected and funded. You can also try again or contact our support team for further assistance.

## Support

If you need help or have any questions, please contact our support team at support@bonkpay.com. We're here to help you with any issues or inquiries you may have.

## Test the Application

### Start the Server:

```bash
node server.js
```

### Access the Merchant Dashboard:

Open [http://localhost:5000/merchant-dashboard.html](http://localhost:5000/merchant-dashboard.html) in your browser.

### Register and Login:

Register as a merchant, then log in to view transactions.

### Test Checkout:

Open [http://localhost:5000/checkout.html?amountUSD=10&transactionId=your_transaction_id](http://localhost:5000/checkout.html?amountUSD=10&transactionId=your_transaction_id) to test the checkout process.


This documentation simplifies the integration process, making it easy for non-technical users to set up BonkPay in their online stores. The backend server handles all tasks, and merchants only need to add a button and script to their product pages.