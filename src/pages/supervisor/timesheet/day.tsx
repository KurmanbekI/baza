import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Sidebar.module.css";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";

export default function TimesheetDayPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    if (!selectedDate) return;

    axios
      .get(`http://localhost:3001/timesheet/day?date=${selectedDate}`)
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]));
  }, [selectedDate]);

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
          <li onClick={() => router.push("/supervisor/timesheet/add")}>Добавить табель</li>
          <li onClick={() => router.push("/supervisor/timesheet/month")}>Табель за месяц</li>
          <li onClick={() => router.push("/supervisor/timesheet/day")} style={{ fontWeight: "bold" }}>
            Табель за день
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.datePicker}
        />

        {records.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Имя Фамилия</th>
                <th>Время прихода</th>
                <th>Время ухода</th>
                <th>Задания за день</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.start_time}</td>
                  <td>{item.end_time}</td>
                  <td>
                    <ul>
                      {item.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}