const btnAdd = document.querySelector('#form_btnAdd')
const inputTask = document.querySelector('#form_input')
const form = document.querySelector('.form')
const taskListResult = document.querySelector('#taskList')
const searchTask = document.querySelector('.search_task')
const statesFilter = document.querySelector('#states')

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

    const filteredTasks = taskArr.filter((task) =>
      task.taskName.includes(taskSearchInput)
    )
    mostrarTareas(filteredTasks)

    // const existTask = taskArr.some((task) => task.taskName === taskSearchInput)

    // if (existTask) {
    //   taskArr = taskArr.filter((task) => task.taskName === taskSearchInput)
    // } else {
    //   taskArr = JSON.parse(localStorage.getItem('localTask'))
    // }
    armarHTML()
  }
})

statesFilter.addEventListener('', filterState)

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
  }

  armarHTML()
}

function armarHTML() {
  taskListResult.innerHTML = ''

  if (taskArr.length > 0) {
    searchTask.classList.remove('hide_search')
  } else {
    searchTask.classList.add('hide_search')
  }

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
}

