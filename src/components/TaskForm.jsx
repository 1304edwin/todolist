import { useState } from "react";

function TaskForm({ addTask }) {
  const [text, setText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addTask(text);
    setText("");
  };
  return (
    <form onSubmit={handleAdd} className="task-form">
      <input
        type="text"
        placeholder="Escribir una tarea.."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="task-input"
      ></input>
      <button type="submit" className="add-btn" onClick={handleAdd}>
        Agregar
      </button>
    </form>
  );
}
export default TaskForm;
