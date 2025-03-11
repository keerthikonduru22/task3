const questions = [
      {
        question: "Which Indian state is known as the 'Land of Five Rivers'?",
        options: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"],
        answer: "Punjab"
      },
      {
        question: "Which state in India has the highest literacy rate?",
        options: ["Kerala", "Goa", "Tamil Nadu", "Mizoram"],
        answer: "Kerala"
      },
      {
        question: "Which state is famous for its Sundarbans mangrove forest?",
        options: ["West Bengal", "Odisha", "Andhra Pradesh", "Tamil Nadu"],
        answer: "West Bengal"
      },
      {
        question: "Which state is known as the 'Granary of India'?",
        options: ["Punjab", "Haryana", "Madhya Pradesh", "Rajasthan"],
        answer: "Punjab"
      },
      {
        question: "Which Indian state is famous for the Valley of Flowers National Park?",
        options: ["Himachal Pradesh", "Jammu and Kashmir", "Uttarakhand", "Sikkim"],
        answer: "Uttarakhand"
      },
    ];

    // Initialize variables
    let currentIndex = 0; // Start with the first question
    let totalScore = 0; // Track total score
    let correctState = null; // Store the correct state for weather fetching
    const userAnswers = new Array(questions.length).fill(null); // Store user's answers

    // Function to render a question
   function renderQuestion() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = ""; // Clear previous question

  const q = questions[currentIndex];
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  questionDiv.innerHTML = `
    <p>${currentIndex + 1}. ${q.question}</p>
    ${q.options.map((option, index) => `
      <label>
        <input 
          type="radio" 
          name="question" 
          value="${option}" 
          ${userAnswers[currentIndex] === option ? "checked" : ""}
          ${userAnswers[currentIndex] !== null ? "disabled" : ""}
        >
        ${option}
      </label><br>
    `).join('')}
  `;
  quizContainer.appendChild(questionDiv);

  // Clear feedback and hide the weather button
  document.getElementById("result").textContent = "";
  document.getElementById("weatherbtm").style.display = "none";

  // Update button states
  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled = currentIndex === questions.length - 1;

  // Highlight the selected option based on correctness
  if (userAnswers[currentIndex] !== null) {
    const selectedOption = document.querySelector(`input[value="${userAnswers[currentIndex]}"]`);
    if (selectedOption) {
      const label = selectedOption.closest('label') || selectedOption.parentElement;
      if (label) {
        if (userAnswers[currentIndex] === q.answer) {
          label.classList.add("correct-answer"); // Apply green for correct answer
        } else {
          label.classList.add("incorrect-answer"); // Apply red for incorrect answer
        }
      }
    }
  }
}

    // Function to fetch weather data
    async function fetchWeather(city) {
      const apiKey = "4e7f1b3d9812c1293eeb5b4cac705d89"; // Replace with your OpenWeatherMap API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Use metric units for Celsius

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    }

    // Initial render
    renderQuestion();

    // Submit button functionality
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", () => {
      const selectedOption = document.querySelector('input[name="question"]:checked');
      const resultDiv = document.getElementById("result");

      // Validate if an option is selected
      if (!selectedOption) {
        resultDiv.textContent = "Please select an option before proceeding!";
        resultDiv.className = "error";
        return;
      }

      // Store the user's answer
      userAnswers[currentIndex] = selectedOption.value;

      // Check if the selected option is correct
      const stateData = questions[currentIndex];
      if (selectedOption.value === stateData.answer) {
        totalScore++;
        resultDiv.textContent = `Correct! Your score for this question: 1.`;
        resultDiv.className = "correct";
        correctState = stateData.answer; // Store the correct state for weather fetching
        document.getElementById("weatherbtm").style.display = "block"; // Show the weather button
      } else {
        resultDiv.textContent = `Wrong! The correct answer is ${stateData.answer}.`;
        resultDiv.className = "wrong";
        correctState = null; // Reset the correct state
        document.getElementById("weatherbtm").style.display = "none"; // Hide the weather button
      }

      // Check if all questions have been answered
      if (currentIndex === questions.length - 1) {
        setTimeout(() => {
          resultDiv.textContent = `Quiz complete! Your final score is ${totalScore}/${questions.length}. Refresh the page to try again.`;
          resultDiv.className = "lastone"
          submitBtn.disabled = true; // Disable the submit button
          document.getElementById("prevBtn").disabled = true; // Disable the previous button
          document.getElementById("nextBtn").disabled = true; // Disable the next button
        }, 2000); // Show the final score after 2 seconds
      }
    });

    // Previous button functionality
    const prevBtn = document.getElementById("prevBtn");
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    });

    // Next button functionality
    const nextBtn = document.getElementById("nextBtn");
    nextBtn.addEventListener("click", () => {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
      }
    });

    // Weather button functionality
    const weatherBtn = document.getElementById("weatherbtm");
    weatherBtn.addEventListener("click", async () => {
      if (!correctState) {
        alert("No correct state selected to fetch weather.");
        return;
      }

      const resultDiv = document.getElementById("result");
      resultDiv.textContent = `Fetching weather for ${correctState}...`;
      const weatherData = await fetchWeather(correctState);
      if (weatherData) {
        resultDiv.innerHTML += `
          <p>Weather in ${correctState}:</p>
          <p>Temperature: ${weatherData.main.temp}°C</p>
          <p>Condition: ${weatherData.weather[0].description}</p>
        `;
      } else {
        resultDiv.innerHTML += `<p>Unable to fetch weather data for ${correctState}.</p>`;
      }
    });