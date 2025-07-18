Angular frontend for the ESJ Leave Management System.

## Features

- Email/password login
- Submit and edit leave requests
- Manager approval and rejection
- Leave days auto-calculated (excluding weekends and 2025 SA public holidays)
- Basic success/error notifications

## Setup

Runs at: http://localhost:4200

## API Configuration

Set your backend URL in `src/environments/environment.ts`:

### Configure based on ESJ backend

export const environment = {
apiUrl: 'https://localhost:5001/api'
production: false
};

###RUN

```bash
npm install
ng serve
```
