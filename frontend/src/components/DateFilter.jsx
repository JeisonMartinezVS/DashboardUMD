import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateFilter({ from, to, onChangeFrom, onChangeTo }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div>
        <small>Desde</small>
        <DatePicker selected={from} onChange={onChangeFrom} dateFormat="yyyy-MM-dd" />
      </div>
      <div>
        <small>Hasta</small>
        <DatePicker selected={to} onChange={onChangeTo} dateFormat="yyyy-MM-dd" />
      </div>
    </div>
  );
}
