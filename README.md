# Project Masakhane Backend

A Node.js backend for the Project-Masakhane swipe-based platform connecting farmers and investors, using DynamoDB for data storage.

## Features

- User profiles (farmers and investors)
- Swipe interactions (like/dislike)
- Automatic matching when mutual likes occur
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with DynamoDB access
- AWS CLI configured with access keys

## Setup

1. Clone the repository and navigate to the project directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` file and update with your AWS credentials:
     ```
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=your-access-key-id
     AWS_SECRET_ACCESS_KEY=your-secret-access-key
     PORT=3000
     ```

4. Create DynamoDB tables:
   - MasakhaneUsers
   - MasakhaneSwipes
   - MasakhaneMatches

   You can create them manually in AWS Console or use AWS CLI.

5. Seed the database with initial data:
   ```
   npm run seed
   ```

6. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `GET /api/users/:id/potential-matches` - Get potential matches for a user
- `GET /api/users/:id/matches` - Get matches for a user

### Swipes
- `POST /api/swipe` - Record a swipe (like/dislike)

### Health
- `GET /api/health` - Health check

## Database Schema

### MasakhaneUsers
- id (String, Primary Key)
- name (String)
- type (String: 'farmer' or 'investor')
- location (String)
- experience (String)
- pitch (String)
- img (String)
- createdAt (String)

### MasakhaneSwipes
- id (String: `${userId}_${targetUserId}`, Primary Key)
- userId (String)
- targetUserId (String)
- action (String: 'like' or 'dislike')
- timestamp (String)

### MasakhaneMatches
- id (String: `${user1Id}_${user2Id}`, Primary Key)
- user1Id (String)
- user2Id (String)
- timestamp (String)

## Production Deployment

For production deployment:

1. Use environment variables for all configuration.
2. Set up proper AWS IAM roles with minimal required permissions.
3. Use a process manager like PM2.
4. Implement proper logging and monitoring.
5. Set up HTTPS with SSL certificates.
6. Consider using API Gateway and Lambda for serverless deployment.

## Security Considerations

- Implement proper authentication and authorization.
- Validate all input data.
- Use HTTPS in production.
- Limit rate of API calls to prevent abuse.
- Store sensitive data securely.

## Frontend Integration

The frontend is located in the `public` directory. The current implementation assumes a hardcoded `currentUserId` in `script.js`. In a production environment, implement proper user authentication to dynamically set the current user ID.

To run the frontend, start the server and navigate to `http://localhost:3000`.