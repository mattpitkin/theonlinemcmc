# The Online MCMC #

A website to provide an online submission interface for running a Markov chain Monte Carlo (MCMC) on some input data. The back-end samplers used are accessed through [bilby](https://pypi.org/project/bilby/). They are currently [emcee](http://dfm.io/emcee/current/) by [Daniel Foreman-Mackey](http://dan.iel.fm/), [nestle](http://kylebarbary.com/nestle/) by [Kyle Barbary](https://bids.berkeley.edu/people/kyle-barbary), [dynesty](esty.readthedocs.io/en/latest/dynamic.html) by [Josh Speagle](https://joshspeagle.github.io/) and [PYMC3](https://docs.pymc.io/) by [John Salvatier](http://johnsalvatier.org/), [Thomas Wiecki](https://twiecki.io/) and [Fonnesbeck Christopher](https://github.com/fonnesbeck).

The user will enter a model and parameters that they want to fit, the data they want the model fitted to and the likelihood function. It will then return posterior plots and statistics for the fitted parameters.

The website (currently under testing) can be found at http://www.theonlinemcmc.com.

The code on this site is licensed under the [MIT License](http://opensource.org/licenses/MIT).

&copy; Matthew Pitkin, 2015, Catriona Marr, 2018, Francis Webb, 2019
