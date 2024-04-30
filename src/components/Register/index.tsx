import { ChangeEvent, FormEvent, useState } from "react";

import { ThreeDots } from "react-loader-spinner";
import { apiConstains } from "../ApiConstains";
import "./index.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [apiStatus, setApiStatu] = useState(apiConstains.initial);

  const onLoginClicked = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiStatu(apiConstains.inprogress);

    const userDetails = { username, name, gender, password };

    const url = "https://task-manager-backend-2qah.onrender.com/register";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok === true) {
      setApiStatu(apiConstains.success);
      window.location.replace("/login");
    } else {
      setApiStatu(apiConstains.failure);
      setUsername("");
      setName("");
      setGender("");
      setPassword("");
      alert(data.errorMessage);
    }
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeGender = (e: ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };
  // render final view based on apiStatus
  const renderLoader = () => {
    switch (apiStatus) {
      case apiConstains.success:
        return null;
      case apiConstains.inprogress:
        return <ThreeDots />;
      case apiConstains.failure:
        return null;
      default:
        return null;
    }
  };
  return (
    <div className="bgCon">
      {renderLoader()}
      <div className="loginCon">
        <div className="imgContainer">
          <img
            src="https://res.cloudinary.com/dr2jqbir9/image/upload/v1710487584/6b6e12d1-ffc5-4efb-8239-9dfd1fde4503_msgob7.png"
            alt="website login"
            className="books-image"
          />
        </div>
        <div className="inputCon">
          <img
            src="https://res.cloudinary.com/dyyexkznb/image/upload/v1647488445/instaShareLogo_wfbdew.png"
            alt="website logo"
          />
          <h1>Taskify</h1>
          <form className="formCon" onSubmit={onLoginClicked}>
            <label htmlFor="userName" className="labelTxt">
              USERNAME
            </label>
            <input
              type="text"
              id="userName"
              className="inputEl"
              onChange={onChangeUsername}
              value={username}
            />

            <label htmlFor="nameOf" className="labelTxt">
              NAME
            </label>
            <input
              type="text"
              id="nameOf"
              className="inputEl"
              onChange={onChangeName}
              value={name}
            />

            <label htmlFor="Gender" className="labelTxt">
              Gender
            </label>
            <input
              type="text"
              id="Gender"
              className="inputEl"
              onChange={onChangeGender}
              value={gender}
            />
            <label htmlFor="password" className="labelTxt">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="inputEl"
              onChange={onChangePassword}
              value={password}
            />
            <button type="submit" className="btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
