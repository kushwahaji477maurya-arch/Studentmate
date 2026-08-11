const quiz = [
  {
    q: "What does HTML mainly define?",
    o: ["Web structure", "Database", "Operating system", "Internet speed"],
    a: 0
  },
  {
    q: "Which language is mainly used for web page styling?",
    o: ["CSS", "Python", "SQL", "C"],
    a: 0
  },
  {
    q: "Which is a renewable energy source?",
    o: ["Coal", "Solar", "Petrol", "Natural gas"],
    a: 1
  },
  {
    q: "What does CPU stand for?",
    o: [
      "Central Processing Unit",
      "Computer Personal User",
      "Core Program Utility",
      "Central Power Unit"
    ],
    a: 0
  }
];

let quizIndex = 0;
let quizPoints = Number(localStorage.getItem("quizPoints") || 0);
let examPoints = Number(localStorage.getItem("examPoints") || 0);

let groups = JSON.parse(localStorage.getItem("groups") || "[]");
let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");

function get(id) {
  return document.getElementById(id);
}

/* ---------- NAVIGATION ---------- */

function showSection(id) {
  document.querySelectorAll(".section").forEach(function(section) {
    section.classList.remove("active");
  });

  get(id).classList.add("active");
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-section]").forEach(function(button) {
  button.onclick = function() {
    showSection(button.dataset.section);
  };
});

document.querySelectorAll("[data-go]").forEach(function(button) {
  button.onclick = function() {
    showSection(button.dataset.go);
  };
});

/* ---------- QUIZ ---------- */

function showQuiz() {
  const question = quiz[quizIndex];

  get("quizQuestion").textContent =
    (quizIndex + 1) + ". " + question.q;

  get("quizOptions").innerHTML = question.o
    .map(function(option, index) {
      return `
        <button onclick="answerQuiz(${index})">
          ${option}
        </button>
      `;
    })
    .join("");

  get("quizResult").textContent = "";
}

function answerQuiz(index) {
  const question = quiz[quizIndex];
  const buttons = document.querySelectorAll("#quizOptions button");

  buttons.forEach(function(button, i) {
    button.disabled = true;

    if (i === question.a) {
      button.classList.add("correct");
    }

    if (i === index && i !== question.a) {
      button.classList.add("wrong");
    }
  });

  if (index === question.a) {
    quizPoints += 10;

    localStorage.setItem(
      "quizPoints",
      quizPoints
    );

    get("quizResult").textContent =
      "✅ Correct! +10 points";
  } else {
    get("quizResult").textContent =
      "❌ Not correct. Try the next question!";
  }

  updateDashboard();
}

get("nextQuiz").onclick = function() {
  quizIndex++;

  if (quizIndex >= quiz.length) {
    quizIndex = 0;
  }

  showQuiz();
};

/* ---------- EXAM ---------- */

const examQuestions = [
  {
    q: "Which tag creates a paragraph in HTML?",
    o: ["<p>", "<h1>", "<img>"],
    a: 0
  },
  {
    q: "Which one is a programming language?",
    o: ["HTML", "Python", "CSS"],
    a: 1
  },
  {
    q: "What is 2 + 8 × 2?",
    o: ["20", "18", "12"],
    a: 1
  }
];

let examIndex = 0;
let examCorrect = 0;
let examStarted = false;
let timerId = null;

function showExamQuestion() {
  const question = examQuestions[examIndex];

  get("examArea").innerHTML = `
    <h3>${examIndex + 1}. ${question.q}</h3>

    ${question.o
      .map(function(option, index) {
        return `
          <button
            class="primary"
            style="display:block;width:100%"
            onclick="answerExam(${index})">
            ${option}
          </button>
        `;
      })
      .join("")}
  `;
}

function answerExam(index) {
  if (!examStarted) return;

  if (index === examQuestions[examIndex].a) {
    examCorrect++;
  }

  examIndex++;

  if (examIndex < examQuestions.length) {
    showExamQuestion();
  } else {
    finishExam();
  }
}

