import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "../components/Modal.module.css";

export const Modal = ({ isOpen, onClose, objectInTable }) => {
  /* Обработка закрытия модалки по клику на х */
  const handleClose = () => onClose();

  // Создаем ссылку на Dom-элемент модального окна
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Проверяем, был ли клик вне модального окна
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Закрываем модалку
        onClose();
      }
    };

    // Если модально окно открыто и код выполняется на клиенте
    if (isOpen && typeof window !== "undefined") {
      // Добавляем слушатель события mousedown для закрытия модалки по клику вне
      document.addEventListener("mousedown", handleOutsideClick);
    }

    // Очищаем слушатель события при размонтировании компонента или при закрытии
    return () => {
      // Если  модальное окно открыто и код выполняется на клиенте
      if (isOpen && typeof window !== "undefined") {
        // Добавляем слушатель события mousedown для закрытия модалки по клику вне
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };
  }, [isOpen, onClose]);

  return (
    isOpen &&
    createPortal(
      <div
        className={css.background__modal}
      >
        <div
          ref={modalRef}
          className={css.modal}
        >
          <header className={css.modal__header}>
            <h2 className={css.modal__title}>Дополнительная информация</h2>
            <button
              onClick={handleClose}
              className={css.modal__button}
            >
              X
            </button>
          </header>
          <main>
            <ul>
              <li>
                ФИО: {objectInTable?.lastName} {objectInTable?.firstName}{" "}
                {objectInTable?.maidenName}
              </li>
              <li>Возраст: {objectInTable?.age}</li>
              <li>
                Адрес (город и название улицы): {objectInTable?.address?.city}{" "}
                {objectInTable?.address?.address}
              </li>
              <li>Рост: {objectInTable?.height}</li>
              <li>Вес: {objectInTable?.weight}</li>
              <li>Номер телефона: {objectInTable?.phone}</li>
              <li>Email: {objectInTable?.email}</li>
            </ul>
          </main>
        
          <footer className={css.modal__footer}></footer>
        </div>
      </div>,
      document.body
    )
  );
};
