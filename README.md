# Real-time Chat System with Futuristic UI

An integrated chat system featuring a futuristic UI, with support for group and private real-time conversations.

![Cyberpunk Chat Application](screenshot.png)

## Key Features

- **Complete Authentication System**: User registration, login, and account management
- **Group Chat**: Communicate with all connected users in a public chat room
- **Private Chats**: One-on-one conversations with any connected user
- **Real-time Updates**: Instant display of messages and user status updates
- **Futuristic UI**: Cyberpunk-style design with neon elements and animation effects
- **Smooth User Experience**: Interactive effects and fluid animations

## Technologies Used

- **React**: For building the user interface
- **Firebase**: 
  - Firestore for real-time data storage
  - Authentication for user management
  - Hosting for deployment
- **styled-components**: For component styling
- **Framer Motion**: For animations

## System Requirements

- Node.js (version 14 or later)
- Firebase account (free)

## Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cyberpunk-chat-app.git
   cd cyberpunk-chat-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up Firebase
   - Create a new Firebase project from the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore services
   - Copy your configuration data and replace it in the `src/firebase.js` file
   - Set up security rules for Firestore:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```

4. Run the application locally
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firestore Collections Structure

- **users**: User information and status
- **groupChat**: Group chat messages
- **privateChats**: Private chat rooms with subcollections for messages

## Customization

You can customize colors and animations by modifying the variables in `src/styles/global.css` and adjusting animation parameters in the components.

## Contributing

Contributions are welcome! Please follow these steps:

1. Open an issue to discuss the change you wish to make
2. Fork the repository and create a new branch
3. Make your changes and test them
4. Submit a Pull Request

## License

This project is licensed under the [MIT License](LICENSE). 