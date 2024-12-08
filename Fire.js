import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    doc, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    updateDoc 
} from "firebase/firestore";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInAnonymously 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDy3Agb9eOlRSR3jgk9PtH4UJOyfUjryBw",
    authDomain: "todolist-1e1a9.firebaseapp.com",
    databaseURL: "https://todolist-1e1a9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todolist-1e1a9",
    storageBucket: "todolist-1e1a9.firebasestorage.app",
    messagingSenderId: "825308473542",
    appId: "1:825308473542:web:7be76ebe54912cbc8a0fc7",
    measurementId: "G-CC3YJ2JJQM",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class Fire {
    constructor(callback) {
        this.init(callback);
    }

    init(callback) {
        // Check if the user is authenticated
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid; // Set the userId when the user is authenticated
                callback(null, user);
            } else {
                // Sign in anonymously if the user is not authenticated
                signInAnonymously(auth)
                    .then(() => {
                        this.userId = auth.currentUser?.uid; // Set the userId after successful sign-in
                        callback(null, auth.currentUser);
                    })
                    .catch((error) => {
                        callback(error);
                    });
            }
        });
    }

    getLists(callback) {
        if (!this.userId) {
            callback(new Error("User is not authenticated"));
            return;
        }

        const ref = query(collection(db, "users", this.userId, "lists"), orderBy("name"));
        this.unsubscribe = onSnapshot(ref, (snapshot) => {
            const lists = [];
            snapshot.forEach((doc) => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Method to add a list to Firestore
    async addList(list) {
        if (!this.userId) {
            throw new Error("User is not authenticated");
        }
        const ref = collection(db, "users", this.userId, "lists");
        await addDoc(ref, list);
    }

    // Method to update a list in Firestore
    async updateList(list) {
        if (!this.userId) {
            throw new Error("User is not authenticated");
        }
        const ref = doc(db, "users", this.userId, "lists", list.id);
        await updateDoc(ref, list);
    }

    // Detach the listener when not needed
    detach() {
        if (typeof this.unsubscribe === "function") {
            this.unsubscribe();
        }
    }
}

export default Fire;
