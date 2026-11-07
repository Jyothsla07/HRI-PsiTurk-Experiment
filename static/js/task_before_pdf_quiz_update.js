
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var mycondition = Number(condition);
var robotCondition = (mycondition === 0);
var conditionName = robotCondition ? "Robot Video" : "Computer PDF";

var instructionPages = [
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",
    "instructions/instruct-3.html",
    "instructions/instruct-ready.html"
];

var pages = instructionPages.concat(["stage.html"]);
var init = psiTurk.preloadPages(pages);

var quizQuestions = [
    {
        q: "Which type of CPU scheduling algorithm is Round Robin?",
        a: ["Non-preemptive", "Preemptive", "Priority-only", "Batch-only"],
        correct: 1
    },
    {
        q: "What does the time quantum represent?",
        a: ["Total execution time", "Maximum CPU time per turn", "Waiting time", "Arrival time"],
        correct: 1
    },
    {
        q: "How are ready processes organized in Round Robin?",
        a: ["LIFO", "Shortest burst first", "FIFO", "Highest priority first"],
        correct: 2
    },
    {
        q: "What happens when an unfinished process uses its entire time quantum?",
        a: ["It returns to the back of the ready queue", "It terminates", "It keeps the CPU", "It is permanently blocked"],
        correct: 0
    },
    {
        q: "What happens when a process finishes before its quantum expires?",
        a: ["It restarts", "It leaves the ready queue", "It runs again", "It waits for another quantum"],
        correct: 1
    },
    {
        q: "P1, P2, and P3 are ready in that order, and all need more than one quantum. What is the order of their first turns?",
        a: ["P1, P2, P3", "P3, P2, P1", "P1, P3, P2", "P2, P1, P3"],
        correct: 0
    },
    {
        q: "What is context switching?",
        a: ["Increasing burst time", "Changing process priority", "Switching CPU execution between processes", "Changing CPU speed"],
        correct: 2
    },
    {
        q: "What can happen when the time quantum is very small?",
        a: ["More context-switch overhead", "No context switching", "All processes finish instantly", "Processes cannot arrive"],
        correct: 0
    },
    {
        q: "A very large time quantum makes Round Robin resemble which algorithm?",
        a: ["Shortest Job First", "First-Come, First-Served", "Priority Scheduling", "Shortest Remaining Time First"],
        correct: 1
    },
    {
        q: "Why is Round Robin considered fair?",
        a: ["Shortest jobs always run first", "Each ready process receives repeated CPU opportunities", "Highest priority always runs first", "One process runs until completion"],
        correct: 1
       }
];

// Module 2: Weighted Round Robin
var module2 = {title: "Weighted Round Robin Scheduling", robotVideo: "/static/materials/weighted_round_robin_robot.mp4", computerPDF: "/static/materials/weighted_round_robin.pdf", videoReady: true};

var weightedQuizQuestions = [
    {
        "q": "What is the main difference between Round Robin and Weighted Round Robin?",
        "a": [
            "WRR uses weights to allocate service",
            "WRR removes the ready queue",
            "WRR is always non-preemptive",
            "WRR runs only one process"
        ],
        "correct": 0
    },
    {
        "q": "What does a process weight represent in Weighted Round Robin?",
        "a": [
            "Its arrival time",
            "Its relative share of CPU service",
            "Its process ID",
            "Its total waiting time"
        ],
        "correct": 1
    },
    {
        "q": "If the base quantum is 2 ms and a process has weight 3, what is its allocated quantum?",
        "a": [
            "2 ms",
            "3 ms",
            "6 ms",
            "9 ms"
        ],
        "correct": 2
    },
    {
        "q": "If P1 has weight 1 and P2 has weight 2, which receives a larger CPU allocation per turn?",
        "a": [
            "P1",
            "P2",
            "Both receive the same",
            "Neither receives CPU time"
        ],
        "correct": 1
    },
    {
        "q": "What happens when a process finishes before using its allocated quantum?",
        "a": [
            "It must use the remaining quantum",
            "It restarts",
            "It completes and releases the CPU",
            "Its weight doubles"
        ],
        "correct": 2
    },
    {
        "q": "What happens when an unfinished process uses its full allocated quantum?",
        "a": [
            "It returns to the ready queue",
            "It is permanently removed",
            "It runs indefinitely",
            "Its burst time resets"
        ],
        "correct": 0
    },
    {
        "q": "With base quantum 2 ms, what quantum does a process with weight 2 receive?",
        "a": [
            "1 ms",
            "2 ms",
            "4 ms",
            "8 ms"
        ],
        "correct": 2
    },
    {
        "q": "What is one advantage of Weighted Round Robin?",
        "a": [
            "It eliminates context switching",
            "It allows differentiated CPU service",
            "It guarantees zero waiting time",
            "It removes all scheduling overhead"
        ],
        "correct": 1
    },
    {
        "q": "What is a possible disadvantage of poorly chosen weights?",
        "a": [
            "Unbalanced CPU allocation",
            "All processes get equal service",
            "No process can finish",
            "The CPU cannot switch processes"
        ],
        "correct": 0
    },
    {
        "q": "If all processes have equal weights, simplified WRR behaves like which algorithm?",
        "a": [
            "Shortest Job First",
            "Priority Scheduling",
            "Regular Round Robin",
            "First-Come, First-Served"
        ],
        "correct": 2
    }
];

