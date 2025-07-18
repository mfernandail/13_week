const btnAdd = document.querySelector('#form_btnAdd')
const inputTask = document.querySelector('#form_input')
const form = document.querySelector('.form')
const taskListResult = document.querySelector('#taskList')

const filters = document.querySelector('.filters')
const searchTask = document.querySelector('.search_task')
const statesFilter = document.querySelector('#states')

const taskCounters = document.querySelector('#task_counters')

let taskArr = JSON.parse(localStorage.getItem('localTask')) || []
armarHTML()
btnAdd.addEventListener('click', addTask)

inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(e)
})

taskListResult.addEventListener('click', deleteDoneTask)

searchTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const taskSearchInput = searchTask.value

    // const filteredTasks = taskArr.filter((task) =>
    //   task.taskName.includes(taskSearchInput)
    // )
    // mostrarTareas(filteredTasks)

    const existTask = taskArr.some((task) => task.taskName === taskSearchInput)

    if (existTask) {
      taskArr = taskArr.filter((task) => task.taskName === taskSearchInput)
    } else {
      taskArr = JSON.parse(localStorage.getItem('localTask'))
    }
    armarHTML()
  }
})

statesFilter.addEventListener('change', filterState)

function filterState(e) {}

function addTask(e) {
  e.preventDefault()

  const task = inputTask.value.trim()

  if (!task) return

  const taskObj = {
    taskName: task,
    id: Date.now(),
    done: false,
  }

  const existTask = taskArr.some((task) => task.taskName === taskObj.taskName)

  //if (existTask) return

  taskArr = [...taskArr, taskObj]

  localStorage.setItem('localTask', JSON.stringify(taskArr))

  form.reset()
  inputTask.focus()

  armarHTML()
  console.log(taskArr)
}

function deleteDoneTask(e) {
  e.preventDefault()
  const idTask = Number(e.target.getAttribute('data-id'))
  console.log(taskArr)

  if (e.target.classList.contains('task_button_delete')) {
    const confirmRes = confirm('Quieres eliminar la tarea?')

    if (confirmRes) {
      taskArr = taskArr.filter((task) => task.id !== idTask)
      localStorage.setItem('localTask', JSON.stringify(taskArr))
    }
  } else if (e.target.classList.contains('task_button_done')) {
    const task = taskArr.map((task) => {
      if (task.id === idTask) {
        task.done = !task.done
      }
      return task
    })

    taskArr = task
    localStorage.setItem('localTask', JSON.stringify(taskArr))
  }

  armarHTML()
}

function armarHTML() {
  taskListResult.innerHTML = ''
  taskCounters.innerHTML = ''

  if (taskArr.length > 0) {
    filters.classList.remove('hide_search')
  } else {
    filters.classList.add('hide_search')
  }

  //const allTask = taskArr.length
  //const pendingTask = taskArr.filter((task) => task.done === false).length
  //const doneTask = taskArr.filter((task) => task.done === true).length

  const allTask = document.createElement('span')
  allTask.textContent = 'All: ' + taskArr.length
  allTask.classList.add('counter_span')

  const pendingTask = document.createElement('span')
  pendingTask.textContent =
    'Pending: ' + taskArr.filter((task) => !task.done).length
  pendingTask.classList.add('counter_span')

  const doneTask = document.createElement('span')
  doneTask.textContent = 'Done: ' + taskArr.filter((task) => task.done).length
  doneTask.classList.add('counter_span')

  taskArr.forEach((task) => {
    const row = document.createElement('tr')
    row.classList.add('tasks')

    if (task.done) {
      row.classList.add('task_done')
    } else {
      row.classList.remove('task_done')
    }

    row.innerHTML = `
      <td class="task task_name">${task.taskName}</td>
      <td><a href="#" class="task task_button task_button_delete" data-id=${
        task.id
      }>❌</a ></td>
      <td><a href="#" class="task task_button task_button_done" data-id=${
        task.id
      }>${task.done ? '↩️' : '✅'} </a></td>
    `

    taskListResult.appendChild(row)
  })

  taskCounters.appendChild(allTask)
  taskCounters.appendChild(pendingTask)
  taskCounters.appendChild(doneTask)
}

