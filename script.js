const btnAdd = document.querySelector('#form_btnAdd')
const inputTask = document.querySelector('#form_input')

btnAdd.addEventListener('click', addTask)
inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(e)
})

function addTask(e) {
  e.preventDefault()

  const task = inputTask.value.trim()

  if (!task) return

  console.log(task)
}
