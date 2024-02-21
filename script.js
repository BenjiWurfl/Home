import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
    getCountFromServer,
    query,
    limit,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe7d9bllq8RnmI6xxEBk3oub3qogPT2aM",
    authDomain: "thinkwise-c7673.firebaseapp.com",
    databaseURL: "https://thinkwise-c7673-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "thinkwise-c7673",
    storageBucket: "thinkwise-c7673.appspot.com",
    messagingSenderId: "37732571551",
    appId: "1:37732571551:web:9b90a849ac5454f33a85aa",
    measurementId: "G-8957WM4SB7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
let currentUser;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadDashboardData();
    } else {
        console.log("No user is signed in.");
    }
});

const amountOfProjects = document.querySelector('.num-of-Projects');
const amountOfAppointments = document.querySelector('.num-of-Appointments');
const amountOfMindmaps = document.querySelector('.num-of-Mindmaps');

const projectsRef = collection(db, "users", currentUser.uid, "projects");
const eventsRef = collection(db, "users", currentUser.uid, "events");
const mindmapsRef = collection(db, "users", currentUser.uid, "mindmaps");

let projectsArr =  [];
let eventsArr = [];
let mindmapsArr = [];

const tbodyOfProjects = document.querySelector('.tbody-projects')
const tbodyOfEvents= document.querySelector('.tbody-events')
const tbodyOfMindmaps= document.querySelector('.tbody-mindmaps')

function loadDashboardData(){
    loadAmounts();
    loadRecentProjectsIntoArrays();
    loadDataIntoDOM();

}

function loadDataIntoDOM(){
    for (let i = 0; i < 3; i++){
        fillTbodyProjects(i);
        fillTbodyEvents(i);
        fillTbodyMindMaps(i);
    }
}

function fillTbodyProjects(index){
    tbodyOfProjects.innerHTML += '<tr>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                        <span class="text-gray-600 text-sm font-medium ml-2 truncate">' + projectsArr[index].title + '</span>\n' +
        '                                </td>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                    <span class="text-[13px] font-medium text-gray-400">' + projectsArr[index].dueDate + '</span>\n' +
        '                                </td>\n' +
        '                            </tr>'
}

function fillTbodyEvents(index){
    tbodyOfEvents.innerHTML += '<tr>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                        <span class="text-gray-600 text-sm font-medium ml-2 truncate">' + eventsArr[index].title + '</span>\n' +
        '                                </td>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                    <span class="text-[13px] font-medium text-gray-400">' + eventsArr[index].date + '</span>\n' +
        '                                </td>\n' +
        '                            </tr>'
}

function fillTbodyMindMaps(index){
    tbodyOfMindmaps.innerHTML += '<tr>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                        <span class="text-gray-600 text-sm font-medium ml-2 truncate">' + mindmapsArr[index].name + '</span>\n' +
        '                                </td>\n' +
        '                                <td class="py-2 px-4 border-b border-b-gray-50">\n' +
        '                                    <span class="text-[13px] font-medium text-gray-400"></span>\n' +
        '                                </td>\n' +
        '                            </tr>'
}

function loadRecentProjectsIntoArrays() {
    const user = auth.currentUser;

    getDocs(projectsRef.orderBy("dueDate", "desc").limit(3))
        .then(querySnapshot => {
            projectsArr = []; // Clear the projects array before populating it again
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                let dueDate = projectData.dueDate.toDate();
                const project = { id: doc.id, ...projectData, dueDate: dueDate };
                projectsArr.push(project);
            });
        })
        .catch(error => {
            console.error("Error loading projects: ", error);
        });

    getDocs(eventsRef.where("date", ">", new Date()).orderBy("date", "asc").limit(3))
        .then(querySnapshot => {
            eventsArr = []; // Clear the projects array before populating it again
            querySnapshot.forEach(doc => {
                const eventData = doc.data();
                const event = { id: doc.id, ...eventData };
                eventsArr.push(event);
            });
        })
        .catch(error => {
            console.error("Error loading events: ", error);
        });

    getDocs(mindmapsRef.limit(3))
        .then(querySnapshot => {
            mindmapsArr = []; // Clear the projects array before populating it again
            querySnapshot.forEach(doc => {
                const mindmapData = doc.data();
                const event = { id: doc.id, ...mindmapData };
                mindmapsArr.push(event);
            });
        })
        .catch(error => {
            console.error("Error loading events: ", error);
        });

}

function loadAmounts(){
    const user = auth.currentUser;
    if (user) {

        const projectSnapshot = getCountFromServer(projectsRef);
        amountOfProjects.innerHTML = projectSnapshot.data().count;

        const eventSnapshot = getCountFromServer(eventsRef);
        amountOfAppointments.innerHTML = eventSnapshot.data().count;

        const mindmapSnapshot = getCountFromServer(mindmapsRef);
        amountOfMindmaps.innerHTML = mindmapSnapshot.data().count;
    }

}

//Navbar

const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");


toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

modeSwitch.addEventListener("click" , () =>{
    body.classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        modeText.innerText = "Light mode";
    }else{
        modeText.innerText = "Dark mode";
        
    }
});