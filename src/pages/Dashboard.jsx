import { useState, useCallback, useMemo, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAuthHeaders } from "../utils/getAuthHeaders";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const BASE_URL = "https://todolist-beei.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("${BASE_URL}/tasks", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setTasks(data);
      })
      .catch((error) => console.error("Error cargando tares:", error));
  }, [navigate]);

  const addTask = useCallback(
    (text) => {
      if (text.trim() === "") return;

      const newTask = { text, completed: false };

      fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTask),
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
            return null;
          }
          return res.json();
        })
        .then((taskFromServer) => {
          if (taskFromServer) {
            setTasks((prev) => [taskFromServer, ...prev]);
          }
        })
        .catch((error) => console.error("Error creando tareas", error));
    },
    [navigate],
  );

  const deleteTask = useCallback(
    (id) => {
      fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }).then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
        setTasks((prev) => prev.filter((t) => t._id !== id));
      });
    },
    [navigate],
  );

  const toggleTask = useCallback(
    (id) => {
      const task = tasks.find((t) => t._id === id);
      if (!task) return;

      fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: !task.completed }),
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
            return null;
          }
          return res.json();
        })
        .then((updatedTask) => {
          if (updatedTask) {
            setTasks((prev) =>
              prev.map((t) => (t._id === id ? updatedTask : t)),
            );
          }
        })
        .catch((error) => console.error("Error actualizado tarea", error));
    },
    [tasks, navigate],
  );
  const editTask = useCallback(
    (id, newText) => {
      if (newText.trim() === "") return;

      fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newText }),
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
            return null;
          }
          return res.json();
        })
        .then((updatedTask) => {
          if (updatedTask) {
            setTasks((prev) =>
              prev.map((t) => (t._id === id ? updatedTask : t)),
            );
          }
        })
        .catch((error) => console.error("Error editando tarea", error));
    },
    [setTasks, navigate],
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });
  }, [tasks, filter]);

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="task-card">
          <h1>Tareas Asignadas</h1>
          <div className="filters">
            <button
              className={`button ${filter === "all" ? "active-filter" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            <button
              className={`button ${filter === "completed" ? "active-filter" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completadas
            </button>
            <button
              className={`button ${filter === "pending" ? "active-filter" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pendientes
            </button>
          </div>

          <TaskForm addTask={addTask} />
          <TaskList
            tasks={filteredTasks || []}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            editTask={editTask}
            setTasks={setTasks}
            canDrag={filter === "all"}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
