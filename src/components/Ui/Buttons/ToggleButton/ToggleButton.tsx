import { useState } from "react";
import { isShow } from "../../../../lib/navItemsApi"; // Import the isShow API call
import "./ToggleButton.css";

interface ToggleButtonProps {
  itemId: string; // The ID of the item whose isShow status will be toggled
  initialIsShow: boolean; // The initial state of isShow]
  refetch: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  itemId,
  initialIsShow,
  refetch,
}) => {
  const [isOn, setIsOn] = useState(initialIsShow);

  // Handle toggle logic
  const handleToggle = async () => {
    try {
      // Optimistic UI update
      setIsOn((prev) => !prev);

      // Call the API to toggle the isShow status
      await isShow(itemId);

      refetch();
    } catch (error) {
      console.error("Failed to toggle isShow status:", error);
      // Revert the UI state in case of an error
      setIsOn((prev) => !prev);
    }
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        aria-label="Toggle isShow status"
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleButton;
