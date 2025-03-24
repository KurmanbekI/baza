import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Sidebar.module.css";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";

export default function TimesheetAddPage() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [timesheet, setTimesheet] = useState({});
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get("http://localhost:3001/employees");
      setEmployees(res.data);
    };
    fetchEmployees();
  }, []);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  const handleChange = (id, field, value) => {
    setTimesheet((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!date) return setMessage("Выберите дату");

    try {
      await axios.post("http://localhost:3001/timesheet/add", {
        date,
        data: timesheet,
      });
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
          <li onClick={() => router.push("/supervisor")}>Главная</li>
          <li onClick={() => router.push("/supervisor/timesheet/add")} style={{ fontWeight: "bold" }}>
            Добавить табель
          </li>
          <li onClick={() => router.push("/supervisor/timesheet/month")}>Табель за месяц</li>
          <li onClick={() => router.push("/supervisor/timesheet/day")}>Табель за день</li>
        </ul>
      </div>

      <div className={styles.content}>
        <h2>Табель</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={styles.datePicker}
        />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя и Фамилия</th>
              <th>Время прихода</th>
              <th>Время ухода</th>
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
        <p>{message}</p>
      </div>
    </div>
  );
}