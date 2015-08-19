# The Online MCMC #

A website to provide an online submission interface for running a Markov chain Monte Carlo (MCMC) on some input data. The back-end MCMC used is [emcee](http://dan.iel.fm/emcee/current/) by [Daniel Foreman-Mackey](http://dan.iel.fm/).

The user will enter a model and parameters that they want to fit, the data they want the model fitted to and the likelihood function. It will then return posterior plots and statistics for the fitted parameters.

The website (currently only under testing) can be found at http://theonelinemcmc.com (this will redirect you to a site hosted on the [Google Cloud](https://cloud.google.com/), so the URL will just be an IP address).

The code on this site is licensed under the [MIT License](http://opensource.org/licenses/MIT).

&copy; Matthew Pitkin, 2015
