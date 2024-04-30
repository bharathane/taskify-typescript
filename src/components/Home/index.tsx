import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiConstains } from "../ApiConstains";
import Header from "../Header";
import AppContext from "../../Context/context";
import { ThreeDots } from "react-loader-spinner";

import "./index.css";
import EachTask from "../EachTask";

const Home = () => {
  const [tasksList, setTasksList] = useState([]);
  const [taskIput, setTaskInput] = useState("");
  const [markStatus, setMarkStatus] = useState(true);

  const [tasksStatus, setTasksStatus] = useState(apiConstains.initial);

  // function for get data from server
  const makingApiCall = async () => {
    setTasksStatus(apiConstains.inprogress);
    const url = "https://task-manager-backend-2qah.onrender.com/allTaks";
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    if (response.ok === true) {
      const { allTask } = jsonResponse;
      setTasksList(allTask);
      setTasksStatus(apiConstains.success);
    } else {
      setTasksStatus(apiConstains.failure);
    }
  };

  // useEffect hook for excute makingApicall Function after inital render
  useEffect(() => {
    makingApiCall();
  }, []);

  // To change Task input value
  const onChangeTaskInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  };

  // post a new Task
  const onAddTask = async () => {
    if (taskIput !== "") {
      const postUrl = "https://task-manager-backend-2qah.onrender.com/addTask";
      const jwtToken = Cookies.get("jwt_token");
      const postOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ task: taskIput }),
      };
      await fetch(postUrl, postOptions);

      makingApiCall();
      setTaskInput("");
    } else {
      alert("Please Enter Some Tasks");
    }
  };

  //delete a Task

  const getIdForUpateAndDelete = async (id: number) => {
    const deleteUrl = `https://task-manager-backend-2qah.onrender.com/delete/${id}`;
    const jwtToken = Cookies.get("jwt_token");
    const deleteOption = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    await fetch(deleteUrl, deleteOption);
    makingApiCall();
  };

  // update task

  const updateTask = async (updateId: number, updateInputVal: string) => {
    const updateUrl = `https://task-manager-backend-2qah.onrender.com/update/${updateId}`;
    const jwtToken = Cookies.get("jwt_token");
    const updateOption = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ task: updateInputVal }),
    };

    const resposne = await fetch(updateUrl, updateOption);
    await resposne.json();
  };

  //get id for markdown

  const getIdForMarkdown = async (id: number) => {
    setMarkStatus(!markStatus);
    const UpdateStatusUrl = `https://task-manager-backend-2qah.onrender.com/updateStatus/${id}`;
    const jwtToken = Cookies.get("jwt_token");
    const statusOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ isComplete: markStatus }),
    };
    await fetch(UpdateStatusUrl, statusOptions);
    makingApiCall();
  };
  //type for fovoriteTaskObject

  type favoriteTaskObj = {
    id: number;
    task: string;
    isComplete: string;
  };

  // if api call successfully resolved
  const succesView = () => (
    <AppContext.Consumer>
      {(value) => {
        const { favoriteTasksList, chageFavoriteTaskList } = value;
        //add data into favorite list
        const getIdForFavorite = (id: number) => {
          if (
            !favoriteTasksList.some((obj: favoriteTaskObj) => obj.id === id)
          ) {
            const filterTasks: favoriteTaskObj[] = tasksList.filter(
              (each: favoriteTaskObj) => each.id === id
            );
            chageFavoriteTaskList(filterTasks);
          }
        };

        return (
          <ul className="success-view-container">
            {tasksList.map((each: favoriteTaskObj) => (
              <EachTask
                single={each}
                key={each.id}
                getIdForUpateAndDelete={getIdForUpateAndDelete}
                updateTask={updateTask}
                makingApiCall={makingApiCall}
                getIdForFavorite={getIdForFavorite}
                getIdForMarkdown={getIdForMarkdown}
                isStyled={each.isComplete === "true"}
              />
            ))}
          </ul>
        );
      }}
    </AppContext.Consumer>
  );

  // api call inprogress
  const inprogressView = () => (
    <div className="loader-view">
      <ThreeDots />;
    </div>
  );

  // api call failure based on various reasons
  const FailureView = () => <h1>Something Went Wrong ! Please Try Again.</h1>;

  // based on tasksStatus it will render final view
  const renderFinalVeiw = () => {
    switch (tasksStatus) {
      case apiConstains.success:
        return succesView();
      case apiConstains.failure:
        return FailureView();
      case apiConstains.inprogress:
        return inprogressView();
      default:
        return null;
    }
  };

  const username = localStorage.getItem("username");
  if (username === null) {
    return null;
  }
  const usernameFirst = username[0].toUpperCase();
  return (
    <AppContext.Consumer>
      {(value) => {
        const { theme } = value;
        const DarkThemeBackground = theme ? "dark-theme-background" : "";
        const usePorfileContainerDark = theme
          ? "user-profile-container-dark"
          : "";
        return (
          <div>
            <Header />
            <div
              className={`user-profile-container ${usePorfileContainerDark}`}
            >
              <h1 className="user-profile">{usernameFirst}</h1>

              <h1 className="username-head">
                {localStorage.getItem("username")}
              </h1>
            </div>
            <div className={`input-elements-container ${DarkThemeBackground}`}>
              <div className="input-container">
                <input
                  type="text"
                  className="taskInputElement"
                  placeholder="Add Task Here"
                  onChange={onChangeTaskInput}
                  value={taskIput}
                />
                <button
                  type="button"
                  className="add-task-button"
                  onClick={onAddTask}
                >
                  Add
                </button>
              </div>

              <div>{renderFinalVeiw()}</div>
            </div>
          </div>
        );
      }}
    </AppContext.Consumer>
  );
};
export default Home;
