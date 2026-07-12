let container;
let quizData = null;
let currentQuestionIndex = 0;
let selectedAnswers = [];
const loader = `<div id="loader"></div>`;
const customizer = `
        <div id="customizer">
            <h2>Customize Quiz</h2>
            <p>Category:</p>
            <select id="category">
                <option value=" ">Any Category</option>
			    <optgroup label="Entertainment">
                    <option value="16">Board Games</option>
				    <option value="10">Books</option>
					<option value="32">Cartoons & Animations</option>
					<option value="29">Comics</option>
				    <option value="11">Film</option>
					<option value="31">Japanese Anime & Manga</option>
				    <option value="12">Music</option>
					<option value="13">Musicals & Theatres</option>
					<option value="14">Television</option>
					<option value="15">Video Games</option>
			    </optgroup>
			    <optgroup label="Science">
                    <option value="18">Computers</option>
					<option value="30">Gadgets</option>
					<option value="19">Mathematics</option>
					<option value="17">Science & Nature</option>
			    </optgroup>
			    <optgroup label="General">
                    <option value="27">Animals</option>
					<option value="25">Art</option>
					<option value="26">Celebrities</option>
					<option value="9">General Knowledge</option>
					<option value="22">Geography</option>
					<option value="23">History</option>
					<option value="20">Mythology</option>
					<option value="24">Politics</option>
					<option value="21">Sports</option>
					<option value="28">Vehicles</option>
			    </optgroup>
			</select>

            <p>Questions:</p>
            <input type="number" min="5" max="30" id="number" value="10" step="5">
            
            <button id="button">Start Quiz</button>
    </div>
`;

container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);

const logo = document.createElement("img");
logo.id = "logo";
logo.src = "neon-galaxy-portal-stockcake.jpg"; // will try to find a better logo later
document.body.appendChild(logo);

document.addEventListener("DOMContentLoaded", () => {
    logo.style.animation = "moveUp 1s ease, fadeIn 1.5s ease";
    container.innerHTML = customizer;
    document.getElementById("customizer").style.animation = "fadeIn 0.5s ease";
    container.onclick = (e) => {
        if (e.target.tagName === "BUTTON") {
            fetchQuiz();
        }
    }
});


function fetchQuiz() {
    const qs = document.querySelector("#number").value;
    const category = document.querySelector("#category").value;
    fetch(`https://opentdb.com/api.php?amount=${qs}&category=${category}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.results || data.results.length === 0) { // dude, how much does it take to CHECK FOR NOTHING?!
                throw new Error("Invalid quiz data received"); 
            }
            quizData = data;
            container.onclick = (e) => {
                if (e.target.tagName === "LABEL") {
                    const input = e.target.querySelector("input");
                    if (!input) return;
                    const otherSelected = Array.from(document.getElementsByName(input.name))
                        .some(radio => radio.checked && radio !== input); // found this weird function on stack overflow, and i'm still not entirely sure how to use it. i get that it's used for arrays, and that it basically checks if the callback function (you pass that as a parameter) returns true for any of the elements in the array. so, i guess i kinda get why this is super helpful here 'cause it's checking if any of the other elements in the options have been selected in the same index you're on. but still, gotta check it out real time.
                    if (!otherSelected) {
                        selectedAnswers.push(e.target);
                    }
                }
            };
            displayQuestion();
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = "<p style='color: red;'>Failed to load quiz data. Refreshing page...</p>";
            container.innerHTML += loader;
            logo.style.display = "none";
            setTimeout(() => {
                location.reload();
            }, 3000);
        });
}

function displayQuestion() {
    const q = quizData.results[currentQuestionIndex];
    container.innerHTML = "";
    container.style.animation = "fadeIn 0.4s linear";
    const question = document.createElement("p");
    question.className = "question-text"; // so yeah, this is actually a thing btw. idk if it's something i'm legitimately allowed to do (like, is it an ancient greek property) but hey, it didn't break my code.
    question.innerHTML = `<b>Q${currentQuestionIndex + 1}:</b> ${q.question}`;
    container.appendChild(question);

    const correct_answer = q.correct_answer;
    const wrong_answers = q.incorrect_answers || [];
    let answers = [...wrong_answers, correct_answer];
    answers = answers.sort(() => Math.random() - 0.5);

    const answersContainer = document.createElement("div");
    answersContainer.classList.add("answers-container");

    answers.forEach((a) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${currentQuestionIndex}`;
        input.value = a;
        if (selectedAnswers[currentQuestionIndex] === a) {
            input.checked = true;
        }
        input.addEventListener("change", () => {
            selectedAnswers[currentQuestionIndex] = a;
            console.log(selectedAnswers);
        });

        label.appendChild(input);
        label.insertAdjacentHTML("beforeend", `${a}`);
        answersContainer.appendChild(label);
    });

    container.appendChild(answersContainer);

    const controls = document.createElement("div");
    controls.classList.add("controls");

    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-btn";
    prevBtn.innerText = "◂ Prev";
    if (currentQuestionIndex === 0) prevBtn.disabled = "true";
    prevBtn.addEventListener("click", () => {
        currentQuestionIndex = Math.max(0, currentQuestionIndex - 1); // another weird function, but this time i kinda get what it does. basically, it compares two 'numbers' and returns the larger one. soooo, i used it so that it doesn't start going to negative indexes 'cause yeah, it literally did just that.
        displayQuestion();
    });

    const nextBtn = document.createElement("button");
    nextBtn.id = "next-btn";
    nextBtn.innerText = currentQuestionIndex === quizData.results.length - 1 ? "Finish ▸" : "Next ▸";
    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < quizData.results.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            checkAnswers();
        }
    });

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    container.appendChild(controls);
}

function checkAnswers() { // this function took, like, two days for me to get it working so plz don't complain about my messy code, alright?
   const correctAnswers = quizData.results.map(q => q.correct_answer);
   const resultsContainer = document.createElement('div');
//    resultsContainer.style.height = "500px";
   container.style.marginTop = "-13px";
   container.style.height = "100%";
   container.style.padding = "10px";
   resultsContainer.className = 'results';
     let score = 0;
     quizData.results.forEach((q, i) => {
             const selected = selectedAnswers[i] || null;
             const correct = correctAnswers[i];
             const item = document.createElement('div');
             item.className = 'result-item';
             const status = selected === correct ? 'Correct' : 'Incorrect';
             if (selected === correct) score++;
             item.innerHTML = `<p class="question-text">${q.question}</p>
                              <p style="color: ${status === "Correct" ? "#005e0d" : "#840000"}">Your Answer: ${selected === null ? '<em>None</em>' : selected}</p>
                              <p>Correct Answer: ${correct}</p>`;
             resultsContainer.appendChild(item);
     });

     container.innerHTML = '';
     const summary = document.createElement('div');
     summary.className = 'summary';
     summary.innerHTML = `<h2>Score: ${score} / ${quizData.results.length} | <button onclick="location.reload()">Play Another</button></h2>`;
     container.appendChild(summary)
     container.appendChild(resultsContainer);
}
