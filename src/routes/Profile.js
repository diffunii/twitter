import { authService, dbService } from "../fbase";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = ({ refreshUserData, userInfo, msgToken }) => {
  const [newProfileName, setNewProfileName] = useState(userInfo.displayName);
  const [notification, setNotification] = useState(false);

  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onChange = (event) => setNewProfileName(event.target.value);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (newProfileName !== userInfo.displayName) {
      await updateProfile(authService.currentUser, {
        displayName: newProfileName,
      });
      refreshUserData();
    }
  };

  const checkNotification = async () => {
    const prevToken = (
      await getDoc(doc(dbService, "users", userInfo.uid))
    ).data().msgToken;

    if (msgToken === prevToken) {
      setNotification(true);
    } else {
      setNotification(false);
    }
  };

  const onClick = async () => {
    const docRef = doc(dbService, "users", userInfo.uid);
    if (notification) {
      await updateDoc(docRef, {
        msgToken: "",
      });
      setNotification(false);
      alert(
        "알림을 받을 디바이스의 정보가 삭제되었습니다.\n원하는 디바이스에서 알림 설정을 켜 주세요."
      );
    } else {
      await updateDoc(docRef, {
        msgToken: msgToken,
      });
      setNotification(true);
      alert(
        "현재 디바이스에서 알림을 받습니다.\n마지막으로 설정한 디바이스에서만 알림을 받을 수 있습니다."
      );
    }
  };

  useEffect(() => {
    checkNotification();
  });

  return (
    <>
      <div className={styles.profile}>
        <div className={styles.userName}>{userInfo.displayName}님의 프로필</div>
        <span>프로필명 변경</span>
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            type="text"
            value={newProfileName}
            onChange={onChange}
            className={styles.inputText}
            placeholder="최대 30자까지 입력 가능합니다."
            maxLength={30}
            required
          />
          <input type="submit" value="변경" className={styles.confirm} />
        </form>
        <br />
        <span>알림 설정</span>
        <div className={styles.form}>
          <input
            value={
              notification
                ? "이 기기에서 알림을 받습니다."
                : "알림을 받지 않는 기기입니다."
            }
            className={styles.inputText}
            disabled
          />

          <button onClick={onClick} className={styles.confirm}>
            {notification ? (
              <FontAwesomeIcon icon={faBell} size="xl" />
            ) : (
              <FontAwesomeIcon icon={faBellSlash} size="xl" />
            )}
          </button>
        </div>
      </div>

      <button onClick={onLogOutClick} className={styles.logOut}>
        로그아웃
      </button>
    </>
  );
};

export default Profile;
