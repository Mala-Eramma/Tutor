const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const responseBox = document.getElementById("response");
const voiceButton = document.getElementById("voiceButton");


// ===============================
// VOICE INPUT
// ===============================

voiceButton.addEventListener("click", () => {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceButton.textContent = "🎤 Listening...";

    recognition.start();

    recognition.onresult = (event) => {

        const spokenText =
            event.results[0][0].transcript;

        // Put voice text into question box
        questionInput.value = spokenText;

        voiceButton.textContent = "🎤 Speak";
    };

    recognition.onerror = (event) => {

        console.error("Speech recognition error:", event.error);

        voiceButton.textContent = "🎤 Speak";
    };

    recognition.onend = () => {

        voiceButton.textContent = "🎤 Speak";
    };
});


// ===============================
// AI ANSWER
// ===============================

questionForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {

        responseBox.textContent =
            "Please enter or speak a question.";

        return;
    }

    // Stop any previous AI speech
    window.speechSynthesis.cancel();

    // Show loading message
    responseBox.textContent = "AI is thinking...";

    try {

        const formData = new FormData();

        formData.append("question", question);

        const response = await fetch("/ask", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to get AI answer.");
        }

        const data = await response.json();

        // Display AI answer
        responseBox.textContent = data.answer;


        // ===============================
        // AI VOICE OUTPUT
        // ===============================

        const speech = new SpeechSynthesisUtterance(data.answer);

        speech.lang = "en-IN";
        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        // Speak the AI answer
        window.speechSynthesis.speak(speech);


    } catch (error) {

        console.error("AI error:", error);

        responseBox.textContent =
            "Sorry, I could not generate an answer. Please try again.";
    }
});