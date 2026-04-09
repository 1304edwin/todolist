import React, { useState, useEffect } from "react";

function Taskitem({ task, deleteTask, toggleTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  useEffect(() => {
    setEditText(task.text);
  }, [task.text]);

  const handleSave = () => {
    if (editText.trim() === "") return;
    editTask(task._id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };
  return (
    <div className={`task-card ${task.completed ? "task-done" : ""}`}>
      <div className="task-item">
        {isEditing ? (
          <div className="edit-mode">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
            />
            <div className="actions">
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <span className={`task-text ${task.completed ? "completed" : ""}`}>
              {task.text}
            </span>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="actions">
          <button onClick={() => setIsEditing(true)}>Editar</button>

          <button onClick={() => deleteTask(task._id)}>Eliminar</button>
          <button onClick={() => toggleTask(task._id)}>
            {!task.completed ? "Completar" : "Deshacer"}
          </button>
        </div>
      )}
    </div>
  );
}
export default React.memo(Taskitem);
