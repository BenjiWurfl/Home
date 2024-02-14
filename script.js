document.addEventListener('DOMContentLoaded', function() {
    // Setze den Vornamen des Benutzers
    document.getElementById('user-firstname').textContent = 'Max'; // Beispielname, ersetze dies durch den tatsächlichen Vornamen

    // Beispiel-Daten, diese sollten durch tatsächliche Daten aus Firestore ersetzt werden
    const exampleEvents = ['Termin 1', 'Termin 2', 'Termin 3'];
    const exampleProjects = ['Projekt 1', 'Projekt 2', 'Projekt 3'];
    const exampleMindmaps = ['MindMap 1', 'MindMap 2', 'MindMap 3'];

    // Funktion zum Einfügen von Daten in die Listen
    function populateList(listId, items) {
        const list = document.getElementById(listId);
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }

    // Daten in die Listen einfügen
    populateList('calendar-list', exampleEvents);
    populateList('projects-list', exampleProjects);
    populateList('mindmaps-list', exampleMindmaps);
});

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