import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Employees.module.css";

interface Task {
  id: number;
  title: string;
  description: string;
  is_running: boolean;
  is_paused: boolean;
  start_time: string | null;
  end_time: string | null;
}

export default function EmployeesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return;

    setEmployeeId(user.id);

    axios
      .get(`http://localhost:3001/tasks/by-employee/${user.id}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Ошибка загрузки задач:", err));
  }, []);

  const handleAction = async (taskId: number, action: "start" | "pause" | "stop") => {
    try {
      await axios.post(`http://localhost:3001/tasks/${action}`, { taskId });
      const res = await axios.get(`http://localhost:3001/tasks/by-employee/${employeeId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Ошибка обновления задачи:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Ваши задачи</h2>
      {tasks.length === 0 && <p className={styles.empty}>На сегодня задач нет.</p>}
      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.taskCard}>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <p>
              Статус:{" "}
              <span>
                {task.is_running
                  ? "В работе"
                  : task.is_paused
                  ? "На паузе"
                  : task.end_time
                  ? "Завершено"
                  : "Ожидание"}
              </span>
            </p>
            <div className={styles.actions}>
              <button onClick={() => handleAction(task.id, "start")} className={styles.start}>
                Старт
              </button>
              <button onClick={() => handleAction(task.id, "pause")} className={styles.pause}>
                Пауза
              </button>
              <button onClick={() => handleAction(task.id, "stop")} className={styles.stop}>
                Стоп
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}