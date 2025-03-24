import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EmployeeTasks.module.css";

interface Task {
  id: number;
  title: string;
  is_running: boolean;
  is_paused: boolean;
  start_time: string | null;
  end_time: string | null;
}

export default function EmployeeTasksPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/tasks/by-employee/${id}`);
        setTasks(res.data.tasks);
        setEmployeeName(res.data.employeeName);
      } catch (error) {
        console.error("Ошибка загрузки задач:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      <h2>Задачи сотрудника: {employeeName}</h2>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            <div className={styles.title}>{task.title}</div>
            <div className={task.end_time ? styles.done : styles.pending}>
              {task.end_time ? "Выполнено" : "Не выполнено"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
