import { initialApp } from 'firebase/app';
import { getFirestone, collection, getDocs } from 'firebase/firestore';
const firebaseConfig = {
    apikey: 'AIzaSyCIdlkx7Dn3EaZvYpJXhGOgcK62tqVQQd0',
    authDomain: 'masakhane-103e1.firebaseapp.com',
    projectId: 'masakhane-103e1'
};
const app = initializeApp(firebaseconfig);
const db = getFiredtore(app);
async function fetchProfiles() {
    const querySnapshot = await getDocs(collection(db, 'profiles'));
    querySnapshot.forEach(doc => console.log(doc.data));
}
fetchProfiles();