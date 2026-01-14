---
title: "PhotonWeave"
date: 2025-01-01
summary: "General-purpose quantum simulator framework focused on Fock-domain optical simulations."
tags:
  - Quantum Software
  - Photonics
  - Open Source
  - Python
links:
  - name: Documentation
    url: https://photon-weave.readthedocs.io/
    icon_pack: fas
    icon: book
  - name: GitHub
    url: https://github.com/kareem1925
    icon_pack: fab
    icon: github
---

Photon Weave is a general-purpose quantum simulator framework that focuses on optical simulations in the Fock domain. It aims to be an easy-to-use simulator, abstracting away the complexities of product space management and operation applications for the user.

### Core Features

*   **Fock Space Management**: Describes quantum states with discrete photon numbers using an orthonormal basis.
*   **Polarization Support**: Native two-dimensional Hilbert space for polarization state manipulation.
*   **Custom Hilbert Spaces**: Represent arbitrary finite-dimensional quantum systems beyond optics.
*   **Multiple Representations**: Switch seamlessly between **Label** (memory-efficient), **State Vector** (pure states), and **Density Matrix** (mixed states) using intuitive `expand()` and `contract()` methods.
*   **Advanced Operations**: Built-in support for Fock operations, polarization operations, and custom quantum channels.

### Architecture

The framework is built around the representation and manipulation of optical states in various Hilbert spaces, providing a robust mathematical foundation for quantum computing research.
