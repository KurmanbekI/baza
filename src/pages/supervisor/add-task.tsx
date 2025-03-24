import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import styles from "../../styles/AddTask.module.css";

interface Option {
  value: number;
  label: string;
}

export default function AddTaskPage() {
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Option[]>([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get("http://localhost:3001/employees");
      const opts = res.data.map((emp: any) => ({
        value: emp.id,
        label: emp.name,
      }));
      setOptions(opts);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!description || selectedEmployees.length === 0) return;

    const employeeIds = selectedEmployees.map((e) => e.value);

    await axios.post("http://localhost:3001/tasks/add-multi", {
      description,
      employeeIds,
    });

    setDescription("");
    setSelectedEmployees([]);
    setSuccess("Задание успешно добавлено!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className={styles.container}>
      <h2>Добавить задание сотрудникам</h2>
      <textarea
        className={styles.textarea}
        placeholder="Описание задания"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select
        className={styles.select}
        options={options}
        isMulti
        placeholder="Выберите сотрудников"
        value={selectedEmployees}
        onChange={(selected) => setSelectedEmployees(selected as Option[])}
      />
      <button className={styles.button} onClick={handleSubmit}>
        Подтвердить
      </button>
      {success && <p className={styles.success}>{success}</p>}
    </div>
  );
}