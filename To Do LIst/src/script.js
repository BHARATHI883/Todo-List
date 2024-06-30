const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = 'all';

showTodos();

function getTodoHtml(todo, index) {
  if ((filter === 'completed' && todo.status !== 'completed') ||
      (filter === 'pending' && todo.status !== 'pending') ||
      (filter === 'important' && !todo.important)) {
    return '';
  }
  
  let checked = todo.status === "completed" ? "checked" : "";
  let isImportant = todo.important ? 'important' : '';

  return /* html */ `
    <li class="todo ${isImportant}">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked ? 'checked' : ''}" contenteditable="true" onblur="saveEdit(this, ${index})">${todo.name}</span>
        <button class="important-btn" onclick="toggleImportant(${index})">
          <i class="fa fa-star${todo.important ? ' gold' : ''}"></i>
        </button>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
      <button class="edit-btn" data-index="${index}" onclick="edit(this)"><i class="fa fa-edit"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending", important: false });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key !== "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function saveEdit(span, index) {
  let newName = span.innerText.trim();
  if (newName !== "") {
    todosJson[index].name = newName;
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
}

function toggleImportant(index) {
  todosJson[index].important = !todosJson[index].important;
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    filters.forEach(tag => tag.classList.remove('active'));
    el.classList.add('active');
    filter = e.target.dataset.filter;
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
