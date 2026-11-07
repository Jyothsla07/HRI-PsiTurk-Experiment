
var weightedQuizResults = null;

var showWeightedLesson = function() {
    var material = robotCondition ? module2.robotVideo : module2.computerPDF;

    if (robotCondition && !module2.videoReady) {
        stage('<h1>Weighted Round Robin</h1>' +
              '<p>The robot video for Module 2 has not been added yet.</p>' +
              '<p>Please return when the video is ready.</p>');
        return;
    }

    var content = robotCondition
        ? '<video controls style="width:100%" src="' + material + '"></video>'
        : '<iframe src="' + material + '" style="width:100%;height:650px"></iframe>';

    var started = Date.now();

    stage('<h1>Module 2: Weighted Round Robin</h1>' +
          content +
          '<p><button id="startWeightedQuiz" class="btn btn-primary">Continue to Quiz 2</button></p>');

    $("#startWeightedQuiz").on("click", function() {
        var seconds = (Date.now() - started) / 1000;
        psiTurk.recordTrialData({
            phase: "weighted_learning",
            condition: mycondition,
            exposure_seconds: seconds
        });
        psiTurk.recordUnstructuredData("weighted_exposure_seconds", seconds);
        saveProgress(showWeightedQuiz);
    });
};

var showWeightedQuiz = function() {
    var started = Date.now();
    var limit = 15 * 60 * 1000;
    var submitted = false;
    var timerId;

    var html = '<h1>Weighted Round Robin Quiz</h1>' +
        '<p>Answer all 10 questions. You have 15 minutes.</p>' +
        '<h3 id="weightedCountdown" style="position:sticky;top:0;background:white;padding:12px;border:1px solid #ddd">15:00</h3>';

    weightedQuizQuestions.forEach(function(q, i) {
        html += '<div style="padding:16px;margin:15px 0;border:1px solid #ddd">' +
                '<h4>Question ' + (i + 1) + ': ' + q.q + '</h4>';
        q.a.forEach(function(option, j) {
            html += '<label style="display:block;margin:10px 0">' +
                    '<input type="radio" name="wq' + i + '" value="' + j + '"> ' +
                    String.fromCharCode(65 + j) + '. ' + option + '</label>';
        });
        html += '</div>';
    });

    html += '<button id="submitWeightedQuiz" class="btn btn-primary btn-lg">Submit Quiz 2</button>';
    stage(html);

    function submit(timedOut) {
        if (submitted) return;
        submitted = true;
        clearInterval(timerId);

        var seconds = Math.min((Date.now() - started) / 1000, 900);
        var answers = [];
        var score = 0;

        weightedQuizQuestions.forEach(function(q, i) {
            var value = $('input[name="wq' + i + '"]:checked').val();
            var answer = value === undefined ? null : Number(value);
            var correct = answer === q.correct;
            if (correct) score++;
            answers.push(answer);

            psiTurk.recordTrialData({
                phase: "weighted_quiz_question",
                question_number: i + 1,
                answer: answer,
                correct_answer: q.correct,
                is_correct: correct
            });
        });

        weightedQuizResults = {
            score: score,
            answers: answers.slice(),
            seconds: Math.round(seconds * 100) / 100,
            timedOut: timedOut
        };

        psiTurk.recordTrialData({
            phase: "weighted_quiz_summary",
            condition: mycondition,
            score: score,
            total_questions: weightedQuizQuestions.length,
            completion_seconds: weightedQuizResults.seconds,
            timed_out: timedOut,
            answers: answers
        });

        psiTurk.recordUnstructuredData("weighted_quiz_score", score);
        psiTurk.recordUnstructuredData("weighted_quiz_seconds", weightedQuizResults.seconds);
        psiTurk.recordUnstructuredData("weighted_quiz_timed_out", timedOut);

        stage('<h2>Quiz 2 submitted</h2><p>Saving responses...</p>');
        saveProgress(showSurvey);
    }

    $("#submitWeightedQuiz").on("click", function() {
        if (confirm("Submit your Weighted Round Robin quiz?")) submit(false);
    });

    function updateTimer() {
        if (submitted) return;
        var remaining = Math.max(0, limit - (Date.now() - started));
        var seconds = Math.ceil(remaining / 1000);
        var mm = String(Math.floor(seconds / 60)).padStart(2, "0");
        var ss = String(seconds % 60).padStart(2, "0");
        $("#weightedCountdown").text("Time remaining: " + mm + ":" + ss);
        if (remaining <= 0) submit(true);
    }

    updateTimer();
    timerId = setInterval(updateTimer, 250);
};

