let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const subjectInput = document.getElementById("subjectInput");
  const dateInput = document.getElementById("dateInput");

  const title = taskInput.value.trim();
  const subject = subjectInput.value;
  const date = dateInput.value;

  if (title === "") {
    alert("Please enter a study task!");
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    subject: subject || "General",
    date: date || "No date",
    completed: false
  };

  tasks.push(task);

  taskInput.value = "";
  subjectInput.value = "";
  dateInput.value = "";

  displayTasks();
}

function displayTasks() {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach(function(task) {
    const div = document.createElement("div");

    div.className = "task";

    if (task.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>📚 ${task.subject}</p>
      <p>📅 ${task.date}</p>

      <button onclick="completeTask(${task.id})">
        ${task.completed ? "↩️ Undo" : "✅ Complete"}
      </button>

      <button onclick="deleteTask(${task.id})">
        🗑️ Delete
      </button>
    `;

    taskList.appendChild(div);
  });

  updateStats();
}

function completeTask(id) {
  const task = tasks.find(function(task) {
    return task.id === id;
  });

  if (task) {
    task.completed = !task.completed;
  }

  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  displayTasks();
}

function updateStats() {
  const total = tasks.length;

  const completed = tasks.filter(function(task) {
    return task.completed;
  }).length;

  const pending = total - completed;

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = pending;
}

displayTasks();
