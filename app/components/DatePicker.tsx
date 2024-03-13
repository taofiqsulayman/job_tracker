import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CustomDatePickerProps = {
    selectedDate: Date,
    handleChange: (date: Date) => void,
}

const CustomDatePicker = ({ selectedDate, handleChange }: CustomDatePickerProps) => {
    const [startDate, setStartDate] = useState(selectedDate);

    const handleDateChange = (date: Date) => {
        setStartDate(date);
        handleChange(date);
    };

    return (
        <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            isClearable
        />
    );
};

export default CustomDatePicker;