function finishExam() {
  clearInterval(timerId);

  examStarted = false;

  examPoints += examCorrect * 10;

  localStorage.setItem(
    "examPoints",
    examPoints
  );

  get("examResult").textContent =
    "🎉 Exam finished! Score: " +
    examCorrect +
    "/" +
    examQuestions.length;

  get("examArea").innerHTML = "";

  updateDashboard();
}

get("startExam").onclick = function() {
  examIndex = 0;
  examCorrect = 0;
  examStarted = true;

  get("examResult").textContent = "";

  let time = 60;

  get("timer").textContent = time;

  showExamQuestion();

  clearInterval(timerId);

  timerId = setInterval(function() {
    time--;

    get("timer").textContent = time;

    if (time <= 0) {
      finishExam();
    }
  }, 1000);
};

/* ---------- VIDEO CLASS ---------- */

get("joinMeeting").onclick = function() {
  const link = get("meetingLink").value.trim();

  if (!/^https?:\/\//i.test(link)) {
    alert("Please enter a valid meeting link starting with https://");
    return;
  }

  window.open(link, "_blank");
};

/* ---------- GROUPS ---------- */

function renderGroups() {
  if (groups.length === 0) {
    get("groupList").innerHTML =
      "<div class='card'>No groups yet.</div>";

    return;
  }

  get("groupList").innerHTML = groups
    .map(function(group, index) {
      return `
        <div class="item">
          <b>👥 ${escapeHTML(group)}</b>
          <br>

          <button
            class="primary"
            onclick="deleteGroup(${index})">
            Remove
          </button>
        </div>
      `;
    })
    .join("");
}

get("addGroup").onclick = function() {
  const name = get("groupName").value.trim();

  if (!name) {
    alert("Please enter a group name.");
    return;
  }

  groups.push(name);

  localStorage.setItem(
    "groups",
    JSON.stringify(groups)
  );

  get("groupName").value = "";

  renderGroups();
  updateDashboard();
};

function deleteGroup(index) {
  groups.splice(index, 1);

  localStorage.setItem(
    "groups",
    JSON.stringify(groups)
  );

  renderGroups();
  updateDashboard();
}

/* ---------- CONTACTS ---------- */

function renderContacts() {
  if (contacts.length === 0) {
    get("contactList").innerHTML =
      "<div class='card'>No contacts yet.</div>";

    return;
  }

  get("contactList").innerHTML = contacts
    .map(function(contact, index) {
      return `
        <div class="item">
          <b>👤 ${escapeHTML(contact.name)}</b>
          <br>
          ${escapeHTML(contact.info)}
          <br>

          <button
            class="primary"
            onclick="deleteContact(${index})">
            Remove
          </button>
        </div>
      `;
    })
    .join("");
}

get("addContact").onclick = function() {
  const name = get("contactName").value.trim();
  const info = get("contactInfo").value.trim();

  if (!name || !info) {
    alert("Please enter name and contact information.");
    return;
  }

  contacts.push({
    name: name,
    info: info
  });

  localStorage.setItem(
    "contacts",
    JSON.stringify(contacts)
  );

  get("contactName").value = "";
  get("contactInfo").value = "";

  renderContacts();
};

function deleteContact(index) {
  contacts.splice(index, 1);

  localStorage.setItem(
    "contacts",
    JSON.stringify(contacts)
  );

  renderContacts();
}

/* ---------- SECURITY ---------- */

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function(character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character];
  });
}

/* ---------- DASHBOARD ---------- */

function updateDashboard() {
  get("quizScore").textContent = quizPoints;
  get("examScore").textContent = examPoints;
  get("groupsCount").textContent = groups.length;
}

/* ---------- DARK MODE ---------- */

get("themeBtn").onclick = function() {
  document.body.classList.toggle("dark");
};

/* ---------- START APP ---------- */

showQuiz();
renderGroups();
renderContacts();
updateDashboard();
