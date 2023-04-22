import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import ReactDOM from "react-dom";

type userInfo = { MALUsername: string };
const getSyncStorage = (key: string): Promise<userInfo> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (item: any) => {
      item.hasOwnProperty(key) ? resolve(item) : resolve({ MALUsername: "" });
    });
  });
};
const setSyncStorage = (obj: userInfo): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(obj, () => resolve());
  });
};

const Popup = () => {
  const [MALUsername, setMALUsername] = useState("");
  useEffect(() => {
    getSyncStorage("MALUsername").then(({ MALUsername }) => {
      setMALUsername(MALUsername);
    });
  }, []);
  const handleMALUsername: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setMALUsername(target.value);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSyncStorage({ MALUsername: MALUsername });
  };

  return (
    <>
      <h1></h1>
      <form onSubmit={handleSubmit}>
        <label>
          MAL Username:
          <input
            type="text"
            value={MALUsername}
            onChange={handleMALUsername}
            autoFocus
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