var quizResults = null;

var surveyItems = [
    ["engagement","The learning activity kept me engaged."],
    ["clarity","The explanation was clear and understandable."],
    ["usefulness","The learning material was useful."],
    ["cognitive_load","The material required substantial mental effort."],
    ["satisfaction","I am satisfied with this learning experience."]
];

var stage = function(html) {
    psiTurk.showPage("stage.html");
    $("#stage").html(
        '<div style="max-width:900px;margin:35px auto;padding:20px">' +
        html + '</div>'
    );
};

var saveProgress = function(done) {
    psiTurk.saveData({
        success: function() { if (done) done(); },
        error: function() {
            alert("Data could not be saved. Please check your connection and try again.");
        }
    });
};


var showDemographics = function() {
    var html =
        '<h1>Participant Demographics</h1>' +
        '<p>Please complete the following questions.</p>' +
        '<h3>1. Gender</h3>';

    [
        ["male", "Male"],
        ["female", "Female"],
        ["nonbinary_other", "Non-binary / Other"],
        ["prefer_not", "Prefer not to disclose"]
    ].forEach(function(item) {
        html += '<label style="display:block;margin:12px 0">' +
            '<input type="radio" name="gender" value="' +
            item[0] + '"> ' + item[1] + '</label>';
    });

    html +=
        '<hr><h3>2. Age: <span id="ageValue">18</span> years</h3>' +
        '<input type="range" id="ageSlider" min="18" max="100" ' +
        'value="18" step="1" style="width:100%">' +
        '<div style="display:flex;justify-content:space-between">' +
        '<span>18 years</span><span>100 years</span></div>' +

        '<p style="margin-top:20px"><label>' +
        '<input type="checkbox" id="adultConfirm"> ' +
        'I confirm that I am at least 18 years old.' +
        '</label></p>' +

        '<hr><h3>3. Topic Familiarity</h3>' +
        '<p>How familiar are you with Round Robin CPU scheduling ' +
        'in Operating Systems?</p>' +

        '<h3>Familiarity: <span id="familiarityValue">1</span> / 5</h3>' +
        '<input type="range" id="familiaritySlider" min="1" max="5" ' +
        'value="1" step="1" style="width:100%">' +
        '<div style="display:flex;justify-content:space-between">' +
        '<span>1 - Do not know at all</span>' +
        '<span>5 - Very familiar</span></div>' +

        '<p style="margin-top:30px">' +
        '<button id="saveDemographics" class="btn btn-primary btn-lg">' +
        'Continue to Audio/Video Check</button></p>';

    stage(html);

    $("#ageSlider").on("input change", function() {
        $("#ageValue").text($(this).val());
    });

    $("#familiaritySlider").on("input change", function() {
        $("#familiarityValue").text($(this).val());
    });

    $("#saveDemographics").on("click", function() {
        var gender = $('input[name="gender"]:checked').val();
        var age = Number($("#ageSlider").val());
        var familiarity = Number($("#familiaritySlider").val());

        if (!gender) {
            alert("Please select a gender option.");
            return;
        }

        if (!$("#adultConfirm").is(":checked")) {
            alert("Please confirm that you are at least 18 years old.");
            return;
        }

        $("#saveDemographics").prop("disabled", true);

        psiTurk.recordTrialData({
            phase: "demographics",
            gender: gender,
            age: age,
            round_robin_familiarity: familiarity
        });

        psiTurk.recordUnstructuredData("gender", gender);
        psiTurk.recordUnstructuredData("age", age);
        psiTurk.recordUnstructuredData(
            "round_robin_familiarity", familiarity
        );

        saveProgress(showAudioVideoCheck);
    });
};

