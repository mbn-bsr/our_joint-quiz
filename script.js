let container;
let quizData = null;
let currentQuestionIndex = 0;
let amountOfQs = 10;
let selectedAnswers = [];

document.addEventListener("DOMContentLoaded", () => {
    container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    fetch(`https://opentdb.com/api.php?amount=${amountOfQs}&category=31`)
        .then(response => response.json())
        .then(data => {
            quizData = data;
            container.onclick = (e) => {
                if (e.target.tagName === "LABEL") {
                    const input = e.target.querySelector("input");
                    if (!input) return;
                    const otherSelected = Array.from(document.getElementsByName(input.name))
                        .some(radio => radio.checked && radio !== input); 
                            // found this weird function on stack overflow, and i'm still not entirely sure how to use it. i get that it's used for arrays, and that it basically checks if the callback function (you pass that as a parameter) returns true for any of the elements in the array. so, i guess i kinda get why this is super helpful here 'cause it's checking if any of the elements in the array have been selected while you're on the same index. but still, gotta check it out real time.
                    if (!otherSelected) {
                        selectedAnswers.push(e.target);
                    }
                }
            };
            displayQuestion();
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = "API sleeping. Refresh page";
        });
});

function displayQuestion() {
    if (!quizData || !quizData.results || quizData.results.length === 0) { // dude, what does it take to CHECK FOR NOTHING?!
        container.innerHTML = "No questions available. A.K.A. API sleeping. Refresh page.";
        return;
    }

    const q = quizData.results[currentQuestionIndex];
    container.innerHTML = "";

    const question = document.createElement("p");
    question.className = "question-text"; // so yeah, this is actually a thing btw. idk if it's something i'm legitimately supposed to do (like, is it an ancient greek property) but hey, it didn't break my code.
    question.innerHTML = q.question;
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
        label.insertAdjacentHTML("beforeend", ` ${a}`);
        answersContainer.appendChild(label);
    });

    container.appendChild(answersContainer);

    const controls = document.createElement("div");
    controls.classList.add("controls");

    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-btn";
    prevBtn.innerText = "Previous";
    if (currentQuestionIndex === 0) prevBtn.disabled = "true";
    prevBtn.addEventListener("click", () => {
        currentQuestionIndex = Math.max(0, currentQuestionIndex - 1); // another weird function, but this time i kinda get what it does. basically, it compares two 'numbers' and returns the larger one. soooo, i used it so that it doesn't start going to negative indexes 'cause yeah, it literally did just that.
        displayQuestion();
    });

    const nextBtn = document.createElement("button");
    nextBtn.id = "next-btn";
    nextBtn.innerText = currentQuestionIndex === quizData.results.length - 1 ? "Finish" : "Next";
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

function checkAnswers() { // this function took, like, two days for me to get it working so plz don't complain about my messy code, alright? come onnn pal, i even put scoring in heereee
   const correctAnswers = quizData.results.map(q => q.correct_answer);
   const resultsContainer = document.createElement('div');
   resultsContainer.className = 'results';
     let score = 0;
     quizData.results.forEach((q, i) => {
             const selected = selectedAnswers[i] || null;
             const correct = correctAnswers[i];
             const item = document.createElement('div');
             item.className = 'result-item';
             const status = selected === correct ? 'Correct' : 'Incorrect';
             if (selected === correct) score++;
             item.innerHTML = `<p class="question-text">${q.question}</p>` +
                                     `<p>Selected: ${selected === null ? '<em>None</em>' : selected}</p>
                                      <p>Correct: ${correct}</p>
                                      <p>${status}</p>`;
             resultsContainer.appendChild(item);
     });

     container.innerHTML = '';
     const summary = document.createElement('div');
     summary.className = 'summary';
     summary.innerHTML = `<h2>Score: ${score} / ${quizData.results.length}</h2>`;
     container.appendChild(summary);
     container.appendChild(resultsContainer);
}
