import React from "react";

interface SaveButtonProps {
    count: number;
    selectedDate: Date | null;
    onSave: (count: number, selectedDate: Date) => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
    count,
    selectedDate,
    onSave,
}) => {
    const handleClick = () => {
        if (selectedDate !== null) {
            onSave(count, selectedDate);
        } else {
            // Handle error: No date selected
        }
    };

    return <button onClick={handleClick}>Save Count</button>;
};

export default SaveButton;
