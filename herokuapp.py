import os

db_url = os.environ.get("DATABASE_URL", "")

# PsiTurk 3.3.1 expects postgres://
if db_url.startswith("postgresql://"):
    os.environ["DATABASE_URL"] = "postgres://" + db_url[len("postgresql://"):]

import psiturk.experiment_server as exp

exp.launch()
