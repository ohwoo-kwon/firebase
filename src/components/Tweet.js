const Tweet = ({ tweetObj, isOwner }) => {
  console.log(isOwner);
  return (
    <div>
      <h4>{tweetObj.text}</h4>
      {isOwner && (
        <>
          <button>Delete</button>
          <button>Edit</button>
        </>
      )}
    </div>
  );
};

export default Tweet;
