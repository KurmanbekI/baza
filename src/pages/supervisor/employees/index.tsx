// src/pages/supervisor/employees/index.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './Employees.module.css';

interface Task {
  id: number;
  title: string;
  is_running: boolean;
  employee_name: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:3001/supervisor/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Ошибка при получении сотрудников:', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleClick = (id: number) => {
    router.push(`/supervisor/employees/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1>Список сотрудников</h1>
      <ul className={styles.list}>
        {employees.map((emp) => (
          <li key={emp.id} className={styles.card} onClick={() => handleClick(emp.id)}>
            <strong>{emp.name}</strong>
            <p>Текущая задача: {emp.current_task || '—'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
