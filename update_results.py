from pathlib import Path

p = Path("static/js/task.js")
s = p.read_text()

start = s.index("var showResults = function() {")
end = s.index("var showSurvey = function() {", start)

new = r'''
var showResults = function() {
    if (!quizResults || !weightedQuizResults) {
        stage("<h2>Results unavailable</h2>");
        return;
    }

    var html = '<h1>Your Learning Results</h1>';

    function addQuizReview(title, questions, results) {
        html += '<hr><h2>' + title + '</h2>' +
                '<h3>Score: ' + results.score + ' / ' +
                questions.length + '</h3>' +
                '<p>Completion time: ' + results.seconds +
                ' seconds</p>' +
                '<h4>Incorrect Answers</h4>';

        var wrongCount = 0;

        questions.forEach(function(q, i) {
            var answer = results.answers[i];

            if (answer !== q.correct) {
                wrongCount++;

                var selected = answer === null
                    ? "Not answered"
                    : q.a[answer];

                html += '<div style="border:1px solid #ddd;' +
                        'padding:15px;margin:12px 0">' +
                        '<strong>Question ' + (i + 1) +
                        ': ' + q.q + '</strong>' +
                        '<p style="color:#b91c1c">Your answer: ' +
                        selected + '</p>' +
                        '<p style="color:#15803d">Correct answer: ' +
                        q.a[q.correct] + '</p></div>';
            }
        });

        if (wrongCount === 0) {
            html += '<p>All answers correct!</p>';
        }

        if (results.timedOut) {
            html += '<p>Quiz automatically submitted at 15 minutes.</p>';
        }
    }

    addQuizReview("Quiz 1: Round Robin", quizQuestions, quizResults);
    addQuizReview("Quiz 2: Weighted Round Robin",
                  weightedQuizQuestions, weightedQuizResults);

    html += '<hr><h2>Total Score: ' +
            (quizResults.score + weightedQuizResults.score) +
            ' / 20</h2>' +
            '<p>Thank you for participating! Your responses have been saved.</p>';

    stage(html);
};

'''

p.write_text(s[:start] + new + s[end:])
print("SUCCESS: Results page updated for both quizzes.")
