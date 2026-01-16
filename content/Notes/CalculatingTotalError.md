---
title: Calculating Total Error
date: 2026-01-08
tags:
  - Python
  - Electromagnetics
  - Antenna Theory
  - 3D Interpolation
  - HFSS
---

## Overview

For one of my technical projects, I created an [[antenna-pattern-interpolator|Antenna Pattern Interpolation Tool]] (named "PIE") which was an open source recreation of a function inside MATLAB's Antenna Toolbox. However, when developing it, I used antenna patterns provided by UniFi for their commercial routers. These only had the principal 2D cuts, so I wasn't able to calculate total error by comparing 3D patterns before and after interpolation. 

What I'm setting out to do here is export the principal 2D slices of an antenna pattern from HFSS, run PIE to get the reconstructed 3D pattern, and then compare that with the 3D antenna pattern exported from HFSS. This would give me a more robust way to test how the tool functions looking at total error.
* All gain patterns are for the [[patch-antenna|Microstrip Patch Antenna]] I designed.
* Note: Interpolation was performed using default weights ($k=2.0$, $n=5.0$)

## Exporting from HFSS

First, I exported the 2D and 3D gain plots for the antenna. This data was exported from HFSS in the form of a CSV, but representative images are displayed below:

<div style="display: flex; justify-content: center; gap: 20px;">
  <div style="width: 48%; text-align: center;">
    <img src="2DPolarPlot-Elevation.png" alt="2D ElevationPlot Patch" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 1. Patch antenna gain plot, elevation cut, exported from HFSS.</em>
    </p>
  </div>

  <div style="width: 48%; text-align: center;">
    <img src="2DPolarPlot-Azimuth.png" alt="2D AzimuthPlot Patch" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 2. Patch antenna gain plot, azimuthal cut, exported from HFSS.</em>
    </p>
  </div>
</div>

<div style="display: flex; justify-content: center; align-items: flex-end; gap: 20px;">
  <div style="width: 40%; text-align: center;">
    <img src="3DPolarPlot.png" alt="3D PolarPlot Patch" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 3. Patch antenna 3D gain plot, exported from HFSS.</em>
    </p>
  </div>

  <div style="width: 55%; text-align: center;">
    <img src="2DGainContourPlotHFSSPatch.png" alt="2D Gain Contour Plot Patch" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 4. Patch antenna 2D gain heatmap, exported from HFSS.</em>
    </p>
  </div>
</div>


## Interpolation Output

Some minor reformatting was required to convert the CSVs for the 2D polar graphs into a single ```.ant``` file. I then used this file as an input to generate the following 3D graphs with PIE:

<p align="center">
  <img src="SummingPostInterpolation.png" width="50%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 5. Patch antenna reconstructed 3D pattern, normalized gain, summing algorithm.</em>
</p>

<p align="center">
  <img src="ApproxPostInterpolation.png" width="50%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 6. Patch antenna reconstructed 3D pattern, normalized gain, approximation algorithm.</em>
</p>

<p align="center">
  <img src="HybridPostInterpolation.png" width="50%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 7. Patch antenna reconstructed 3D pattern, normalized gain, hybrid algorithm.</em>
</p>

## Visual Error Analysis

Now that I had the CSVs for both the 3D pattern from HFSS and the 3D pattern from PIE, I used a script to calculate and visualize the error.

<div style="display: flex; align-items: center; margin-bottom: 2rem; font-family: inherit;">
  <div style="display: flex; align-items: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px; color: black;">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
    <a href="https://github.com/pwm-ii/Antenna3DError" target="_blank" style="text-decoration: none;">
      See Code Here
    </a>
  </div>
</div>

### Summing Algorithm
<p align="center">
  <img src="SummingErrorHeatMaps.png" width="85%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 8. Patch antenna error plots, summing algorithm.</em>
</p>

* Main lobe has been reconstructed in the low $\theta$ region ($\theta < 130^{\circ}$), however, with noticeable angular spreading. We can consider this degradation relatively negligible given that the absolute error graph is predominantly blue in this region, indicating low error (< 5 dB).

* The two nulls have been reconstructed at the correct $\phi$ position (approx. $90^{\circ}$ and $270^{\circ}$). However, we can see that the $\theta$ position of these nulls has been severely degraded.

* As a result of the failure to reconstruct the null structure, large portions of the high-$\theta$ region ($\theta > 120^{\circ}$) are dominated by severe error (red and dark orange).

### Approximation Algorithm

<p align="center">
  <img src="ApproxErrorHeatMaps.png" width="85%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 9. Patch antenna error plots, approximation algorithm.</em>
</p>

* Main lobe has been successfully reconstructed with less angular spreading.

* Nulls have been reconstructed with even more severe degradation in $\phi$-axis spread.


### Hybrid Algorithm

<p align="center">
  <img src="HybridErrorHeatMaps.png" width="85%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 10. Patch antenna error plots, hybrid algorithm.</em>
</p>

* Same fundamental pattern, successful main lobe reconstruction, failed null reconstruction.

* We can note that $\phi$-axis spread is worse than the summing algorithm but better than the approximation algorithm.

## Comparison of Algorithms

* In terms of total error, we find that the <u>approximation algorithm achieved the best performance overall</u> (MSE: 74.11, RMSE: 8.61 dB), followed by the hybrid algorithm (MSE: 88.67, RMSE: 9.42 dB), and then the summing algorithm (MSE: 107.98, RMSE: 10.39 dB). This is interesting because while it is intuitive to assume that the summing algorithm would perform worse, the tradeoffs between the approximation and hybrid algorithms are much more subtle.

* From the given patterns, we find that all algorithms exhibit a negative mean bias. This indicates they have a systematic behavior of underestimating the gain. 
   * However, we find that the approximation algorithm retained the least negative bias (-6.97 dB), followed by the hybrid algorithm (-7.95 dB), then the summing algorithm (-8.81 dB).
   * This matches exactly what we expect from the literature: that the approximation algorithm is relatively the most "optimistic", the summing algorithm is the most "conservative", and the hybrid algorithm is somewhere in between depending on the weights used.