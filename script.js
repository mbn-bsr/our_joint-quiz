document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    let qNum = 5;
    let category = 14;
    let type = "multiple";

    fetch(`https://opentdb.com/api.php?amount=10`)
    .then(response => response.json())
    .then(data => {
        container.innerHTML = '';
        for (let i = 0; i < data.results.length; i++) {
            var question = document.createElement("p");
            question.id = `question-${i}`; 
            question.classList.add("question-text");
            question.innerHTML = data.results[i].question;
            container.appendChild(question);
            
            var correct_answer = data.results[i].correct_answer;
            var wrong_answers = data.results[i].incorrect_answers;
            var answers = [...wrong_answers, correct_answer]; 

            answers = answers.sort(() => Math.random() - 0.5);

            var answerBtns = answers.map(a => `<label style="display: block; margin-bottom: 6px; cursor: pointer;">
                    <input type="radio" name="question-${i}" value="${a}">
                    ${a}
        </label>`).join("");
    
            question.insertAdjacentHTML("afterend", 
                `<div class="answers-container" style="margin-top: 12px; display: flex; gap: 5px;">${answerBtns}</div>`
            );
            var prevBtn = document.createElement("button");
            prevBtn.id = "prev-btn";
            prevBtn.innerText = "Previous";
            container.appendChild(prevBtn);
            var nextBtn = document.createElement("button");
            nextBtn.id = "submit-btn";
            nextBtn.innerText = "Next";
            container.appendChild(nextBtn);
        }
    })
    .catch(error => {
        console.error(error);
        container.innerHTML = "API lagging. Refresh page";
    });
});