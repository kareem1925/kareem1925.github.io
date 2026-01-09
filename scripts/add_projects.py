import os

projects = [
    # Research Software
    {
        "folder": "photonweave",
        "title": "PhotonWeave",
        "summary": "Photonic toolkit with tests, docs, CI, and CLIs.",
        "tags": ["Quantum Software", "Photonics", "Open Source", "Python"],
        "date": "2025-01-01",
        "links": [{"name": "GitHub", "url": "https://github.com/kareem1925"}],
    },
    {
        "folder": "ktq",
        "title": "KTQ",
        "summary": "Modular QML and photonic research utilities (NumPy/JAX).",
        "tags": ["Quantum Machine Learning", "JAX", "Research Tools", "Python"],
        "date": "2025-01-01",
        "links": [{"name": "GitHub", "url": "https://github.com/kareem1925"}],
    },
    {
        "folder": "piquasso-project",  # Renamed to avoid conflict with publication
        "title": "Piquasso (Contributor)",
        "summary": "Piquasso is a photonic quantum computer simulation software platform.",
        "tags": ["Quantum Simulation", "Photonics", "C++", "Python"],
        "date": "2025-01-01",
        "links": [
            {
                "name": "GitHub",
                "url": "https://github.com/Budapest-Quantum-Computing-Group/piquasso",
            }
        ],
    },
    {
        "folder": "qureed-project",
        "title": "QuReed",
        "summary": "Quantum simulation tooling.",
        "tags": ["Quantum Simulation", "Research Tools"],
        "date": "2024-06-01",
        "links": [{"name": "arXiv", "url": "https://arxiv.org/abs/2406.07638"}],
    },
    # Selected Projects
    {
        "folder": "mzi-power-aware",
        "title": "MZI Power-Aware Synthesis",
        "summary": "Developed an algorithm to reduce photonic chip power while realizing arbitrary unitaries with MZI decompositions.",
        "tags": ["Quantum Photonics", "Optimization", "Calibration"],
        "date": "2024-01-01",
        "links": [],
    },
    {
        "folder": "braket-nash",
        "title": "Braket Nash Workflows",
        "summary": "End-to-end cloud execution on AWS Braket for game-theoretic optimization (Nash equilibrium).",
        "tags": ["AWS Braket", "Quantum Annealing", "Game Theory", "Cloud"],
        "date": "2024-01-01",
        "links": [],
    },
    {
        "folder": "industrial-vision",
        "title": "Industrial Vision Systems",
        "summary": "Built face verification, anti-spoofing, Arabic OCR, and inspection pipelines for clients.",
        "tags": ["Computer Vision", "Machine Learning", "Industrial AI", "OCR"],
        "date": "2021-01-01",
        "links": [],
    },
    {
        "folder": "automl-stacks",
        "title": "AutoML Stacks",
        "summary": "Orchestrated Optuna/AutoKeras/KerasTuner pipelines with custom loss/metrics for reproducible models.",
        "tags": ["AutoML", "MLOps", "Deep Learning"],
        "date": "2020-01-01",
        "links": [],
    },
]

base_path = "content/projects"
if not os.path.exists(base_path):
    os.makedirs(base_path)

for proj in projects:
    folder_path = os.path.join(base_path, proj["folder"])
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, "index.md")

    tags_yaml = "\n".join([f"  - {tag}" for tag in proj["tags"]])

    links_yaml = ""
    if proj["links"]:
        links_yaml = "links:\n" + "\n".join(
            [
                f"  - name: {link['name']}\n    url: {link['url']}\n    icon_pack: fab\n    icon: {link['name'].lower()}"
                for link in proj["links"]
            ]
        )

    content = f"""---
title: "{proj['title']}"
date: {proj['date']}
summary: "{proj['summary']}"
tags:
{tags_yaml}
{links_yaml}
---
"""
    with open(file_path, "w") as f:
        f.write(content)
    print(f"Created {file_path}")
