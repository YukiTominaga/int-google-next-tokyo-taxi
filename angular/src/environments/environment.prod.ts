export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_FIREBASE_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID'
  },
  google: {
    clientId: 'CLIENT_ID',
    scope: [
      'https://www.googleapis.com/auth/bigquery',
      'https://www.googleapis.com/auth/cloud-platform',
    ].join(' '),
  }
};
