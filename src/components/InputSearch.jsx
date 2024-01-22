import React, { useState } from "react";
import css from "./InputSearch.module.css";
const InputSearch = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
// функция handleInputChange сохраняет измения в input  и передает в функцию onSearch
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <form 
    >
      <input
        type="text"
        name="search"
        placeholder="Search.."
        className={css.search__input}
        value={searchInput}
        onChange={handleInputChange}
      />
    </form>
  );
};
export default InputSearch;
