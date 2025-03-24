// components/Sidebar.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";
import styles from "@/styles/Sidebar.module.css";

interface SidebarProps {
  user: { name: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTimesheetMenu, setShowTimesheetMenu] = useState(false);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
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
    </>
  );
}