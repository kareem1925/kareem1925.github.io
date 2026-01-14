---
title: ''
summary: ''
date: 2022-10-24
type: landing

design:
  spacing: '5rem'

sections:
  - block: quantum-hero
    content:
      title: "Kareem H. El-Safty"
      text: "Quantum Software Engineer with a photonics backbone. I build the bridge between photonic hardware and quantum software, focusing on MZI-based photonic processors and CV/Kerr kernels."
      button:
        text: Download CV
        url: uploads/resume.pdf
    design: {}

  - block: bloch-hero
    content:
      title: "Career Superposition"
      subtitle: "Operating in a quantum state between classical and quantum computing"
    design: {}

  - block: markdown
    id: about
    content:
      title: '📚 About My Research'
      text: |-
        I'm a quantum machine learning researcher at the intersection of quantum computing and machine learning:

        - **Quantum Photonics** — Piquasso simulator for CV systems
        - **Quantum Optimization** — QAOA and quantum annealing
        - **Quantum ML** — Feature maps and variational circuits
        - **Game Theory** — Nash equilibrium on quantum annealers

        [→ View Full Experience](/experience/) &nbsp;|&nbsp; [→ View Skills](/skills/) &nbsp;|&nbsp; [→ View Courses](/courses/)
    design:
      columns: '1'
      background:
        color: '#f8fafc'

  - block: collection
    id: projects
    content:
      title: Projects & Software
      filters:
        folders:
          - projects
    design:
      view: card
      columns: 2

  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publications
        featured_only: false
    design:
      view: article-grid
      columns: 2
      background:
        color: '#f8fafc'
---
