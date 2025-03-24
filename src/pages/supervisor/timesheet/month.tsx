import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Sidebar.module.css";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";

export default function TimesheetMonthPage() {
  const router = useRouter();
  const [months, setMonths] = useState([]);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    axios.get("http://localhost:3001/timesheet/months").then((res) => setMonths(res.data));
  }, []);

  const fetchData = async (month) => {
    setSelected(month);
    const res = await axios.get(`http://localhost:3001/timesheet/month?month=${month}`);
    setData(res.data);
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
          <li onClick={() => router.push("/supervisor/timesheet/add")}>Добавить табель</li>
          <li onClick={() => router.push("/supervisor/timesheet/month")} style={{ fontWeight: "bold" }}>
            Табель за месяц
          </li>
          <li onClick={() => router.push("/supervisor/timesheet/day")}>Табель за день</li>
        </ul>
      </div>

      <div className={styles.content}>
        <h2>Выберите месяц:</h2>
        <ul>
          {months.map((m, i) => (
            <li
              key={i}
              style={{ cursor: "pointer", color: selected === m ? "green" : "black" }}
              onClick={() => fetchData(m)}
            >
              {m}
            </li>
          ))}
        </ul>

        {data.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Имя Фамилия</th>
                <th>Количество дней</th>
                <th>Пропуски</th>
                <th>Общее время</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.days}</td>
                  <td>{item.absences}</td>
                  <td>{item.total_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
