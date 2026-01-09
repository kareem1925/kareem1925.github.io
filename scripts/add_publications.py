import os
import datetime

publications = [
    {
        "title": "Piquasso: A photonic quantum computer simulation software platform",
        "authors": ["Z. Kolarovszki", "T. Rybotycki", "P. Rakyta", "Á. Kaposi", "B. Poór", "S. Jóczik", "me", "Z. Zimborás"],
        "date": "2025-01-01",
        "publication_types": ["article-journal"],
        "publication": "Quantum",
        "abstract": "Piquasso is a photonic quantum computer simulation software platform.",
        "tags": ["Quantum Computing", "Photonics", "Simulation", "Software"],
        "url_source": "https://quantum-journal.org/",
        "folder": "piquasso"
    },
    {
        "title": "Robust calibration and energy optimization in reconfigurable photonic processors",
        "authors": ["I. A. Litvin", "G. Elmas", "me", "S. Chaudhary", "J. Nötzel"],
        "date": "2025-01-01",
        "publication_types": ["article-journal"],
        "publication": "Optics Express",
        "abstract": "Robust calibration and energy optimization in reconfigurable photonic processors.",
        "tags": ["Photonics", "Calibration", "Optimization"],
        "url_source": "https://opg.optica.org/oe/home.cfm",
        "folder": "robust-calibration-photonic"
    },
    {
        "title": "PhotonWeave",
        "authors": ["S. Sekavčnik", "me", "J. Nötzel"],
        "date": "2025-01-01",
        "publication_types": ["article-journal"],
        "publication": "Journal of Open Source Software",
        "abstract": "PhotonWeave: A software for photonic quantum computing.",
        "tags": ["Photonics", "Software", "Quantum Computing"],
        "url_source": "https://joss.theoj.org/",
        "folder": "photonweave"
    },
    {
        "title": "Quantum advantages for data transmission in future networks: An overview",
        "authors": ["Z. Amiri", "S. Dehdashti", "me", "I. Litvin", "P. Munar-Vallespir", "J. Noetzel", "A. Winter"],
        "date": "2024-01-01",
        "publication_types": ["article-journal"],
        "publication": "Computer Networks",
        "abstract": "An overview of quantum advantages for data transmission in future networks.",
        "tags": ["Quantum Networking", "Data Transmission", "Communication"],
        "url_source": "",
        "folder": "quantum-advantages-networks"
    },
    {
        "title": "Enhancing Quantum Machine Learning: The Power of Non-Linear Optical Reproducing Kernels",
        "authors": ["S. Dehdashti", "P. Tiwari", "me", "P. Bruza", "J. Notzel"],
        "date": "2024-01-01",
        "publication_types": ["preprint"],
        "publication": "arXiv preprint",
        "abstract": "This work explores the power of non-linear optical reproducing kernels in enhancing quantum machine learning.",
        "tags": ["Quantum Machine Learning", "Kernels", "Photonics"],
        "url_source": "https://arxiv.org/abs/2400.00000",
        "folder": "enhancing-qml-optical-kernels"
    },
    {
        "title": "Abnormal Human Activity Recognition in Video Surveillance: A Survey",
        "authors": ["I. Mostafa", "me", "M. Gamal", "R. Abdel-Kader"],
        "date": "2024-01-01",
        "publication_types": ["article-journal"],
        "publication": "Port-Said Engineering Research Journal",
        "abstract": "A survey on abnormal human activity recognition in video surveillance.",
        "tags": ["Computer Vision", "Activity Recognition", "Surveillance"],
        "url_source": "",
        "folder": "abnormal-activity-recognition"
    },
    {
        "title": "QuReed",
        "authors": ["S. Sekavčnik", "me", "J. Nötzel"],
        "date": "2024-01-01",
        "publication_types": ["preprint"],
        "publication": "arXiv preprint",
        "abstract": "QuReed: A quantum computing software/tool.",
        "tags": ["Quantum Computing", "Software"],
        "url_source": "",
        "folder": "qureed"
    }
]

base_path = "content/publications"
if not os.path.exists(base_path):
    os.makedirs(base_path)

for pub in publications:
    folder_path = os.path.join(base_path, pub["folder"])
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    file_path = os.path.join(folder_path, "index.md")
    
    # Format authors list with yaml syntax
    authors_yaml = "\n".join([f"  - {author}" for author in pub["authors"]])
    tags_yaml = "\n".join([f"  - {tag}" for tag in pub["tags"]])
    
    content = f"""---
title: "{pub['title']}"
date: {pub['date']}
publishDate: {pub['date']}
authors:
{authors_yaml}
publication_types: {pub['publication_types']}
publication: "{pub['publication']}"
abstract: "{pub['abstract']}"
tags:
{tags_yaml}
featured: false
links:
  - type: source
    url: {pub['url_source']}
---
"""
    with open(file_path, "w") as f:
        f.write(content)
    print(f"Created {file_path}")
