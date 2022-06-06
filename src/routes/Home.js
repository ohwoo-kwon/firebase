import { dbService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
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
    await addDoc(collection(dbService, "tweets"), {
      text: tweet,
      createdAt: Date.now(),
      uid: userObj.uid,
    });
    setTweet("");
  };
  const onChange = (e) => {
    setTweet(e.target.value);
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
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map(({ text, id }) => (
          <h4 key={id}>{text}</h4>
        ))}
      </div>
    </div>
  );
};

export default Home;
