import React, { useState } from "react";
import {
  FaMale,
  FaFemale,
  FaWeight,
  FaRuler,
  FaRunning,
  FaFire,
} from "react-icons/fa";
import "../css files patient/calorieconverter.css"; // Import the CSS file

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [calories, setCalories] = useState(null);

  const calculateBMR = () => {
    if (!age || !gender || !weight || !height) {
      alert("Please enter all required fields.");
      return;
    }

    let c1, hm, wm, am;
    if (gender === "male") {
      c1 = 66;
      hm = 5.003 * height;
      wm = 13.75 * weight;
      am = 6.755 * age;
    } else {
      c1 = 655.1;
      hm = 1.85 * height;
      wm = 9.563 * weight;
      am = 4.676 * age;
    }

    return c1 + hm + wm - am;
  };

  const calculateCalories = () => {
    const bmr = calculateBMR();
    if (!bmr) return;

    const activityMultipliers = {
      none: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      extreme: 1.9,
    };

    const activityFactor = activityMultipliers[activityLevel] || 1.2;
    let dailyCalories = bmr * activityFactor;

    if (goal === "lose") {
      dailyCalories -= 500;
    } else if (goal === "gain") {
      dailyCalories += 500;
    }

    setCalories(Math.round(dailyCalories));
  };

  return (
    <div className="calorie-body">
      <div className="calorie-container">
        <h2 className="calorie-title">
          <FaFire style={{ color: "orange", marginRight: "8px" }} />
          Calorie Calculator
        </h2>

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="calorie-input"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="calorie-select"
        >
          <option value="">Select Gender</option>
          <option value="male">
            Male <FaMale />
          </option>
          <option value="female">
            Female <FaFemale />
          </option>
        </select>
        <div className="input-wrapper">
          <FaWeight className="icon" />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="calorie-input"
          />
        </div>
        <div className="input-wrapper">
          <FaRuler className="icon" />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="calorie-input"
          />
        </div>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          className="calorie-select"
        >
          <option value="">Select Activity Level</option>
          <option value="none">None</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
          <option value="extreme">Extreme</option>
        </select>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="calorie-select"
        >
          <option value="">Select Goal</option>
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
        </select>
        <button onClick={calculateCalories} className="calorie-button">
          <FaRunning style={{ marginRight: "8px" }} /> Calculate
        </button>
        {calories && (
          <p className="calorie-result">
            Your daily calorie intake should be: {calories} kcal
          </p>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
