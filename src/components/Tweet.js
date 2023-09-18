import { dbService, storageService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import styles from "./Tweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [newDate, setNewDate] = useState(Date.now());
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const AttachmentRef = ref(storageService, tweetObj.attachmentUrl);
  const onDeleteClick = async () => {
    const ok = window.confirm("대화를 삭제하시겠어요?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      if (tweetObj.attachmentUrl) {
        await deleteObject(AttachmentRef);
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    setNewTweet(event.target.value);
    setNewDate(Date.now());
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(tweetTextRef, {
      text: newTweet,
      edited: true,
      createdAt: newDate,
    });
    setEditing(false);
  };

  const onLikeClick = async () => {
    if (!isOwner) {
      if (!tweetObj.liked) {
        await updateDoc(tweetTextRef, {
          liked: true,
        });
      } else {
        await updateDoc(tweetTextRef, {
          liked: false,
        });
      }
    }
  };

  return editing ? (
    <form className={styles.editBox} onSubmit={onSubmit}>
      <input
        className={styles.editText}
        type="text"
        value={newTweet}
        placeholder="대화를 수정하세요."
        onChange={onChange}
        maxLength={200}
        required
      />
      <div className={styles.buttonBox}>
        <button
          className={styles.editBtn}
          onClick={toggleEditing}
          type="button"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            style={{ color: "#7a7c7f" }}
          />
        </button>
        <button className={styles.editBtn} onClick={onSubmit} type="submit">
          <FontAwesomeIcon
            icon={faCheck}
            size="lg"
            style={{ color: "#7a7c7f" }}
          />
        </button>
      </div>
    </form>
  ) : (
    <div
      onClick={onLikeClick}
      className={isOwner ? styles.myTweetBox : styles.tweetBox}
    >
      <div>
        <span className={styles.userName}>{tweetObj.name}</span>
        <span className={styles.userName}>
          {new Date(tweetObj.createdAt).getFullYear()}-
          {new Date(tweetObj.createdAt).getMonth() + 1}-
          {new Date(tweetObj.createdAt).getDate()} &nbsp;
          {new Date(tweetObj.createdAt).getHours()}:
          {new Date(tweetObj.createdAt).getMinutes()}:
          {new Date(tweetObj.createdAt).getSeconds()}
          {tweetObj.edited && "(수정됨)"}
        </span>
        {tweetObj.liked && <span className={styles.userName}>❤️</span>}
      </div>

      <div className={styles.tweetContent}>
        {tweetObj.attachmentUrl && (
          <Link to={tweetObj.attachmentUrl}>
            <img
              src={tweetObj.attachmentUrl}
              alt="attachment"
              className={styles.attachmentImg}
            />
          </Link>
        )}
        <span className={styles.tweetText}>{tweetObj.text}</span>

        {isOwner && (
          <div className={styles.buttonBox}>
            <button onClick={onDeleteClick} className={styles.editBtn}>
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                style={{ color: "#7a7c7f" }}
              />
            </button>
            <button onClick={toggleEditing} className={styles.editBtn}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                size="lg"
                style={{ color: "#7a7c7f" }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweet;
