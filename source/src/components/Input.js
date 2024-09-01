import React from "react";

const Input = ({ props }) => {
  const { id, label, onChange, help } = props;
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input className="form-control" type="text" id={id} onChange={onChange} />
      <span className="">{help}</span>
    </div>
  );
};

export default Input;
