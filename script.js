// =========================
// AI PROMPT QUALITY CHECKER
// =========================

// Get HTML elements
const promptInput = document.getElementById("promptInput");
const checkBtn = document.getElementById("checkBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreValue = document.getElementById("scoreValue");
const rating = document.getElementById("rating");
const scoreDescription = document.getElementById("scoreDescription");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const scoreCircle = document.getElementById("scoreCircle");

const componentList = document.getElementById("componentList");
const suggestionsList = document.getElementById("suggestionsList");
const errorMessage = document.getElementById("errorMessage");

// =========================
// COMPONENT KEYWORDS
// =========================

// Each component has a list of keywords or phrases.
// Detection is case-insensitive.

const components = {
    Role: [
        "act as",
        "acting as",
        "role",
        "expert",
        "professor",
        "teacher",
        "developer",
        "designer",
        "tutor",
        "specialist",
        "professional",
        "consultant"
    ],

    Task: [
        "task",
        "explain",
        "create",
        "write",
        "generate",
        "summarize",
        "summary",
        "classify",
        "analyze",
        "analyse",
        "develop",
        "design",
        "calculate",
        "compare",
        "solve",
        "evaluate",
        "describe",
        "identify",
        "list",
        "make",
        "build"
    ],

    Context: [
        "context",
        "background",
        "audience",
        "student",
        "students",
        "beginner",
        "beginners",
        "college",
        "first-year",
        "first year",
        "for",
        "about",
        "scenario",
        "situation",
        "topic",
        "purpose"
    ],

    Constraints: [
        "constraint",
        "constraints",
        "limit",
        "limited",
        "only",
        "must",
        "should",
        "avoid",
        "do not",
        "don't",
        "no",
        "simple",
        "length",
        "word count",
        "maximum",
        "minimum",
        "requirements",
        "requirement",
        "using",
        "use"
    ],

    "Output Format": [
        "output format",
        "format",
        "bullet points",
        "bullet point",
        "bullets",
        "table",
        "json",
        "xml",
        "markdown",
        "list",
        "paragraph",
        "headings",
        "numbered",
        "steps",
        "structure",
        "sections"
    ]
};

// =========================
// IMPROVEMENT SUGGESTIONS
// =========================

const suggestions = {
    Role: "Add a role to guide the AI. Example: Act as a college professor, experienced web developer, or science tutor.",

    Task: "Clearly state what you want the AI to do. Example: Explain, create, summarize, classify, compare, or solve.",

    Context: "Provide background information, the audience, or the purpose. Example: This is for a first-year computer science student.",

    Constraints: "Add limitations or requirements. Example: Use simple language, keep it under 200 words, or avoid technical jargon.",

    "Output Format": "Specify how the response should be organized. Example: Use bullet points, a table, JSON, or numbered steps."
};

// =========================
// SAMPLE PROMPT
// =========================

const samplePrompt = `Act as a college professor.

Task: Explain the concept of machine learning.

Context: This explanation is for first-year computer science students who are beginners.

Constraints: Use simple language, include real-life examples, and keep the explanation under 300 words.

Output Format: Provide the explanation using bullet points with a short conclusion.`;

// Load sample prompt
sampleBtn.addEventListener("click", function () {
    promptInput.value = samplePrompt;
    errorMessage.textContent = "";

    // Automatically check the sample prompt
    checkPrompt();
});

// =========================
// CHECK PROMPT FUNCTION
// =========================

function checkPrompt() {
    const prompt = promptInput.value.trim();

    // Validate empty input
    if (prompt === "") {
        errorMessage.textContent = "⚠ Please enter a prompt before checking.";

        resetResults();
        return;
    }

    errorMessage.textContent = "";

    // Convert prompt to lowercase for case-insensitive detection
    const lowerPrompt = prompt.toLowerCase();

    let score = 0;
    let detectedComponents = {};

    // Check each component using keywords
    for (const component in components) {

        const keywords = components[component];

        // Detect whether at least one keyword is present
        const detected = keywords.some(keyword =>
            lowerPrompt.includes(keyword.toLowerCase())
        );

        detectedComponents[component] = detected;

        // Award 20 marks for each detected component
        if (detected) {
            score += 20;
        }
    }

    // Display results
    displayResults(score, detectedComponents);
}

// =========================
// DISPLAY RESULTS
// =========================

function displayResults(score, detectedComponents) {

    // Update score
    scoreValue.textContent = score;

    // Update progress bar
    progressBar.style.width = score + "%";
    progressText.textContent = score + "%";

    // Update circular score indicator
    scoreCircle.style.background =
        `conic-gradient(#16a34a ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)`;

    // Determine rating
    let promptRating = "";
    let description = "";

    if (score === 100) {
        promptRating = "Excellent!";
        description = "Your prompt contains all five components.";
    }
    else if (score === 80) {
        promptRating = "Very Good!";
        description = "Your prompt is strong. One component is missing.";
    }
    else if (score === 60) {
        promptRating = "Good!";
        description = "Your prompt is good. Improve the missing components.";
    }
    else if (score === 40) {
        promptRating = "Average";
        description = "Your prompt needs a few more details.";
    }
    else {
        promptRating = "Needs Improvement";
        description = "Add more components to make your prompt effective.";
    }

    rating.textContent = promptRating;
    scoreDescription.textContent = description;

    // Display component status
    displayComponents(detectedComponents);

    // Display improvement suggestions
    displaySuggestions(detectedComponents);
}

// =========================
// DISPLAY COMPONENT STATUS
// =========================

function displayComponents(detectedComponents) {

    componentList.innerHTML = "";

    for (const component in detectedComponents) {

        const detected = detectedComponents[component];

        const item = document.createElement("div");

        // Apply green or red styling
        item.className = detected
            ? "component-item detected"
            : "component-item missing";

        // Create status icon and component name
        item.innerHTML = `
            <div class="component-status">
                <span class="status-icon">${detected ? "✔" : "✖"}</span>
                <span>${component}</span>
            </div>

            <span class="points">
                ${detected ? "+20 marks" : "0 marks"}
            </span>
        `;

        componentList.appendChild(item);
    }
}

// =========================
// DISPLAY SUGGESTIONS
// =========================

function displaySuggestions(detectedComponents) {

    suggestionsList.innerHTML = "";

    let missingCount = 0;

    for (const component in detectedComponents) {

        // Display suggestions only for missing components
        if (!detectedComponents[component]) {

            missingCount++;

            const suggestion = document.createElement("div");

            suggestion.className = "suggestion-item";

            suggestion.innerHTML = `
                <strong>⚡ Add ${component}</strong>
                ${suggestions[component]}
            `;

            suggestionsList.appendChild(suggestion);
        }
    }

    // If all components are detected
    if (missingCount === 0) {

        const successMessage = document.createElement("div");

        successMessage.className = "suggestion-item";

        successMessage.style.background = "#f0fdf4";
        successMessage.style.borderLeftColor = "#16a34a";
        successMessage.style.color = "#166534";

        successMessage.innerHTML = `
            <strong>🎉 Excellent work!</strong>
            Your prompt contains all five essential components.
            Keep practicing to create effective AI prompts!
        `;

        suggestionsList.appendChild(successMessage);
    }
}

// =========================
// RESET RESULTS FUNCTION
// =========================

function resetResults() {

    scoreValue.textContent = "0";

    rating.textContent = "Not evaluated";
    scoreDescription.textContent = "Check your prompt to see results.";

    progressBar.style.width = "0%";
    progressText.textContent = "0%";

    scoreCircle.style.background =
        "conic-gradient(#16a34a 0deg, #e5e7eb 0deg)";

    componentList.innerHTML = `
        <div class="placeholder">
            <span>✦</span>
            <p>Your analysis will appear here.</p>
        </div>
    `;

    suggestionsList.innerHTML = `
        <p class="suggestion-placeholder">
            Suggestions will appear after checking your prompt.
        </p>
    `;
}

// =========================
// CLEAR BUTTON
// =========================

clearBtn.addEventListener("click", function () {

    // Clear input
    promptInput.value = "";

    // Clear validation message
    errorMessage.textContent = "";

    // Reset score and results
    resetResults();
});

// =========================
// CHECK BUTTON
// =========================

checkBtn.addEventListener("click", checkPrompt);
