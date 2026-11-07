# HRI-PsiTurk-Experiment

## Human–Robot Interaction Learning Experiment

A web-based Human–Robot Interaction (HRI) research experiment developed using PsiTurk.

The experiment compares two instructional methods:

- **Robot Condition (Condition 0):** Participants learn through instructional robot videos.
- **PDF Condition (Condition 1):** Participants learn through PDF-based instructional materials.

The learning topic is CPU Round Robin Scheduling.

## Experiment Structure

1. Research consent
2. Participant demographics
3. Audio and video verification
4. Part 1 learning material
5. Part 1 quiz
6. Part 2 learning material
7. Part 2 quiz
8. Post-experiment survey
9. Results and answer review

Both conditions follow the same general experimental structure, but use different instructional materials.

## Supported Operating Systems

The project is intended to run on:

- macOS
- Windows
- Linux

Cross-platform compatibility has not yet been fully tested.

## Prerequisites

Install the following software:

- Python 3.11
- Git
- A modern web browser
- PsiTurk and the project's Python dependencies

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/priyushakilaru/HRI-PsiTurk-Experiment.git
cd HRI-PsiTurk-Experiment
```

Alternatively, click **Code → Download ZIP** on GitHub and extract the downloaded folder.

### 2. Create a Python virtual environment

**macOS / Linux**

```bash
python3.11 -m venv venv
source venv/bin/activate
```

**Windows PowerShell**

```powershell
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
```

If Windows blocks activation, use Command Prompt and run `venv\Scripts\activate.bat`.

### 3. Install dependencies

Once `requirements.txt` has been added to the repository:

```bash
python -m pip install -r requirements.txt
```

### 4. Configure PsiTurk

Create a local `config.txt` using the project's configuration template once it is available.

Configure the local database, server settings, and any required PsiTurk settings.

Do not commit API keys, database passwords, or participant information to GitHub.

### 5. Start the experiment

From the project directory, with the virtual environment activated:

```bash
psiturk
```

In the PsiTurk console:

```text
server on
```

Open the local server address in your browser.

The development server may use:

http://localhost:22362

The actual port depends on the configuration.

## Experiment Materials

The `static/materials/` directory contains instructional videos and PDFs.

The `static/materials/robot_quiz2/` directory contains the robot's individual quiz-question videos.

The `static/js/task.js` file implements the experiment flow, condition selection, quizzes, and data recording.

The `templates/` directory contains the experiment's HTML pages.

## Research Data and Privacy

Participant responses are stored locally according to the PsiTurk database configuration.

Participant databases, research records, credentials, and private configuration files must not be committed to this public repository.

## Development Status

The experiment has been developed locally on macOS. Clean installation, dependency compatibility, and end-to-end testing on Windows and Linux are pending.

## License

No license has been assigned. All rights are reserved unless a license is added.
