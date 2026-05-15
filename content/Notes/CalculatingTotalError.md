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

For one of my technical projects, I created an [[antenna-pattern-interpolator|Antenna Pattern Interpolation Tool]] (named "PIE") which was an open source recreation of a function inside MATLAB's Antenna Toolbox. However, when developing it, I used antenna patterns provided by UniFi for their commercial routers. These only had the principal 2D cuts, so I wasn't able to calculate total error by comparing 3D patterns before and after interpolation. What I'm setting out to do here is export the principal 2D slices of an antenna pattern from HFSS, run PIE to get the reconstructed 3D pattern, and then compare that with the 3D antenna pattern exported from HFSS. 

$$
\text{Error}= \left| G(\theta, \phi) - \hat{G}(\theta, \phi) \right|
$$

This would give me a more robust way to test how the tool functions by looking at total error. In addition, I can more easily see how the algorithms perform when presented with complex patterns where the underlying assumptions (e.g. pattern seperability) are violated.
* All gain patterns are for the [[patch-antenna|Microstrip Patch Antenna]] I designed.
* Note: Interpolation was performed using standard weights ($k=2.0$, $n=5.0$). Improved results could be found by tuning weights, but I wanted to test the script's default performance.

## Exporting from HFSS

First, I exported the 3D gain plots for the antenna. This data was exported from HFSS in the form of a CSV, but representative images are displayed below:

<div style="display: flex; justify-content: center; align-items: flex-end; gap: 20px;">
  <div style="width: 40%; text-align: center;">
    <img src="3DPolarPlot.png" alt="3D Polar Plot" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 1. Patch Antenna 3D Polar Plot, Normalized Gain. Exported from HFSS.</em>
    </p>
  </div>

  <div style="width: 55%; text-align: center;">
    <img src="MicrostripPatchModel.png" alt="Patch Antenna Geometry" width="100%">
    <p style="font-size: 0.8rem; color: grey; margin-top: 5px;">
      <em>Fig. 2. Patch Antenna Geometry. Exported from HFSS.</em>
    </p>
  </div>
</div>


## Interpolation Output

Next, I used a script to extract the azimuth and elevation cuts as text files from the CSV with the full 3D pattern. I used this file as an input to generate the following 3D graphs with PIE:

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

* The main lobe has been roughly reconstructed. However, there is a noticeable low-gain band around $90^{\circ}$ on the radial axis. This band seems to drive error in the forward hemisphere.

* The location of the nulls has been correctly captured in the reconstruction with minor angular spreading. There are, however, noticeable errors in gain magnitude as seen in the error.

* Overall, the mean bias of -6 dB shows that the algorithm has a systematic tendency to underestimate gain considerably.

### Approximation Algorithm

<p align="center">
  <img src="ApproxErrorHeatMaps.png" width="85%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 9. Patch antenna error plots, approximation algorithm.</em>
</p>

* Interestingly, this method was by far the most accurate with the lowest RMSE of 4.8 dB. 

* There is better main lobe reconstruction as the radial $90^{\circ}$ null band has decreased.

* While the gain magnitude of the nulls was correctly reconstructed, even more severe degradation in $\phi$-axis spread is observed. The nulls are smeared into a continuous band at the aft hemisphere. This causes the most noticeable zone of error in the back lobe (around $225^{\circ}$ and $135^{\circ}$ on the angular axis).

* With a mean bias of only -1.33 dB, the Approximation method stayed remarkably close to the overall energy envelope of the actual pattern, though still a slight underestimation.


### Hybrid Algorithm

<p align="center">
  <img src="HybridErrorHeatMaps.png" width="85%">
</p>
<p align="center" style="font-size: 0.8rem; color: grey; margin-top: -10px;">
  <em>Fig. 10. Patch antenna error plots, hybrid algorithm.</em>
</p>

* Interestingly the hybrid method, which was designed to be the best of both worlds, has the worst performance in this for this pattern. Mixing approximation and summing seems only to have inhereted the errors of both algorithms. 

* Noticeably, the null band in the main lobe has increased in magnitude. Additionally, the aft-nulls have severe angular smearing with the incorrect gain magnitude of summing.

* The severe mean bias indicates that the Hybrid method aggressively under-predicted the gain.

## Comparison of Algorithms

* In terms of total error, we find that the <u>approximation algorithm achieved the best performance overall</u> (MSE: 22.7562, RMSE: 4.7703), followed by the summing algorithm (MSE: 63.5815, RMSE: 7.9738), then the hybrid algorithm (MSE: 102.0820, RMSE: 10.1036). This is interesting because while it is intuitive to assume that summing would underperform approximation, the tradeoffs between the approximation and hybrid algorithms are much more subtle.

* From the given patterns, we find that all algorithms exhibit a negative mean bias. This indicates they have a systematic behavior of underestimating the gain. 
   * However, we find that the approximation algorithm retained the least overall bias (-1.334 dB), followed by the summing (-5.9947 dB), then hybrid algorithms (-8.3444 dB).
   * This matches exactly what we expect from the literature: that the approximation algorithm is relatively the most "optimistic", the summing algorithm is the most "conservative".