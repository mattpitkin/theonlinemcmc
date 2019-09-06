# The Online MCMC #

A website to provide an online submission interface for running a stochastic sampling method (Markov chain Monte Carlo, or nested sampling) to draw samples for a posterior probability distribution given a likelihood and some input data. The back-end samplers used are accessed through [bilby](https://pypi.org/project/bilby/). They are currently [emcee](http://dfm.io/emcee/current/) by [Daniel Foreman-Mackey](http://dan.iel.fm/), [nestle](http://kylebarbary.com/nestle/) by [Kyle Barbary](https://bids.berkeley.edu/people/kyle-barbary), [dynesty](https://dynesty.readthedocs.io/en/latest/) by [Josh Speagle](https://joshspeagle.github.io/) and [PyMC3](https://docs.pymc.io/) by [John Salvatier](http://johnsalvatier.org/), [Thomas Wiecki](https://twiecki.io/) and [Christopher Fonnesbeck](https://github.com/fonnesbeck).

The user will enter a model and parameters that they want to fit, the data they want the model fitted to and the likelihood function. It will then return posterior plots and statistics for the fitted parameters.

The website can be found at http://www.theonlinemcmc.com. Currently the site does not work properly if using the [Safari](https://www.apple.com/uk/safari/) browser.

The code on this site is licensed under the [MIT License](http://opensource.org/licenses/MIT).

&copy; Matthew Pitkin, 2015, Catriona Marr, 2018, Francis Webb, 2019
