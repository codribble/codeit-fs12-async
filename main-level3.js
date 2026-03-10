const BASE_URL = "http://localhost:4000/todos";

// ============================================
// index.html과 style.css를 참고해서
// 할 일 목록 앱을 완성하세요.
//
// 요구사항:
// - 페이지 로드 시 서버에서 할 일 목록을 불러와 화면에 표시
// - 폼 제출 시 새 할 일을 서버에 추가
// - 토글 버튼 클릭 시 완료 상태를 서버에서 변경
// - 삭제 버튼 클릭 시 서버에서 할 일을 삭제
// ============================================
const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

// 할 일 목록 불러오기
const getTodos = async () => {
  try {
    const response = await fetch(BASE_URL);
    const todos = await response.json();

    todos.forEach((todo) => {
      const item = document.createElement("li");
      item.classList.add("todo-item");
      todo.completed && item.classList.add("completed");

      const title = document.createElement("spna");
      title.classList.add("title");
      title.textContent = todo.title;

      const btnToggle = document.createElement("button");
      btnToggle.classList.add("btn-toggle");
      btnToggle.textContent = todo.completed ? "완료됨" : "미완료";
      btnToggle.addEventListener("click", () => {
        toggleTodo(todo.id, todo.completed);
      });

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-delete");
      btnDelete.textContent = "삭제";
      btnDelete.addEventListener("click", () => {
        deleteTodo(todo.id);
      });

      item.appendChild(title);
      item.appendChild(btnToggle);
      item.appendChild(btnDelete);
      todoList.appendChild(item);
    });

    return todos;
  } catch (error) {
    console.error(error);
  }
};

// 할 일 완료/미완료 toggle
const toggleTodo = async (id, completed) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const originTodo = await response.json();
    const updatedTodo = { ...originTodo, completed: !completed };

    const response2 = await fetch(`${BASE_URL}/${id}`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    const result = await response2.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};

// 할 일 삭제
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
      },
    });
    const deletedTodo = response.json();

    return deletedTodo;
  } catch (error) {
    console.error(error);
  }
};

// 할 일 추가
const addTodo = async (title) => {
  try {
    const todo = {
      title: title,
      completed: false,
    };

    const response = await fetch(BASE_URL, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const addedTodo = await response.json();
    return addedTodo;
  } catch (error) {
    console.error(error);
  }
};

// 할 일 추가
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = todoInput.value;
  if (title === "") return;

  addTodo(title);
  todoInput.value = "";
  todoInput.focus();
});

getTodos();
