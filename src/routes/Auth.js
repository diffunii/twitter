import { authService } from "../fbase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import styles from "./Auth.module.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(authService, email, password);
      } else {
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      const errorMsg = `${error}`.split("(");
      setError(errorMsg[1].slice(0, -2));
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  return (
    <div className={styles.container}>
      <span className={styles.top}>{newAccount ? "회원가입" : "로그인"}</span>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.inputText}
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          className={styles.inputText}
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <span onClick={toggleAccount} className={styles.toggle}>
          {newAccount ? "로그인 화면으로" : "계정 만들기"}
        </span>
        <span className={styles.error}>{error}</span>
        <input
          className={styles.button}
          type="submit"
          value={newAccount ? "계정 만들기" : "로그인하기"}
        />
      </form>

      <button name="google" onClick={onSocialClick} className={styles.button}>
        구글 계정으로 로그인
      </button>
    </div>
  );
};

export default Auth;
