import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Supervisor.module.css";
import { FaBars } from "react-icons/fa";

export default function SupervisorPage() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [showTimesheetMenu, setShowTimesheetMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, []);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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
          <li>
            <div
              onClick={() => setShowTimesheetMenu(!showTimesheetMenu)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Табель
            </div>
            {showTimesheetMenu && (
              <ul style={{ marginTop: "5px", marginLeft: "15px" }}>
               <li onClick={() => router.push("/supervisor/timesheet/add")}>Добавить табель</li>
<li onClick={() => router.push("/supervisor/timesheet/month")}>Табель за месяц</li>
<li onClick={() => router.push("/supervisor/timesheet/day")}>Табель за день</li>
              </ul>
            )}
          </li>
          <li onClick={() => router.push("/supervisor/add-tasks")}>Добавить задание</li>
          <li onClick={() => router.push("/supervisor/director-tasks")}>Задания от директора</li>
          <li onClick={() => router.push("/supervisor/warehouse")}>Склад</li>
          <li onClick={() => router.push("/supervisor/request")}>Заявка снабженцу</li>
          <li onClick={() => router.push("/supervisor/projects")}>Выполненные проекты</li>
          <li onClick={() => router.push("/supervisor/tools")}>Личные карточки</li>
          <li onClick={() => router.push("/supervisor/hr")}>УЧР</li>
          <li
            onClick={handleLogout}
            style={{ color: "red", marginTop: "20px", cursor: "pointer" }}
          >
            Выйти
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        <h1>Добро пожаловать, {user?.name}</h1>
        <p>
          Вы вошли как: <strong>{user?.role}</strong>
        </p>
        <p>Выберите нужный пункт меню слева.</p>
      </div>
    </div>
  );
}