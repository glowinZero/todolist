const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total')
const completedTasks = document.querySelector('#completed')
const remainingTasks = document.querySelector('#remaining')
const main = document.querySelector('#todo-form input')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if(localStorage.getItem('tasks')){
    tasks.map((task) =>{
        createTask(task)
    })
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = main.value 
    if(inputValue == '') {
        return
    }

    const task = {
        id: Math.floor(Math.random() *100),
        name: inputValue, 
        isCompleted: false
    }
    
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)
    todoForm.reset()
    main.focus()
})


function createTask(task) {
    const taskEl = document.createElement('li')
    taskEl.setAttribute('id', task.id)

    if (task.isCompleted) {
        taskEl.classList.add('complete')
    }

    const taskElMarkup = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? 'contenteditable' : ''} > ${task.name}</span>
    </div>
    <button title="Remove the "${task.name}" task" class="remove-task">
        <svg class="svg" xmlns="http://www.w3.org/2000/svg"  
            viewBox="0 0 24 24" 
            width="20px" 
            height="20px">
            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"/>
        </svg>
    </button>
    `

    taskEl.innerHTML = taskElMarkup
    taskEl.querySelector('.remove-task').addEventListener('click', (e) => {
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
    });
    todoList.appendChild(taskEl)
    countTasks()

    const taskNameSpan = taskEl.querySelector('span[contenteditable]');
    if (taskNameSpan) {
    taskNameSpan.addEventListener('input', () => {
        task.name = taskNameSpan.textContent;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });
    }
    
    todoList.appendChild(taskEl);
    countTasks();
}

todoList.addEventListener('input', (e) =>{
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        const taskId = e.target.id;
        updateTask(taskId, e.target);
    }
})

todoList.addEventListener('keydown', (e) => {
    if(e.keyCode === 13) {
        e.preventDefault()
        e.target.blur()
    }
})

function countTasks(){
    const compeltedTasksArray = tasks.filter((task) => {
        return task.isCompleted === true
    })

    totalTasks.textContent = tasks.length
    completedTasks.textContent = compeltedTasksArray.length 
    remainingTasks.textContent = tasks.length - compeltedTasksArray.length
}

function removeTask(taskId){
    tasks = tasks.filter((task) => task.id !== parseInt(taskId))
    localStorage.setItem('tasks', JSON.stringify(tasks))
    document.getElementById(taskId).remove()
    countTasks()
}


function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId)) 
    if(el.hasAttribute('contenteditable')) {
        task.name = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')
        task.isCompleted = !task.isCompleted

        if (task.isCompleted) {
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else {
            span.setAttribute('contenteditable', true)
            parent.classList.remove('complete')
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
    countTasks()
}
