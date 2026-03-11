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

      const title = document.createElement("span");
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
    // 대소문자를 가리지 않는다고 해서
    // patch, content-type 으로 소문자로 작성했었는데, 혹시나 해서
    // PATCH, Content-Type 으로 변경해보니 CORS 이슈가 해결되고, PATCH 도 잘 되는 것을 확인
    // const response = await fetch(`${BASE_URL}/${id}`);
    // const originTodo = await response.json();
    // const updatedTodo = { ...originTodo, completed: !completed };

    // const response2 = await fetch(`${BASE_URL}/${id}`, {
    //   method: "put",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(updatedTodo),
    // });
    // const result = await response2.json();

    // return result;
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
  } catch (error) {
    console.error(error);
  }
};

// 할 일 삭제
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    const deletedTodo = response.json();
    getTodos();
  } catch (error) {
    console.error(error);
  }
};

// 할 일 추가
const addTodo = async (title) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
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
