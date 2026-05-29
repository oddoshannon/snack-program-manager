window.SNACK_CONFIG = {
  API_BASE_URL: ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
    ? "http://localhost:8080"
    : "",
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDzwojeeO6N-n38vX3rdKJ2VNV-KZ3dnSE",
    authDomain: "snack-crm.firebaseapp.com",
    projectId: "snack-crm",
    storageBucket: "snack-crm.firebasestorage.app",
    messagingSenderId: "1013266498299",
    appId: "1:1013266498299:web:feaa43bdc41546c78ea65e",
    measurementId: "G-TH1YV1WDSE"
  }
};
