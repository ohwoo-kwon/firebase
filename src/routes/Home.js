import Tweet from "components/Tweet";
import { dbService, storageService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "tweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const tweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetArr);
      }
    );
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      uid: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={tweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img
              src={attachment}
              width="50px"
              height="50px"
              alt="profile-img"
            />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweetObj) => (
          <Tweet
            key={tweetObj.id}
            tweetObj={tweetObj}
            isOwner={tweetObj.uid === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
