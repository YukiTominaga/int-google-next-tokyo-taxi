export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyAYyMXF7-4uqDeYUQVGzT06MHn6vEQx_j8',
    authDomain: 'ca-next-tokyo-taxi.firebaseapp.com',
    databaseURL: 'https://ca-next-tokyo-taxi.firebaseio.com',
    projectId: 'ca-next-tokyo-taxi',
    storageBucket: 'ca-next-tokyo-taxi.appspot.com',
    messagingSenderId: '742474698382',
    appId: '1:742474698382:web:9f4cec76f929cc98'
  },
  google: {
    clientId: '742474698382-cuifs2l08rrilrpradtjuqmm4mp7u2nr.apps.googleusercontent.com',
    scope: [
      'https://www.googleapis.com/auth/bigquery',
      'https://www.googleapis.com/auth/cloud-platform',
    ].join(' '),
  }
};
