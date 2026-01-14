---
# Leave the homepage title empty to use the site title
title: ''
summary: ''
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: '6rem'

sections:
  - block: quantum-hero
    content:
      title: "Kareem H. El-Safty"
      text: "Quantum Software Engineer with a photonics backbone. I build the bridge between photonic hardware and quantum software, focusing on MZI-based photonic processors and CV/Kerr kernels."
      button:
        text: Download CV
        url: uploads/resume.pdf
    design: {}

  - block: markdown
    id: research-focus
    content:
      title: '📚 My Research'
      subtitle: ''
      text: |-
        I'm a quantum machine learning researcher working at the intersection of quantum computing and machine learning. My work focuses on:

        - **Quantum Photonics**: Developing Piquasso, a quantum photonic simulator for Continuous Variable (CV) systems
        - **Quantum Optimization**: Quantum algorithms for combinatorial optimization, including QAOA and quantum annealing
        - **Quantum Machine Learning**: Quantum feature maps and their implications on quantum variational circuits
        - **Game Theory**: Computing Nash equilibrium and bargaining solutions on quantum annealers

        Feel free to reach out for collaborations! 🚀
    design:
      columns: '1'
      background:
        color: '#f8fafc'

  - block: markdown
    id: experience
    content:
      title: 'Research Experience'
      subtitle: ''
      text: |-
        - **Researcher, Quantum Machine Learning — Technical University of Munich (TUM)** *(Nov 2022 – Jul 2025)*  
          MZI calibration and energy optimization; CV/Kerr kernels; joint-detection receivers; reproducible tooling and mentoring.
        - **Quantum Computing Researcher Intern — Dark Star Quantum Lab Inc.** *(Apr 2022 – Jul 2022)*  
          Nash equilibrium workflows for quantum annealing; Gaussian Boson Sampling for optimization.
        - **Research Assistant (Quantum Computing) — Wigner Research Centre for Physics** *(Apr 2020 – May 2022)*  
          Continuous-variable photonic simulation and QML; contributor to Piquasso.
        - **Researcher / Organizer — Alexandria Quantum Computing Group** *(Nov 2019 – Sep 2023)*  
          Organized AQCWS21; ran Qiskit sessions and international collaboration planning.
        - **Co-Founder — QEgypt** *(Apr 2021 – Present)*  
          National quantum-education chapter; events, mentoring, and QWorld challenges.
    design:
      columns: '1'
      background:
        color: '#0f172a'
        text_color_light: true
      css_class: research-experience

  - block: markdown
    id: industry-experience
    content:
      title: 'Industry Experience'
      subtitle: ''
      text: |-
        - **Machine Learning Instructor (Freelance) — Information Technology Institute (ITI)** *(Aug 2021 – Present)*  
          Supervised/unsupervised ML; labs and assessments.
        - **AI Team Leader / Computer Vision Engineer — DevisionX** *(Jul 2018 – Nov 2021)*  
          Face verification/anti-spoofing, Arabic OCR, industrial vision; client delivery and roadmaps.
        - **Artificial Intelligence Engineer — EPITA (Ecole d'Ingenieurs en Informatique)** *(Oct 2020 – Feb 2021)*  
          Fully funded AI Engineer track.
        - **Machine Learning Engineer Specialty — Amazon Web Services (AWS)** *(Sep 2020 – Feb 2021)*  
          Specialty training track.
        - **Dean — School of AI (Ismailia)** *(Aug 2018 – 2020)*  
          Community leadership and developer education.
        - **Graduate Engineering Trainee — IBM** *(Jul 2018 – Aug 2018)*  
          AI and cloud application development tracks.
        - **Instructor — Fab Lab Ismailia** *(Feb 2018 – Sep 2018)*  
          Embedded projects; ML/AI sessions.
        - **Teacher Assistant — edX** *(Jun 2017 – Oct 2017)*  
          Learner support and course delivery.
    design:
      columns: '1'
      background:
        color: '#111827'
        text_color_light: true
      css_class: industry-experience

  - block: resume-skills
    id: skills
    content:
      title: 'Skills'
      username: me
    design:
      columns: '2'
      background:
        color: '#f1f5f9'

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
      background:
        color: '#ffffff'

  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publications
        featured_only: true
    design:
      view: article-grid
      columns: 2
      background:
        color: '#f8fafc'

  - block: collection
    content:
      title: Recent Publications
      text: ''
      filters:
        folders:
          - publications
        exclude_featured: false
    design:
      view: citation

  - block: resume-awards
    id: awards
    content:
      title: 'Awards & Certifications'
      username: me
    design:
      columns: '2'

  - block: markdown
    id: courses
    content:
      title: '📜 Courses & Certifications'
      subtitle: ''
      text: |-
        | Course | Institution | Period |
        |--------|-------------|--------|
        | AWS Certified Machine Learning – Specialty | AWS | Sep 2020 – Feb 2021 |
        | Quantum Optics 2 - Two photons and more | Coursera | Feb 2020 – Apr 2020 |
        | Quantum Machine Learning | edX | Feb 2019 – Apr 2019 |
        | Quantum Mechanics for Scientists and Engineers 1 & 2 | Stanford | Nov 2018 – Mar 2019 |
        | Quantum 101: Quantum Computing & Quantum Internet | edX | Jul 2018 – Nov 2018 |
        | 8.05 Mastering Quantum Mechanics from MIT | edX | Apr 2018 – Aug 2018 |
        | Deep Learning Specialization | Coursera | Feb 2018 – Apr 2018 |
        | Quantum Cryptography | edX | Nov 2017 – Feb 2018 |
        | Python for Everybody Specialization | Coursera | Nov 2015 – Feb 2016 |
    design:
      columns: '1'
---
