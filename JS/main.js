document.querySelector(".day-date").textContent =
    new Date().toLocaleDateString('en-us', { weekday: "long", month: "short", day: "numeric" });
// "Friday, Jul 2"

let input = document.querySelector("footer > div");
let mainHolder = document.querySelector("main");
let inputAdd = document.querySelector("#input-task");

let Tasks = [];
getFromLocal();

class TaskTemp {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.status = false;
    }
}

function getFromLocal() {
    Tasks = JSON.parse(window.localStorage.getItem("Tasks")) || [];
    putTasksToMain();
}
function setToLocal() {
    window.localStorage.setItem("Tasks", JSON.stringify(Tasks));
    getFromLocal();
}

function putTasksToMain() {
    mainHolder.innerHTML = '';
    let fragment = document.createDocumentFragment();
    Tasks.forEach(task => {
        fragment.appendChild(createTaskEle(task));
    });
    mainHolder.appendChild(fragment);
}
function createTaskEle({ id, title, status }) {
    let parentDiv = document.createElement("div");
    parentDiv.className = 'task active';

    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", 'checkbox');
    checkBox.setAttribute("title", 'check task status');
    checkBox.setAttribute("value", id);
    status && (checkBox.checked = true);
    status && (parentDiv.classList.add("done"));

    checkBox.addEventListener("click", (e) => {
        e.preventDefault();

        let indd = getIndexOfTasks(id);

        let task = Tasks.splice(indd, 1)[0];
        task.status = !task.status;

        task.status ?
            Tasks.unshift(task) : Tasks.push(task);

        setToLocal();

    })

    let pTitle = document.createElement("p");
    pTitle.textContent = title;

    let img = document.createElement("img");
    img.classList.add("task-delete");
    img.setAttribute("src", "./IMAGE/delete-svgrepo-com.svg");

    img.addEventListener("click", (e) => {
        e.preventDefault();

        let indd = getIndexOfTasks(id);
        Tasks.splice(indd, 1);
        setToLocal();
    })

    parentDiv.appendChild(checkBox);
    parentDiv.appendChild(pTitle);
    parentDiv.appendChild(img);

    return parentDiv;

}
function getIndexOfTasks(taskId) {
    let indd = -1;
    Tasks.some(({ id }, index) => {
        if (id == taskId) {
            indd = index;
            return true;
        }
        return false;
    });
    return indd;
}
document.body.addEventListener("click", (e) => {
    let target = e.target;

    switch (target.id) {
        case 'input-task':
            input.classList.add("active");
            inputContent();
            break;
        case 'prefix-icon':
            input.classList.add("active");
            inputContent();
            break;
        default:
            input.classList.remove("active");
            inputContent();
            break;
    }
    if (inputAdd.value != '') {
        input.classList.add("active");
        inputContent();
    }
}, true);

function inputContent() {
    if (input.classList.contains("active")) {
        input.firstElementChild.setAttribute("src", "./IMAGE/circle-outline-svgrepo-com.svg");
        inputAdd.setAttribute("placeholder", "try typing 'Pay utilities bill by friday 6pm'");
    }
    else {
        input.firstElementChild.setAttribute("src", "./IMAGE/plus-svgrepo-com.svg");
        inputAdd.setAttribute("placeholder", "Add a Task");
    }
}

function addTask(e) {
    if (inputAdd.value == '') {
        return;
    }
    e.preventDefault();

    let task = new TaskTemp(inputAdd.value);
    Tasks.push(task);

    inputAdd.value = '';
    setToLocal();
}
input.lastElementChild.addEventListener("submit", addTask);
input.firstElementChild.addEventListener("click", addTask);