import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function TaskList({
  tasks,
  deleteTask,
  toggleTask,
  editTask,
  setTasks,
  canDrag = true,
}) {
  const handleDragEnd = async (result) => {
    if (!result.destination || !canDrag) return;

    const newTasks = Array.from(tasks); // copia del array
    const [movedTask] = newTasks.splice(result.source.index, 1); // elimina
    newTasks.splice(result.destination.index, 0, movedTask); // inserta

    setTasks(newTasks); // actualiza estado

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/tasks/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tasks: newTasks }),
      });

      if (!response.ok) {
        throw new Error(" No se pudo guardar el orden");
      }
    } catch (error) {
      console.error("Error guardando orden", error);
    }
  };

  return (
    <>
      {!canDrag && tasks.length > 1 && (
        <p className="drag-info">
          Para reordenar tareas, cambia el filtro a <strong>Todas</strong>
        </p>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable
                  key={task._id}
                  draggableId={task._id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskItem
                        task={task}
                        deleteTask={deleteTask}
                        toggleTask={toggleTask}
                        editTask={editTask}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
export default TaskList;
