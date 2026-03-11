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

const todoListEl = document.getElementById("todo-list");
const todoFormEl = document.getElementById("todo-form");
const todoInputEl = document.getElementById("todo-input");

// (1) 조회기능
const getTodos = async () => {
  // 1. 서버로부터 3개의 투두리스트를 가지고 오는걸
  const res = await fetch(BASE_URL);
  const todos = await res.json();

  // 2. 가지고 온 데이터(여러개)를 가지고 for문
  todos.forEach(function (todo) {
    // li태그!!! > createElement
    const li = document.createElement("li");

    // span태그를 만들어서 li태그 안으로 넣을께요!
    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;

    // 토글링 버튼
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.completed ? "완료됨" : "미완료";
    toggleBtn.addEventListener("click", function () {
      toggleTodo(todo);
    });

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo);
    });

    // li 태그 안으로 요소들을 넣기
    li.appendChild(titleSpan);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);

    // 완성된 li태그 ul태그에 넣을께요.
    todoListEl.appendChild(li);
  });
};

const toggleTodo = async (todo) => {
  await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: !todo.completed,
    }),
  });

  getTodos();
};

const deleteTodo = async (todo) => {
  await fetch(`${BASE_URL}/${todo.id}`, {
    method: "DELETE",
  });

  getTodos();
};

const addTodo = async (e) => {
  e.preventDefault();

  try {
    // 그 텍스트를 fetch post 해줘
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todoInputEl.value,
        completed: false,
      }),
    });

    getTodos();
  } catch (error) {
    console.log("오류가 발생했습니다...!! 고객센터로 연락주세요~~~~~~");
  }
};

todoFormEl.addEventListener("submit", addTodo);

getTodos();
