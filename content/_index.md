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
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: me
      text: ''
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
      headings:
        about: ''
        education: Education
        interests: Interests
    design:
      # Use the new Gradient Mesh which automatically adapts to the selected theme colors
      background:
        gradient_mesh:
          enable: true

      # Name heading sizing to accommodate long or short names
      name:
        size: md # Options: xs, sm, md, lg (default), xl

      # Avatar customization
      avatar:
        size: medium # Options: small (150px), medium (200px, default), large (320px), xl (400px), xxl (500px)
        shape: circle # Options: circle (default), square, rounded

  - block: markdown
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

  - block: resume-experience
    id: experience
    content:
      username: me
    design:
      columns: '2'

  - block: resume-skills
    id: skills
    content:
      title: 'Skills'
      username: me
    design:
      columns: '2'

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
