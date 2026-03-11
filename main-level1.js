const BASE_URL = "http://localhost:4000/todos";

// ============================================
// DOM 요소
// ============================================
const todoListEl = document.getElementById("todo-list");
const todoFormEl = document.getElementById("todo-form");
const todoInputEl = document.getElementById("todo-input");

// ============================================
// 화면 그리기 (이미 완성됨 — 수정할 필요 없음)
// ============================================
function renderTodos(todos) {
  todoListEl.innerHTML = "";

  todos.forEach(function (todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");

    const titleSpan = document.createElement("span");
    titleSpan.className = "title";
    titleSpan.textContent = todo.title;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-toggle";
    toggleBtn.textContent = todo.completed ? "완료됨" : "미완료";
    toggleBtn.addEventListener("click", function () {
      toggleTodo(todo.id, todo.completed);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    li.appendChild(titleSpan);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    todoListEl.appendChild(li);
  });
}

// ============================================
// 아래 4개의 함수를 완성하세요.
// 각 함수가 어떤 역할을 하는지는 함수 이름과
// renderTodos, 이벤트 연결 코드를 참고하세요.
// ============================================

// 할 일 목록 불러오기
async function getTodos() {
  try {
    const response = await fetch(BASE_URL);
    const todos = await response.json();
    renderTodos(todos); // try 안에서 호출
    return todos;
  } catch (error) {
    console.error(error);
  }
}

// 새 할 일 추가하기
// 완료 후 getTodos()를 호출해서 화면을 갱신하세요.
async function addTodo(title) {
  try {
    const todo = {
      title: title,
      completed: false,
    };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const newTodo = await response.json();
    getTodos();
    return newTodo;
  } catch (error) {
    console.error(error);
  }
}

// 할 일 완료 토글하기
// 완료 후 getTodos()를 호출해서 화면을 갱신하세요.
async function toggleTodo(id, completed) {
  // 변경된 completed 부분만 patch 로 처리하려고 했으나, 에러가 떠서 찾아보니 cors 이슈 발생
  // get 으로 변경할 데이터를 가져온 후에 spread 연산자를 이용해서 기존 데이터는 유지, 변경된 데이터만 수정을 하고 put 으로 갈아엎는 방향으로 우회 처리
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !completed,
      }),
    });
    const updatedTodo = await response.json();
    getTodos();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// 할 일 삭제하기
// 완료 후 getTodos()를 호출해서 화면을 갱신하세요.
async function deleteTodo(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    const deletedTodos = await response.json();
    getTodos();
    return deletedTodos;
  } catch (error) {
    console.error(error);
  }
}

// ============================================
// 이벤트 연결 (이미 완성됨 — 수정할 필요 없음)
// ============================================
todoFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = todoInputEl.value.trim();
  if (title) {
    addTodo(title);
    todoInputEl.value = "";
  }
});

// 페이지 로드 시 할 일 목록 불러오기
getTodos();