var showAudioVideoCheck = function() {
    var html =
        '<h1>Audio and Video Check</h1>' +
        '<p>Please play the video, listen to the pronunciation, ' +
        'and read the word displayed on the screen.</p>' +

        '<video id="avTestVideo" controls playsinline preload="metadata" ' +
        'style="width:100%;max-height:420px">' +
        '<source src="/static/materials/audio_video_check.mp4" ' +
        'type="video/mp4">' +
        'Your browser cannot play this video.</video>' +

        '<div style="margin-top:25px">' +
        '<label for="heardWord"><strong>1. What word did you hear?</strong></label>' +
        '<input id="heardWord" type="text" class="form-control" ' +
        'autocomplete="off" style="margin:10px 0 20px">' +

        '<label for="shownWord"><strong>2. What word was shown ' +
        'in the video?</strong></label>' +
        '<input id="shownWord" type="text" class="form-control" ' +
        'autocomplete="off" style="margin:10px 0 20px">' +

        '<button id="submitAVCheck" class="btn btn-primary btn-lg">' +
        'Submit and Continue</button></div>';

    stage(html);

    var videoPlayed = false;
    $("#avTestVideo").on("play", function() {
        videoPlayed = true;
    });

    $("#submitAVCheck").on("click", function() {
        var heard = $("#heardWord").val().trim();
        var shown = $("#shownWord").val().trim();

        if (!videoPlayed) {
            alert("Please play the test video first.");
            return;
        }

        if (!heard || !shown) {
            alert("Please answer both questions.");
            return;
        }

        var expected = "balance";
        var heardCorrect = heard.toLowerCase() === expected;
        var shownCorrect = shown.toLowerCase() === expected;

        $("#submitAVCheck").prop("disabled", true);

        psiTurk.recordTrialData({
            phase: "audio_video_check",
            heard_word: heard,
            shown_word: shown,
            heard_correct: heardCorrect,
            shown_correct: shownCorrect,
            both_correct: heardCorrect && shownCorrect
        });

        psiTurk.recordUnstructuredData("av_heard_word", heard);
        psiTurk.recordUnstructuredData("av_shown_word", shown);
        psiTurk.recordUnstructuredData(
            "av_both_correct", heardCorrect && shownCorrect
        );

        saveProgress(function() {
            new HRIExperiment();
        });
    });
};

var HRIExperiment = function() {
    if (mycondition !== 0 && mycondition !== 1) {
        stage("<h2>Invalid experimental condition</h2><p>Please contact the researcher.</p>");
        return;
    }

    psiTurk.recordUnstructuredData("learning_condition", conditionName);
    psiTurk.recordTrialData({
        phase:"assignment",
        condition:mycondition,
        condition_name:conditionName
    });

    var startTime = Date.now();
    var material = robotCondition
        ? '<video id="lessonVideo" controls playsinline preload="metadata" ' +
          'style="width:100%;max-height:520px">' +
          '<source src="/static/materials/round_robin_robot.mp4" type="video/mp4">' +
          'Your browser cannot play this video.</video>'
        : '<iframe title="Round Robin lesson" ' +
          'src="/static/materials/round_robin.pdf#toolbar=1" ' +
          'style="width:100%;height:550px;border:1px solid #ccc"></iframe>';

    stage(
        '<h1>Round Robin CPU Scheduling</h1>' +
        '<p><strong>Learning method:</strong> ' + conditionName + '</p>' +
        '<p>Study the material carefully. You will answer 10 questions afterward.</p>' +
        material +
        '<p style="margin-top:20px"><button id="beginQuiz" ' +
        'class="btn btn-primary btn-lg">Continue to Quiz</button></p>'
    );

    $("#beginQuiz").on("click", function() {
        var elapsed = Math.round((Date.now()-startTime)/1000);
        psiTurk.recordTrialData({
            phase:"learning",
            condition:mycondition,
            exposure_seconds:elapsed
        });
        saveProgress(showQuiz);
    });
};

