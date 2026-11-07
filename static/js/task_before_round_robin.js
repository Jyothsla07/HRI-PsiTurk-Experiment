var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;
var mycounterbalance = counterbalance;

var pages = [
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",
    "instructions/instruct-3.html",
    "instructions/instruct-ready.html",
    "stage.html",
    "postquestionnaire.html"
];

var init = (async () => {
    await psiTurk.preloadPages(pages);
})();

var instructionPages = [
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",
    "instructions/instruct-3.html",
    "instructions/instruct-ready.html"
];

var HRIExperiment = function() {

    psiTurk.showPage('stage.html');

    var robotCondition = (mycondition == 0);

    var html = `
        <div style="text-align:center; max-width:800px; margin:50px auto;">
            <h1>Educational Activity</h1>

            <p>
                You have been assigned to:
                <strong>${robotCondition ? "Robot-Assisted Learning" : "Standard Learning"}</strong>
            </p>

            <hr>

            ${
                robotCondition
                ? "<h2>🤖 Robot Condition</h2><p>Imagine that a social robot is assisting you during this educational activity.</p>"
                : "<h2>📖 Standard Condition</h2><p>You will complete the educational activity without a social robot.</p>"
            }

            <h3>Lesson</h3>

            <p>
                Social robots are robots designed to interact with people
                using communication, movement, and social behaviors.
                They can be used in educational environments to provide
                guidance, feedback, and interaction.
            </p>

            <button id="continue" class="btn btn-primary">
                Continue to Quiz
            </button>
        </div>
    `;

    $("#stage").html(html);

    psiTurk.recordTrialData({
        'phase': 'condition',
        'condition': mycondition,
        'robot_condition': robotCondition
    });

    $("#continue").click(function() {

        psiTurk.recordTrialData({
            'phase': 'lesson',
            'status': 'completed'
        });

        showQuiz();
    });
};


var showQuiz = function() {

    var html = `
        <div style="text-align:center; max-width:800px; margin:50px auto;">
            <h1>Learning Quiz</h1>

            <p>What is a primary purpose of a social robot in education?</p>

            <div style="text-align:left; margin:30px auto; width:500px;">

                <label>
                    <input type="radio" name="answer" value="A">
                    A. To replace all teachers
                </label><br><br>

                <label>
                    <input type="radio" name="answer" value="B">
                    B. To support interaction and learning
                </label><br><br>

                <label>
                    <input type="radio" name="answer" value="C">
                    C. To eliminate student interaction
                </label><br><br>

                <label>
                    <input type="radio" name="answer" value="D">
                    D. To prevent students from asking questions
                </label>

            </div>

            <button id="quizSubmit" class="btn btn-primary">
                Submit Answer
            </button>
        </div>
    `;

    $("#stage").html(html);

    $("#quizSubmit").click(function() {

        var answer = $("input[name='answer']:checked").val();

        if (!answer) {
            alert("Please select an answer.");
            return;
        }

        var correct = (answer === "B");

        psiTurk.recordTrialData({
            'phase': 'quiz',
            'answer': answer,
            'correct': correct
        });

        showSurvey();
    });
};


var showSurvey = function() {

    var html = `
        <div style="text-align:center; max-width:800px; margin:50px auto;">

            <h1>Study Survey</h1>

            <p>How engaging was the educational activity?</p>

            <label>
                <input type="radio" name="engagement" value="1">
                1 - Not at all
            </label>

            <label>
                <input type="radio" name="engagement" value="2">
                2
            </label>

            <label>
                <input type="radio" name="engagement" value="3">
                3
            </label>

            <label>
                <input type="radio" name="engagement" value="4">
                4
            </label>

            <label>
                <input type="radio" name="engagement" value="5">
                5 - Extremely
            </label>

            <br><br>

            <p>How useful was the activity?</p>

            <label>
                <input type="radio" name="usefulness" value="1">
                1 - Not at all useful
            </label>

            <label>
                <input type="radio" name="usefulness" value="2">
                2
            </label>

            <label>
                <input type="radio" name="usefulness" value="3">
                3
            </label>

            <label>
                <input type="radio" name="usefulness" value="4">
                4
            </label>

            <label>
                <input type="radio" name="usefulness" value="5">
                5 - Extremely useful
            </label>

            <br><br>

            <button id="finish" class="btn btn-success">
                Finish Study
            </button>

        </div>
    `;

    $("#stage").html(html);

    $("#finish").click(function() {

        var engagement = $("input[name='engagement']:checked").val();
        var usefulness = $("input[name='usefulness']:checked").val();

        if (!engagement || !usefulness) {
            alert("Please answer all questions.");
            return;
        }

        psiTurk.recordUnstructuredData("engagement", engagement);
        psiTurk.recordUnstructuredData("usefulness", usefulness);

        psiTurk.recordTrialData({
            'phase': 'survey',
            'status': 'completed'
        });

        psiTurk.saveData({
            success: function() {
                psiTurk.completeHIT();
            },
            error: function() {
                alert("There was a problem saving your data. Please try again.");
            }
        });
    });
};


$(window).on('load', async () => {

    await init;

    psiTurk.doInstructions(
        instructionPages,
        function() {
            currentview = new HRIExperiment();
        }
    );
});
