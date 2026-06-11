# Jugni Innov Backend

## Setup

1. Open this backend folder in terminal.
2. Install packages:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and fill values.
4. Run development server:
   ```bash
   npm run dev
   ```

## APIs

### Health Check
`GET /api/health`

### Contact Form
`POST /api/contact`

Body:
```json
{
  "firstName": "Sumit",
  "lastName": "Verma",
  "email": "sumit@example.com",
  "phone": "+91 98765 43210",
  "role": "Student / Youth",
  "message": "I want to connect."
}
```

### Volunteer Form
`POST /api/volunteer`

Body:
```json
{
  "fullName": "Sumit Verma",
  "email": "sumit@example.com",
  "areaOfInterest": "Technology & Development",
  "motivation": "I want to support the foundation."
}
```

## Notes

- Email will be skipped until SMTP values are configured in `.env`.
- For Gmail SMTP, use a Gmail App Password, not your normal Gmail password.
