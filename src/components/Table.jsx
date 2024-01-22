import React, { useState, useEffect } from "react";
import css from "../components/Table.module.css";
import InputSearch from "./InputSearch";
import { Modal } from "./Modal";


const Table = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isIdString, setIsIdString] = useState(null);
  const [objectInTable, setObjectInTable] = useState(null);
  const [columnWidths, setColumnWidth] = useState({
    name: 300,
    age: 150,
    gender: 150,
    phone: 300,
    address: 300,
  });
  const handleResize = (columnName, newWidth) => {
    setColumnWidth((prevWidths) => ({
      ...prevWidths,
      [columnName]: Math.max(50, newWidth),
    }));
    const th = document.querySelector(`th[data-column="${columnName}"]`);
    if (th) {
      th.style.width = `${Math.max(50, newWidth)}px`;
    }
  };
  const handleMouseDown = (columnName, event) => {
    const initialX = event.clientX;
    const initialWidth = columnWidths[columnName];

    const handleMouseMove = (moveEvent) => {
      // const columnName = moveEvent.target.dataset.column;
      // if (columnName) {
      const deltaX = moveEvent.clientX - initialX;
      const newWidth = initialWidth + deltaX;
      handleResize(columnName, newWidth);
      // }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
// Получение данных с сервера и поиск 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/users/search?q=${searchQuery}`
        );
        const data = await response.json();
        setUsers(
          // (prevUsers) => [...prevUsers, ...data.users]
          data.users
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery]);
  // нахожу объект в массиве по id строчки по которой кликнуди
  useEffect(() => {
    if (isIdString) {
      let myObjectInTable = users.find((element) => element.id === isIdString);
      setObjectInTable(myObjectInTable);
    }
  }, [isIdString, users]);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch("https://dummyjson.com/users");
  //         const data = await response.json();
  //         setUsers(data.users);
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []);
  return (
    users && (
      <>
        <div>
          <InputSearch onSearch={(query) => setSearchQuery(query)} />
          <table className={css.table}>
            <thead>
              <tr>
                <th className={`th-resizable`} data-column="name">
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => {
                      handleMouseDown("name", event);
                      
                    }}
                  >
                    Фамилия Имя Очество
                  </div>
                </th>
                <th className={`th-resizable`} data-column="age">
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("age", event)}
                  >
                    Возраст
                  </div>
                </th>
                <th className={`th-resizable`} data-column="gender">
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("gender", event)}
                  >
                    Пол
                  </div>
                </th>
                <th className={`th-resizable`} data-column="phone">
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("phone", event)}
                  >
                    Номер телефона
                  </div>
                </th>
                <th className={`th-resizable`} data-column="address">
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("address", event)}
                  >
                    Адрес(город и название улицы)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  id={user.id}
                  onClick={(event) => {
                    setIsOpenModal(true);
                    setIsIdString(Number(event.currentTarget.id));
                    console.log(typeof isIdString);
                  }}
                >
                  <td>
                    {user.lastName} {user.firstName} {user.maidenName}
                  </td>
                  <td>{user.age.toString()}</td>
                  <td>{user.gender}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.address.city}, {user.address.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          objectInTable={objectInTable}
        ></Modal>

      </>
    )
  );
};
export default Table;
