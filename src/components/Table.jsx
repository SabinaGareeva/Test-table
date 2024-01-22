import React, { useState, useEffect } from "react";
import css from "../components/Table.module.css";
import InputSearch from "./InputSearch";
import { Modal } from "./Modal";

const Table = () => {
  //пользовательские данные, полученные с сервера
  const [users, setUsers] = useState([]);
  // символы набираемые в input
  const [searchQuery, setSearchQuery] = useState("");
  // состояние открытия и закрытия модалки
  const [isOpenModal, setIsOpenModal] = useState(false);
  // id строчки в таблице по которой произошел клик
  const [isIdString, setIsIdString] = useState(null);
  // объект из массива данных , содержащий данные строки таблицы по которой произошел клик
  const [objectInTable, setObjectInTable] = useState(null);
  // значения ширины колонок
  const [columnWidths, setColumnWidth] = useState({
    name: 300,
    age: 150,
    gender: 150,
    phone: 200,
    address: 400,
  });
  // в функцию передается имя столбца, который нужно изменить и новая ширина для этого столбца
  const handleResize = (columnName, newWidth) => {
    // передаем новую ширину, для выбранного столбца
    setColumnWidth((prevWidths) => ({
      ...prevWidths,
      [columnName]: Math.max(50, newWidth),
    }));
    // установлена минимальная ширина столбца
    const th = document.querySelector(`th[data-column="${columnName}"]`);
    if (th) {
      th.style.width = `${Math.max(50, newWidth)}px`;
    }
  };

  const handleMouseDown = (columnName, event) => {
    // начальная координата x нажатия кнопки мыши
    const initialX = event.clientX;
    // текущая ширина столбца, сохраненая перед началом изменения
    const initialWidth = columnWidths[columnName];
    // функция вызываемая при перемещении мыши, вычисляет новую ширину столбца
    const handleMouseMove = (moveEvent) => {
      // разница после перемещения мышкой
      const deltaX = moveEvent.clientX - initialX;
      const newWidth = initialWidth + deltaX;
      handleResize(columnName, newWidth);
    };
    // функция вызываемая при отпускании мыши
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
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery]);
  // Находим объект в массиве по id строки в таблице по которой произошел клик
  useEffect(() => {
    if (isIdString) {
      let clickedObjectInTable = users.find(
        (element) => element.id === isIdString
      );
      setObjectInTable(clickedObjectInTable);
    }
  }, [isIdString, users]);

  return (
    users && (
      <>
        <div>
          <InputSearch onSearch={(query) => setSearchQuery(query)} />
          <table className={css.table}>
            <thead>
              <tr>
                <th
                  className={`th-resizable`}
                  data-column="name"
                  style={{ width: `${columnWidths.name}px` }}
                >
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => {
                      handleMouseDown("name", event);
                    }}
                  >
                    Фамилия Имя Очество
                  </div>
                </th>
                <th
                  className={`th-resizable`}
                  data-column="age"
                  style={{ width: `${columnWidths.age}px` }}
                >
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("age", event)}
                  >
                    Возраст
                  </div>
                </th>
                <th
                  className={`th-resizable`}
                  data-column="gender"
                  style={{ width: `${columnWidths.gender}px` }}
                >
                  <div
                    className={`resize-handle`}
                    onMouseDown={(event) => handleMouseDown("gender", event)}
                  >
                    Пол
                  </div>
                </th>
                <th
                  className={`th-resizable`}
                  data-column="phone"
                  style={{ width: `${columnWidths.phone}px` }}
                >
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
