// src/pages/supervisor/timesheet/add.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/Supervisor.module.css";
import { FaBars } from "react-icons/fa";

export default function TimesheetAddPage() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [timesheet, setTimesheet] = useState({});
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    axios.get("http://localhost:3001/employees").then((res) => setEmployees(res.data));
  }, []);

  const handleChange = (id, field, value) => {
    setTimesheet({
      ...timesheet,
      [id]: {
        ...(timesheet[id] || {}),
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!date) return setMessage("Выберите дату");
    try {
      await axios.post("http://localhost:3001/timesheet/add", { date, timesheet });
      setMessage("Сохранено успешно");
    } catch {
      setMessage("Ошибка сохранения");
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.burger} ${showSidebar ? styles.burgerShifted : ""}`}
        onClick={handleToggleSidebar}
      >
        <FaBars />
      </div>

      <div className={`${styles.sidebar} ${!showSidebar ? styles.sidebarHidden : ""}`}>
        <ul>
          <li onClick={() => router.push("/supervisor/timesheet/add")}>Добавить табель</li>
          <li onClick={() => router.push("/supervisor/timesheet/month")}>Табель за месяц</li>
          <li onClick={() => router.push("/supervisor/timesheet/day")}>Табель за день</li>
          <li onClick={() => router.push("/supervisor/add-tasks")}>Добавить задание</li>
          <li onClick={() => router.push("/supervisor/director-tasks")}>Задания от директора</li>
          <li onClick={() => router.push("/supervisor/warehouse")}>Склад</li>
          <li onClick={() => router.push("/supervisor/request")}>Заявка снабженцу</li>
          <li onClick={() => router.push("/supervisor/projects")}>Выполненные проекты</li>
          <li onClick={() => router.push("/supervisor/tools")}>Личные карточки</li>
          <li onClick={() => router.push("/supervisor/hr")}>УЧР</li>
          <li onClick={handleLogout} style={{ color: "red", marginTop: 20 }}>Выйти</li>
        </ul>
      </div>

      <div className={styles.content}>
        <h2>Добавить табель</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Приход</th>
              <th>Уход</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>
                  <input
                    type="time"
                    value={timesheet[emp.id]?.start || ""}
                    onChange={(e) => handleChange(emp.id, "start", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={timesheet[emp.id]?.end || ""}
                    onChange={(e) => handleChange(emp.id, "end", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}