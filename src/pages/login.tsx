import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!login || !password) {
      setError("Заполните логин и пароль");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        login,
        password,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Перенаправление по роли
        const role = res.data.user.role;

        if (role === "сварщик" || role === "токарь" || role === "лазерщик" || role === "маляр" || role === "сборщик" || role === "разнорабочий" || role === "проектировщик") {
          router.push("/employees");
        } else if (role === "офис-менеджер" || role === "снабженец") {
          router.push("/manager");
        } else if (role === "начальник") {
          router.push("/supervisor");
        } else if (role === "директор") {
          router.push("/director");
        } else {
          setError("Неизвестная роль");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Вход в систему</h2>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleLogin}>Войти</button>
      </div>
    </div>
  );
}