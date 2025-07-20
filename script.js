const btnAdd = document.querySelector('#form_btnAdd')
const inputTask = document.querySelector('#form_input')
const form = document.querySelector('.form')
const taskListResult = document.querySelector('#taskList')

const filters = document.querySelector('.filters')
const searchTask = document.querySelector('.search_task')
const statesFilter = document.querySelector('.states')

const taskCounters = document.querySelector('#task_counters')
let idTaskEdit

let taskArr = getTasksFromStorage()
renderTasks(taskArr)
btnAdd.addEventListener('click', addTask)

inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(e)
})

taskListResult.addEventListener('click', deleteDoneTask)

searchTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const taskSearchInput = searchTask.value
    let searchTasks = getTasksFromStorage()

    const existTask = taskArr.some((task) => task.taskName === taskSearchInput)

    if (existTask) {
      searchTasks = taskArr.filter((task) => task.taskName === taskSearchInput)
    }

    searchTasks = taskArr.filter((task) =>
      task.taskName.toLowerCase().includes(taskSearchInput.toLowerCase())
    )
    renderTasks(searchTasks)
  }
})

statesFilter.addEventListener('change', filterState)

function filterState(e) {
  let allTasks = getTasksFromStorage()

  if (e.target.value === 'all') {
    allTasks = getTasksFromStorage()
  } else if (e.target.value === 'completed') {
    allTasks = taskArr.filter((task) => task.done)
  } else {
    allTasks = taskArr.filter((task) => !task.done)
  }
  renderTasks(allTasks)
}

function addTask(e) {
  const task = inputTask.value.trim()

  if (!task) return

  if (e.target.value === 'Add') {
    console.log('ss')
    const taskObj = {
      taskName: task,
      id: Date.now(),
      done: false,
    }
    taskArr = [...taskArr, taskObj]
    localStorage.setItem('localTask', JSON.stringify(taskArr))
    renderTasks(taskArr)
  } else {
    const taskEdit = taskArr.map((task) => {
      if (task.id === idTaskEdit) {
        task.taskName = inputTask.value
        return task
      } else {
        return task
      }
    })
    btnAdd.value = 'Add'
    localStorage.setItem('localTask', JSON.stringify(taskEdit))
    renderTasks(taskEdit)
  }

  form.reset()
  inputTask.focus()
}

function deleteDoneTask(e) {
  const idTask = Number(e.target.getAttribute('data-id'))

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
  } else if (e.target.classList.contains('task_name')) {
    inputTask.value = e.target.textContent
    btnAdd.value = 'Edit'
    idTaskEdit = Number(e.target.getAttribute('data-id'))
    inputTask.focus()
  }

  renderTasks(taskArr)
}

function renderTasks(arrTasks) {
  taskListResult.innerHTML = ''
  toggleSearchState(arrTasks)

  arrTasks.forEach((task) => {
    const row = document.createElement('tr')
    row.classList.add('tasks')

    if (task.done) {
      row.classList.add('task_done')
    } else {
      row.classList.remove('task_done')
    }

    row.innerHTML = `
      <td class="task task_name" data-id=${task.id}>${task.taskName}</td>
      <td><a href="#" class="task task_button task_button_delete" data-id=${
        task.id
      }>❌</a ></td>
      <td><a href="#" class="task task_button task_button_done" data-id=${
        task.id
      }>${task.done ? '↩️' : '✅'} </a></td>
    `

    taskListResult.appendChild(row)
  })
  updateCounters(arrTasks)
}

function updateCounters(arrTasks) {
  taskCounters.innerHTML = ''

  const allTask = document.createElement('span')
  allTask.textContent = 'All: ' + arrTasks.length
  allTask.classList.add('counter_span')

  const pendingTask = document.createElement('span')
  pendingTask.textContent =
    'Pending: ' + arrTasks.filter((task) => !task.done).length
  pendingTask.classList.add('counter_span')

  const doneTask = document.createElement('span')
  doneTask.textContent = 'Done: ' + arrTasks.filter((task) => task.done).length
  doneTask.classList.add('counter_span')

  taskCounters.appendChild(allTask)
  taskCounters.appendChild(pendingTask)
  taskCounters.appendChild(doneTask)
}

function toggleSearchState(arrTasks) {
  if (arrTasks.length > 0) {
    searchTask.disabled = false
    filters.classList.remove('hide_search')
  } else {
    searchTask.disabled = true
  }
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('localTask')) || []
}