var showQuiz = function() {
    var quizStart = Date.now();
    var limit = 15 * 60 * 1000;
    var submitted = false;
    var timerId;

    var html = '<h1>Round Robin Knowledge Quiz</h1>' +
        '<p>Answer all 10 questions. You have 15 minutes.</p>' +
        '<h3 id="countdown" style="position:sticky;top:0;background:white;' +
        'padding:12px;border:1px solid #ddd;z-index:10">15:00</h3>';

    quizQuestions.forEach(function(item,i) {
        html += '<div style="padding:16px;margin:15px 0;border:1px solid #ddd">' +
                '<h4>Question '+(i+1)+': '+item.q+'</h4>';
        item.a.forEach(function(option,j) {
            html += '<label style="display:block;margin:10px 0">' +
                    '<input type="radio" name="q'+i+'" value="'+j+'"> ' +
                    String.fromCharCode(65+j)+'. '+option+'</label>';
        });
        html += '</div>';
    });

    html += '<button id="submitQuiz" class="btn btn-primary btn-lg">' +
            'Submit Quiz</button>';

    stage(html);

    function submitQuiz(timedOut) {
        if (submitted) return;
        submitted = true;
        clearInterval(timerId);

        var elapsed = Math.min((Date.now()-quizStart)/1000,900);
        var answers = [];
        var score = 0;

        quizQuestions.forEach(function(item,i) {
            var value = $('input[name="q'+i+'"]:checked').val();
            var answer = value === undefined ? null : Number(value);
            var correct = answer === item.correct;
            if (correct) score++;

            answers.push(answer);

            psiTurk.recordTrialData({
                phase:"quiz_question",
                question_number:i+1,
                answer:answer,
                correct_answer:item.correct,
                is_correct:correct
            });
        });

        quizResults = {
            score: score,
            answers: answers.slice(),
            seconds: Math.round(elapsed * 100) / 100,
            timedOut: timedOut
        };

        psiTurk.recordTrialData({
            phase:"quiz_summary",
            condition:mycondition,
            score:score,
            total_questions:10,
            completion_seconds:Math.round(elapsed*100)/100,
            timed_out:timedOut,
            answers:answers
        });

        psiTurk.recordUnstructuredData("quiz_score",score);
        psiTurk.recordUnstructuredData("quiz_seconds",Math.round(elapsed*100)/100);
        psiTurk.recordUnstructuredData("quiz_timed_out",timedOut);

        stage('<h2>Quiz submitted</h2><p>Saving your responses...</p>');
        saveProgress(showWeightedLesson);
    }

    $("#submitQuiz").on("click",function() {
        if (confirm("Submit your quiz answers?")) submitQuiz(false);
    });

    function updateTimer() {
        if (submitted) return;
        var remaining = Math.max(0,limit-(Date.now()-quizStart));
        var seconds = Math.ceil(remaining/1000);
        var mm = String(Math.floor(seconds/60)).padStart(2,"0");
        var ss = String(seconds%60).padStart(2,"0");
        $("#countdown").text("Time remaining: "+mm+":"+ss);
        if (remaining <= 0) submitQuiz(true);
    }

    updateTimer();
    timerId = setInterval(updateTimer,250);
};



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

var showSurvey = function() {
    var html = '<h1>Post-Learning Survey</h1>' +
        '<p>Rate each statement from 1 (Strongly disagree) ' +
        'to 5 (Strongly agree).</p>';

    surveyItems.forEach(function(item,i) {
        html += '<div style="padding:15px;border-bottom:1px solid #ddd">' +
                '<h4>'+(i+1)+'. '+item[1]+'</h4>';
        for (var n=1;n<=5;n++) {
            html += '<label style="margin-right:18px">' +
                    '<input type="radio" name="'+item[0]+'" value="'+n+'"> '+n+
                    '</label>';
        }
        html += '</div>';
    });

    html += '<p style="margin-top:25px"><button id="finishStudy" ' +
            'class="btn btn-success btn-lg">Finish Study</button></p>';

    stage(html);

    $("#finishStudy").on("click",function() {
        var responses = {};
        for (var i=0;i<surveyItems.length;i++) {
            var key = surveyItems[i][0];
            var value = $('input[name="'+key+'"]:checked').val();
            if (!value) {
                alert("Please answer all survey questions.");
                return;
            }
            responses[key] = Number(value);
        }

        $("#finishStudy").prop("disabled",true);

        Object.keys(responses).forEach(function(key) {
            psiTurk.recordUnstructuredData(key,responses[key]);
        });

        psiTurk.recordTrialData({
            phase:"survey",
            condition:mycondition,
            responses:responses
        });

        saveProgress(function() {
            showResults();
        });
    });
};

$(window).on("load", async function() {
    await init;
    psiTurk.doInstructions(instructionPages,function() {
        showDemographics();
    });
});
