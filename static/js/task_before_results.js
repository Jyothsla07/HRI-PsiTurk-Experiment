
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
    {q:"What type of scheduling algorithm is Round Robin?",
     a:["Non-preemptive","Preemptive","Priority-only","Batch-only"], correct:1},
    {q:"What is the time quantum?",
     a:["Total execution time","Fixed CPU time allocated per turn","Waiting time","Arrival time"], correct:1},
    {q:"Where does an unfinished process go after its quantum?",
     a:["Back of ready queue","Out of the system","Front of queue","Blocked forever"], correct:0},
    {q:"What happens when a process finishes before its quantum expires?",
     a:["It restarts","It leaves the ready queue","It runs again","It waits for another quantum"], correct:1},
    {q:"Which data structure is typically used for Round Robin?",
     a:["Stack","Tree","FIFO queue","Heap"], correct:2},
    {q:"What can happen if the time quantum is very small?",
     a:["More context-switching overhead","No context switches","All jobs finish instantly","Processes cannot arrive"], correct:0},
    {q:"A very large time quantum makes Round Robin resemble which algorithm?",
     a:["Shortest Job First","First-Come, First-Served","Priority scheduling","Shortest Remaining Time"], correct:1},
    {q:"If P1 needs 5 ms and quantum is 2 ms, how much remains after its first turn?",
     a:["1 ms","2 ms","3 ms","5 ms"], correct:2},
    {q:"How is turnaround time calculated?",
     a:["Burst minus waiting","Completion minus arrival","Arrival minus completion","Quantum times burst"], correct:1},
    {q:"How is waiting time calculated?",
     a:["Turnaround minus burst","Burst plus arrival","Completion plus burst","Quantum minus arrival"], correct:0}
];

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
        saveProgress(showSurvey);
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
            
stage(
    '<div style="text-align:center;margin:80px auto">' +
    '<h1>Thank You!</h1>' +
    '<h3>You have successfully completed the study.</h3>' +
    '<p>Your quiz and survey responses have been saved.</p>' +
    '<p>You may now close this browser tab.</p>' +
    '</div>'
);

        });
    });
};

$(window).on("load", async function() {
    await init;
    psiTurk.doInstructions(instructionPages,function() {
        new HRIExperiment();
    });
});
