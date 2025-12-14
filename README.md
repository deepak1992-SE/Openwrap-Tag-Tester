# Tag Validator

A web application to validate ad tags against defined rules.

## Setup & Run

1.  **Install All Dependencies**
    ```bash
    npm run install:all
    ```

2.  **Start the Application**
    ```bash
    npm start
    ```
    This will start both the backend server (port 3001) and the frontend client (port 5173).
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

The validation rules are defined in `server/rules.js`. You can modify this file to add or change rules.

## API

### POST /api/validate

**Request Body:**
```json
{
  "tag": "<script src='...'></script>",
  "mode": "strict"
}
```

**Response:**
```json
{
  "valid": false,
  "summary": { "passed": 1, "failed": 1, "warnings": 0 },
  "results": [
    {
      "id": "RULE_001",
      "status": "fail",
      "message": "...",
      "suggestion": "..."
    }
  ]
}
```
