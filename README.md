# Auth Application - Final Project
**Name:** Hang Kheang Taing  
**Student ID:** 618055  

## Project Overview
This project is an authentication application that allows users to sign up, log in, and manage their profile, including uploading a profile image. The application is developed using a serverless architecture and meets the following requirements:

## Features
### 1. **Sign Up**
Users can register an account with the following information:
- **Email**: Used as the unique identifier.
- **Password**: Securely hashed and stored.
- **Name**: Displayed on the user profile.
- **Profile Image**: Uploaded to S3, with a signed URL generated for upload.

### 2. **Login**
After successful registration, users can log in by providing their email and password. If login is successful, a token is returned, and the user is redirected to their profile page.

### 3. **Profile Management**
- **View Profile**: After login, users are directed to their profile page where they can view their email, account creation date, and their profile image.
- **Update Profile Image**: Users can select and preview a new profile image before uploading. When a new image is uploaded, the old image is deleted from S3, and the DynamoDB entry is updated with the new image.
- **Logout**: Users can log out, which clears the session token and redirects them to the login page.

### 4. **Session Management**
- On login, a token is saved in the browser's cache (localStorage), allowing users to reopen the application and go directly to their profile without needing to log in again.
- When users log out, the token is removed, and they are redirected to the login page.

## Tech Stack
### Frontend:
- **ReactJS**: The frontend is built using React, enabling component-based development.
- **S3**: The frontend is hosted in an S3 bucket, providing a scalable and cost-effective solution.
- **CloudFront**: Used for CDN (Content Delivery Network) to deliver the frontend application quickly and efficiently.

### Backend:
- **Node.js 20.x**: Serverless backend powered by AWS Lambda functions, which handle user sign-up, login, and profile updates.
- **AWS API Gateway**: Serves as the entry point to the Lambda functions, routing HTTP requests for sign-up, login, and profile updates.
- **DynamoDB**: A NoSQL database is used to store user information, including email, password (hashed with salt), name, and profile image URL.
- **S3**: Used to store profile images, with signed URLs generated for secure upload and update functionality.

### Serverless Architecture:
This application leverages AWS services to implement a fully serverless architecture, ensuring scalability, cost-efficiency, and minimal maintenance overhead.

### CloudFormation:
A CloudFormation template is used to deploy the necessary infrastructure, including S3, CloudFront, API Gateway, Lambda, and DynamoDB. This enables easy setup and deployment of the application infrastructure.

### CI/CD Pipeline:
A CI/CD pipeline is implemented for the frontend using AWS services. The pipeline automates the build and deployment of the React application to S3, and invalidates the CloudFront cache to reflect the latest changes.

## Setup and Deployment
### Prerequisites:
- AWS Account
- Node.js installed locally for local development
- AWS CLI for managing resources

### Frontend Setup:
1. Clone the repository and navigate to the frontend directory.
   ```bash
   git clone <repository-url>
   cd frontend
