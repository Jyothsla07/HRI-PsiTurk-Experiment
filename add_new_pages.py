from pathlib import Path

p = Path("static/js/task.js")
s = p.read_text()

if "var showDemographics = function()" in s:
    raise SystemExit("Pages already added. No changes made.")

marker = "var HRIExperiment = function() {"
if s.count(marker) != 1:
    raise SystemExit("Could not locate HRIExperiment safely.")

pages = r'''
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

'''

s = s.replace(marker, pages + marker, 1)

old = '''psiTurk.doInstructions(instructionPages,function() {
        new HRIExperiment();
    });'''
new = '''psiTurk.doInstructions(instructionPages,function() {
        showDemographics();
    });'''

if s.count(old) != 1:
    raise SystemExit("Startup pattern not found. No changes made.")

s = s.replace(old, new, 1)
p.write_text(s)

print("SUCCESS: Both pages added and startup updated.")
