import { dbService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

const Home = () => {
  const [tweet, setTweet] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "tweets"), {
      tweet,
      createdAt: Date.now(),
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
    </div>
  );
};

export default Home;
