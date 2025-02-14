<!DOCTYPE HTML>
<html>
<head>
<!-- Theme Made By www.w3schools.com - No Copyright -->
<meta name="author" content="Matthew Pitkin">
<meta name="description" content="The Online MCMC">
<meta name="keywords" content="MCMC, Markov chain Monte Carlo, Bayesian, emcee, python, data analysis, probability">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">


<!-- Include theme font -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Include MathJax -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

<!-- Include script to create the input data table and output the python script -->
<script type="text/javascript" src="createdata.js?ver<%=DateTime.Now.Ticks.ToString()%"></script>

<!-- Include script to create tabs - https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="simple.css"/>

<!-- icon -->
<link rel="icon" type="image/png" href="logo.png"/>

<title>The Online MCMC</title>
</head>

<body>

<!-- site data tracking -->
<!-- ?php include_once("analyticstracking.php") ?> -->

<!-- php code to write out python and submit process -->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $resdir = 'results';

  if (!empty($_POST["pyfile"])) {
    $outdir = $resdir.'/'.filter_var($_POST["outdir"], FILTER_SANITIZE_STRING);
    $_SESSION["outdir"] = $outdir;
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    $pyfile = $_POST["pyfile"];
    // output data to file
    file_put_contents($outdir.'/pyfile.py', $pyfile);
  }

  if (!empty($_POST["modelfile"])) {
    $outdir = $resdir.'/'.filter_var($_POST["outdir"], FILTER_SANITIZE_STRING);
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    $modelfile = $_POST["modelfile"];
    // output data to file
    file_put_contents($outdir.'/mymodel.py', $modelfile);
  }

  if(!empty($_POST["labelab"])){
    if ($_POST["labelab"] == "abscissafile"){
      // get directory and check if it exists
      $outdirab = $resdir.'/'.filter_var($_POST["outdirab"], FILTER_SANITIZE_STRING);
      if (!file_exists($outdirab)){
        mkdir($outdirab, 0777, true);
      }

      if ($_FILES["file"]["name"]){
        // rename the uploaded abscissa file to abscissa_file.txt
        move_uploaded_file($_FILES["file"]["tmp_name"], $outdirab."/abscissa_file.txt");
      }
    }
  }

  // if abscissa values have been input output them to a file called abscissa_file.txt
  if (!empty($_POST["abscissa_data"])){
    $outdir = $resdir.'/'.filter_var($_POST["outdir"], FILTER_SANITIZE_STRING);
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    file_put_contents($outdir.'/abscissa_file.txt', $_POST["abscissa_data"]);
  }

  // if input data values have been input output them to a file called data_file.txt
  if (!empty($_POST["input_data"])){
    $outdir = $resdir.'/'.filter_var($_POST["outdir"], FILTER_SANITIZE_STRING);
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    file_put_contents($outdir.'/data_file.txt', $_POST["input_data"]);
  }

  if(!empty($_POST["labeldt"])){
    if ($_POST["labeldt"] == "datafile"){
      // get directory and check if it exists
      $outdirdt = $resdir.'/'.filter_var($_POST["outdirdt"], FILTER_SANITIZE_STRING);
      if (!file_exists($outdirdt)){
        mkdir($outdirdt, 0777, true);
      }

      if ($_FILES["file"]["name"]){
        // rename the uploaded data file to data_file.txt
        move_uploaded_file($_FILES["file"]["tmp_name"], $outdirdt."/data_file.txt");
      }
    }
  }

  // if input sigma values have been input output them to a file called sigma_file.txt
  if (!empty($_POST["sigma_data"])){
    $outdir = $resdir.'/'.filter_var($_POST["outdir"], FILTER_SANITIZE_STRING);
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    file_put_contents($outdir.'/sigma_file.txt', $_POST["sigma_data"]);
  }

  if(!empty($_POST["labelsi"])){
    if (filter_var($_POST["labelsi"], FILTER_SANITIZE_STRING) == "sigmafile"){
      // get directory and check if it exists
      $outdirsi = $resdir.'/'.filter_var($_POST["outdirsi"], FILTER_SANITIZE_STRING);
      if (!file_exists($outdirsi)){
        mkdir($outdirsi, 0777, true);
      }

      if ($_FILES["file"]["name"]){
        // rename the uploaded data file to data_file.txt
        move_uploaded_file($_FILES["file"]["tmp_name"], $outdirsi."/sigma_file.txt");
      }
     }
   }

  // run the MCMC python script
  if(!empty($_POST['runcode'])){
    $errfile = 'err_code.txt';
    $pycommand = 'pyfile.py';
    $pid = shell_exec(sprintf('cd %s; $THEONLINEMCMCPYTHON %s > %s 2>&1 & echo $!', $outdir, $pycommand, $errfile));
  }

  header('Location: https://'.$_SERVER['SERVER_NAME'].'/submitted.php');
  die();
}
?>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">
        <img src="logo.png" width="40" height="40"   alt=""/> THE ONLINE MCMC
      </a>
    </div>
    <div class="navbar-nav-scroll" id="myNavbar">
      <ul class="navbar-nav mr-auto flex-row">
	<li class="nav-item"><a class="nav-link" href="#about">ABOUT</a></li>
        <li class="nav-item"><a class="nav-link" href="#examples">EXAMPLES</a></li>
        <li class="nav-item"><a class="nav-link" href="#input">INPUT</a></li>
        <li class="nav-item"><a class="nav-link" href="#instructions">INSTRUCTIONS</a></li>
        <li class="nav-item"><a class="nav-link" href="#caveats">CAVEATS</a></li>
      </ul>
    </div>
  </div>
</nav>

<div id="about" class="container-top bg-1 text-left">
    <h3>Do you have some data and a model that you want to fit? Well here's the website for you (see <a href="#caveats">caveats</a>)!<br><br>
On this website you can input a model function defined by a set of parameters, including those that you want fit, as well as your data, and it will run a statistical sampling algorithm to estimate the posterior probability distributions of those parameters.<br><br>
This site makes use of the Bayesian inference Python package <a href="https://bilby-dev.github.io/bilby/">Bilby</a> to access a selection of statistical samplers.
Beyond <a href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo">Markov chain Monte Carlo</a> (MCMC), users are able to select from a variety of statistical <a href="#id_sampler_input">samplers</a> and it is encouraged to trial a variety to achieve the best performance for your model.</h3>
</div>

<div id="examples" class="container-fluid bg-2">
  <h3 class="text-center">EXAMPLES</h3>
</div>

<div id="examples" class="container-fluid bg-3 text-center">
  <div class="row">
    <div class="col-sm-4">
      <p>
        This site generates two plots: one of the marginalised posterior plots for each parameter that the user defines...
      </p>
      <img src="posterior_plots.png" class="img-responsive margin" style="width:100%" alt="Image">
    </div>
    <div class="col-sm-4">
      <p>
        ... and another showing the distribution of all the best fit models that were drawn randomly from the posterior distribution.
      </p>
      <img src="model_plot.png" class="img-responsive margin" style="width:100%" alt="Image">
    </div>
    <div class="col-sm-4">
      <p>
        While full instructions and explanations can be found <a href="#instructions">here</a>, the following video showing how to use the website might also be useful. In this case a basic linear model and a small data set were used for simplicity.
      </p>
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/qFPMwbsvMzc" allowfullscreen></iframe>
    </div>
  </div>
</div>

<div id="input" class="container-fluid bg-2">
  <h3 class="text-center">INPUT</h3>
</div>

<div class="container-input bg-2 text-left">
  <p>
    <a style="color: #BD5D38" href="#instructions">Instructions</a> for using this page can be found below the input options.
  </p>
  <script>
  $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
  });
  </script> <!-- script for tooltips -->

  <div>
    Would you like to insert a <a style="color: #BD5D38" href="https://docs.scipy.org/doc/numpy/reference/generated/numpy.piecewise.html">piecewise</a> function? <input type="checkbox" id="id_piece_check" value="false"><br>
    <div id="id_piece_guide" style="display:none"><br>
    <small>
    <b>NOTE</b> - Functions within piecewise must be written as <i><a style="color: #BD5D38" href="https://www.w3schools.com/python/python_lambda.asp">lambda</a></i> functions.<br>
    For example, if all values of x greater than five are multiplied by 'a', and all less than or equal multuplied by 3, it would appear as<br>
    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <i>piecewise(x,[x<=5,x>5],[lambda x:x^3, lambda x:x^a])</i><br>
    More information on how to use and input a piecewise equation can be found <a style="color: #BD5D38" href="https://docs.scipy.org/doc/numpy/reference/generated/numpy.piecewise.html">here</a>. </small>
    </div><br>
    Input <a style="color: #BD5D38" href="#themodel">model</a> equation: <span data-toggle="tooltip" data-placement="right" title="Input the model that you want to fit to your data, eg. m*x." class="glyphicon glyphicon-question-sign"></span>
    <br>
    
      <div class="col-lg-4">
        <input type="text" name="modeleq" id="modeleq" class="form-control" value="">
      </div>
      <input type="button" id="id_model_button" value="Input Model">
  </div>
  <form method="post" id="id_formvariables" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
  <p>
    <div id="id_variables_div" style="display:none">
    Input parameter <a style="color: #BD5D38" href="#thetypes">types</a> and <a style="color: #BD5D38" href="prior">priors</a>: <span data-toggle="tooltip" data-placement="right" title="Define your parameters using the options below." class="glyphicon glyphicon-question-sign"></span>
    <br>
  <table id="table_id">
  </table>
  <br>
<!-- Allow conditions on parameters e.g. x > y or x < 0 && y > 2 to be set -->
      <div class="col-lg-4">
        <input type="hidden" id="id_conditions" class="form-control" value="Conditions (e.g. x < 0 && y > z)" size="30">
      </div>
    </div>
    <br>
  </p>

  <p>
  <div id="id_data_div">
  Input the <a style="color: #BD5D38" href="#id_data_header">data</a>: <span data-toggle="tooltip" title="Input the data that you would like to fit the model to, separated by whitespace or commas." class="glyphicon glyphicon-question-sign"></span>
  <br>
    <div class="col-lg-4">
      <select id="data_input_type" class="form-control">
        <option value="">--Type--</option>
        <option value="Input">Input</option>
        <option value="Upload">Upload</option>
      </select>
    </div>
  </div>
  <div class="col-lg-4">
    <input type="hidden" id="id_submit_data_upload"  value="\" class="form-control"> 
    <textarea style="display:none" class="form-control" id="id_submit_data_form" ></textarea>
  </div>
  </p>

  <p>
  <div id="id_likelihood_div">
    <br><br>Input the <a style="color: #BD5D38" href="#id_likelihood_header">likelihood</a>: <span data-toggle="tooltip" title="Define the likelihood function using the options below." class="glyphicon glyphicon-question-sign"></span>
    <table id="like_table">
      <tr id="like_row"><td>
        <select id="likelihood_input_type" class="form-control">
          <option value="">--Type--</option>
          <option value="Gaussian">Gaussian</option>
          <option value="Studentst">Student's t</option>
          <option value="Poisson">Poisson</option>
        </select></td>
      </tr>
    </table>
  </div>
  </p>

    <div id="id_sampler_div">
    Input the <a style="color: #BD5D38" href="#id_sampler_input">sampler</a>: <span data-toggle="tooltip" title="Define the sampler using the options below." class="glyphicon glyphicon-question-sign"></span>
    <table id="sample_table">
      <tr id="sample_row"><td>
        <select id="sampler_input_type" class="form-control">
          <option value="">--Type--</option>
          <option value="emcee">Emcee</option>
          <option value="dynesty">Dynesty</option>
          <option value="nestle">Nestle</option>
          <option value="pymc3">PyMC3</option>
        </select></td>
      </tr>
      
    </table>
  </div>
  </p>

  <p>
  <div id="id_emcee_div" style="display:none">
    Input the <a style="color: #BD5D38" href="#mcmc">MCMC sampler parameters</a> : <span data-toggle="tooltip" title="Set the sampler parameters - use the defaults if you're unsure." class="glyphicon glyphicon-question-sign"></span>
    <br> <i> <font color = "#809793">Note - burn-in iterations are subtracted from the total number of iterations - therefore the value must be less than 
    the total number of iterations.</font></i><br>
    <table id="emcee_table">
      <tr>
        <td>&bull; Number of ensemble points (default: 100)</td>
        <td><input type="text" class="form-control" id="mcmc_nensemble" value="100"></td>
      </tr>
      <tr>
        <td>&bull; Number of MCMC interations (default: 2000)</td>
        <td><input type="text" class="form-control" id="mcmc_niteration" value="2000"></td>
      </tr>
      <tr>
        <td>&bull; Number of MCMC burn-in interations (default: 1000)</td>
        <td><input type="text" class="form-control" id="nburn" value="1000"></td>
      </tr>
    </table>
  </div>
  </p>

  <p>
  <div id="id_dynesty_div" style="display:none">
    Input the <a style="color: #BD5D38" href="#dynesty">Dynesty sampler parameters</a>: <span data-toggle="tooltip" title="Set the sampler parameters - use the defaults if you're unsure." class="glyphicon glyphicon-question-sign"></span>
    <table id="dynesty_table">
      <tr>
        <td>&bull; Number of live points (default: 1000)</td>
        <td><input type="number" class="form-control" id="nlive" value="1000"></td>
      </tr>
    </table>
  </div>
  </p>

  <p>
  <div id="id_nestle_div" style="display:none">
  Input the <a style="color: #BD5D38" href="#nestle">Nestle sampler parameters</a>:<br>
  (<i>Note: Method = "Multi" is recommended for <a style="color: #BD5D38" href="https://en.wikipedia.org/wiki/Multimodal_distribution">multimodal</a> problems) </i><span data-toggle="tooltip" title="Set the sampler parameters - use the defaults if you're unsure." class="glyphicon glyphicon-question-sign"></span>
    <table id="nestle_table">
      <tr>
        <td>&bull; Number of live points (default: 1000)</td> 
        <td><input type="text" class="form-control" id="nlive" value="1000"></td> 
      </tr>
      <tr>
        <td>&bull; Method used to select new points </td>
        <td><select id="nestle_method" class="form-control">
          <option value="">--Method--</option>
          <option value="'classic'">Classic</option>
          <option value="'single'">Single</option>
          <option value="'multi'">Multi</option>
        </select></td>
        
      </tr>
    </table>
    
  </div>
  </p>

  <p>
  <div id="id_pymc3_div" style="display:none">
  Input the <a style="color: #BD5D38" href="#pymc3">PyMC3 sampler parameters</a>: <span data-toggle="tooltip" title="Set the sampler parameters - use the defaults if you're unsure." class="glyphicon glyphicon-question-sign"></span>
    <table id="pymc3_table">
      <tr>
        <td>&bull; Number of number of sample draws from the posterior chain (default: 1000)</td> 
        <td><input type="text" class="form-control" id="draws" value="1000"></td> 
      </tr>
      <tr>
        <td>&bull; Number of MCMC chains to run (default: 2)</td> 
        <td><input type="text" class="form-control" id="chains" value="2"></td> 
      </tr>
      <tr>
        <td>&bull; Number of burn-in samples per chain (default: 500)</td> 
        <td><input type="text" class="form-control" id="nburn" value="500"></td> 
      </tr>
    </table>
    
  </div>
  </p>

  <p>
    Please supply your email address. A link to your results will be sent to you once it is complete:
    <div class="col-lg-4">
      <input type="email" id="id_email" class="form-control">
    </div>
  </p>

  <input type="button" id="id_submit_variables" value="Submit">
  </form>
  <br>
  <p>
    Any results will be available for 15 days following completion.<br>They will then be deleted, so please download any results that you would like to keep for longer.
  </p>
</div>

<div id="instructions" class="container-fluid bg-3 text-left">
  <h2 class="text-center">INSTRUCTIONS</h2>
  <!-- Not currently working
  <h3 class="text-left" id="randexample">Generate Random Example</h3>
  <p>
  To demonstrate how the site works, click <a href="#input" class="btn btn-default" id="id_randexample">here</a> to generate a random example with data. Once selected, it is possible to alter values and equations before submitting.
  </p> 
  -->
  <div class="container-fixed">
    <ul class="nav nav-pills fixed-top-2">
      <li class="nav-item"><a class="nav-link active" href="#themodel">The Model</a></li>
      <li class="nav-item"><a class="nav-link" href="#thetypes">Parameter Types</a></li>
      <li class="nav-item"><a class="nav-link" href="#prior">Priors</a></li>
      <li class="nav-item"><a class="nav-link" href="#id_data_input">Data Input</a></li>
      <li class="nav-item"><a class="nav-link" href="#id_likelihood_header">Likelihood Input</a></li>
      <li class="nav-item"><a class="nav-link" href="#id_sampler_input">Sampler Input</a></li>
      <li class="nav-item"><a class="nav-link" href="#functions">Functions</a></li>
    </ul>   
  </div>

  <h3 class="text-left" id="themodel">The model</h3>
  <p>
  Firstly, you must input the model that you want to fit to your data. When inputting this model you can use the standard operators "+", "-", "*" (multiplication), "/" (division). Allowable functions (such as trigonometric functions) and constants are listed <a href="#functions">below</a>. To raise a value to a given power use either "^" or "**".
  It is advised to <a href="https://plot.ly/create/#/">plot</a> just your data points initially to give an indication of what model you could use.
  </p>
  
  <p>
  When entering the model be careful to use parentheses to group the required parts of the equation. Click <span id="showexample">here</span> to show an example input model.
    <div id="example" class="example" style="display: none">
      <div id="close">
      </div>
      To input the model \(2.2 \sin{(2\pi f t)} + a t^2 - \frac{e^{2.3}}{b}\) you would write:
      <pre>
        2.2*sin(2.0*pi*f*t) + a*t^2 - (exp(2.3)/b)
      </pre>
      The webpage will parse this information and extract the parameters \(f\), \(t\), \(a\) and \(b\).
    </div>
  </p>
  <br>

  <h3 class="text-left" id="thetypes">Parameter types</h3>
  <p>
    Once the model is submitted you can choose each parameter's <em>type</em>:
    <ul>
      <li><strong>constant</strong>: the parameter is a fixed constant that you can define a numerical value for;</li>
      <li><strong>variable</strong>: the parameter is a variable that you would like to fit and for which you will need to define a <a href="https://en.wikipedia.org/wiki/Prior_probability">prior</a> (see <a href="#prior">here</a> for information on the prior type);</li>
      <li><strong><a href="https://en.wikipedia.org/wiki/Dependent_and_independent_variables#Independent_variable">independent variable</a> / <a href="https://en.wikipedia.org/wiki/Abscissa">abscissa</a></strong>: the parameter is a value, or set of values, at which the model is defined (e.g. in the above example the <code>t</code> (time) value could be such a parameter) that you can input directly or through file upload (uploaded files can be plain ascii text with whitespace or comma separated values). Currently only one parameter can be given as an <em>independent variable</em>, i.e. only one-dimensional models are allowed.</li>
    </ul>
  </p>
  <br>

  <h3 class="text-left" id="prior">Prior</h3>
  <p>
    There are currently three <a href="https://en.wikipedia.org/wiki/Prior_probability">prior probability distributions</a> that you can choose for a variable:
    <ul>
      <li><strong>Uniform</strong>: this is a constant <a href="https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)">probability distribution</a> defined within a minimum and maximum range, with zero probability outside that range. This is a <a href="https://en.wikipedia.org/wiki/Prior_probability#Uninformative_priors">non-informative prior</a> for a <a href="https://en.wikipedia.org/wiki/Location_parameter">location parameter</a> (i.e. a parameter that is invariant to shifts);</li>
      <li><strong>Log(Uniform)</strong>: this is a constant <a href="https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)">probability distribution</a> in the logarithm of the parameter, defined within a minimum and maximum range, with zero probability outside that range. This is a non-informative prior for a <a href="https://en.wikipedia.org/wiki/Scale_parameter">scale parameter</a> (i.e. a parameter that is invariant to scalings and can only take positive values);</li>
      <li><strong>Gaussian</strong>: this is a <a href="https://en.wikipedia.org/wiki/Normal_distribution">Gaussian (or Normal) probability distribution</a> for which the <a href="https://en.wikipedia.org/wiki/Mean">mean</a> and <a href="https://en.wikipedia.org/wiki/Standard_deviation">standard deviation</a> must be specified. This is the least informative distribution if only the mean and standard deviation are known.
      <li><strong>Exponential</strong>: this is an <a href="https://en.wikipedia.org/wiki/Exponential_distribution">Exponential probability distribution</a> (\(e^{-x/\mu}\)) for which the mean, <em>&mu;</em>, must be specified. This is the least informative distribution if only the mean is known.
    </ul>
    If you are unsure about what is best to use then a <em>Uniform</em> distribution with a range broad enough to cover your expectations of the parameter is the simplest option.
  </p>
  <br>

  <h3 class="text-left" id="id_data_header">Data input</h2>
  <p>
    Input the data that you would like to fit the model to. You can directly choose to input values directly in the form below (with whitespace or comma separated values), or upload a file containing the data (again with whitespace, or comma separated values). The number of input data points must be the same as the number of values input for the independent variable/abscissa parameter provided above.
  </p>
  <br>

  <h3 class="text-left" id="id_likelihood_header">Likelihood input</h3>
  <p>
    There are currently three given <a href="https://en.wikipedia.org/wiki/Likelihood_function">likelihood functions</a>:
    <ul>
      <li><strong>Gaussian</strong>: a <a href="https://en.wikipedia.org/wiki/Normal_distribution">Gaussian (or Normal) probability distribution</a> (this is one of the most common, and is often the <a href="https://en.wikipedia.org/wiki/Prior_probability#Uninformative_priors">least informative</a>, likelihood functions). If using this likelihood function there are three additional options:
      <ul>
        <li>input a single known value for the standard deviation, &sigma;, of noise in the data;
        <li>input a set of values (either directly into the form as a set of whitespace or comma separated values, or though uploading an ascii text file of the values) of the standard deviation of the noise, with one value per data point;
        <li>choose to include the noise standard deviation as another parameter to be fit (i.e. if it is unknown). If you choose this option then a prior (as <a href="#prior">above</a>) is required.
      </ul>
      <li><strong>Student's <em>t</em></strong>: the <a href="https://en.wikipedia.org/wiki/Student%27s_t-distribution">Student's <em>t</em> likelihood</a> is similar to the Gaussian likelihood, but it does not require a noise standard deviation to be given (the noise is assumed to be <a href="https://en.wikipedia.org/wiki/Stationary_process">stationary</a> over the dataset and has been analytically <a href="https://en.wikipedia.org/wiki/Marginal_distribution">marginalised</a> over).
      <li><strong>Poisson</strong>: the <a href="https://en.wikipedia.org/wiki/Poisson_distribution">Poisson distribution</a> is similar to the Gaussian, however it deals with discrete random variables, such as counting a radioactive decay source. The data input therefore is required to be integer counts and only positive values.
    </ul>
  </p>
  <br>

  <h3 class="text-left" id="id_sampler_input">Sampler Inputs</h3>
  Through <a href="https://bilby-dev.github.io/bilby/">Bilby</a> one can select from a variety of statistical samplers, each utilising a slightly different algorithm to sample from the posterior distribution of the parameter space. The samplers available are broken down into
  two separate classes, <a href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo">Markov chain Monte Carlo</a> methods (see <a href="http://dan.iel.fm/emcee/">emcee</a> and <a href="https://docs.pymc.io/">PyMC3</a>) and <a href="https://en.wikipedia.org/wiki/Nested_sampling_algorithm">Nested Sampling algorithms</a> (see <a href="https://dynesty.readthedocs.io/en/latest/index.html">Dynesty</a> and <a href="http://kylebarbary.com/nestle/">Nestle</a>).
  <br>
  <br>
  <div class="container" width="80px">
    <ul class="nav nav-pills">
    <li class="nav-item active"><a class="nav-link active" data-toggle="pill" href="#mcmc">emcee</a></li>
    <li class="nav-item"><a class="nav-link" data-toggle="pill" href="#dynesty">Dynesty</a></li>
    <li class="nav-item"><a class="nav-link" data-toggle="pill" href="#nestle">Nestle</a></li>
    <li class="nav-item"><a class="nav-link" data-toggle="pill" href="#pymc3">PyMC3</a></li>
    </ul>

    <div class="tab-content" style="max-width:80%">
      <div id="mcmc" class="tab-pane active">
        <p>
<a href="http://dan.iel.fm/emcee/current">emcee</a> is an MCMC algorithm that aims to draw samples (a chain of points) from the posterior probability distributions of the parameters. You need to tell it how many points to draw. There are three inputs required:
    <ul>
      <li><em>No. of ensemble points ("walkers")</em>: this is essentially the <a href="http://dan.iel.fm/emcee/current/user/faq/#what-are-walkers">number of independent chains</a> within the MCMC. This needs to be an even number and in general should be at least twice the number of fitting parameters that you have. Using a large value (e.g. 100) should be fine, but you could run into lack-of-memory issues if the number is too high (1000s);
      <li><em>No. of iterations</em>: this is the number of points per chain for each of the ensemble points. The product of this number and the number of ensemble points will be the total number of samples that you have for the posterior;
      <li><em>No. of <a href="http://support.sas.com/documentation/cdl/en/statug/63033/HTML/default/viewer.htm#statug_introbayes_sect007.htm">burn-in iterations</a></em>: this is the number of iterations (for each "walker") that are thrown away from the start of the chain (the iteration points above come after the burn-in points). This allows time for the MCMC to converge on the bulk of the posterior and for points sampled away from that to not be included in the final results.
    </ul>
    <b>Tips</b><br>
    Fitting a multimodal distribution? Try increasing the number of walkers!<br>
    Does your data have little noise(<a href="https://en.wikipedia.org/wiki/Signal-to-noise_ratio">SNR</a>)? Try increasing the number of burn in iterations!<br>
  </p>
      </div>
      <div id="dynesty" class="tab-pane fade">
      <a href="https://dynesty.readthedocs.io/en/latest">Dynesty</a> provides an implementation of the <a href="https://en.wikipedia.org/wiki/Nested_sampling_algorithm">Nested Sampling</a> algorithm, with access to a variety of different sampling method (although here it is currently fixed to used a <a href="https://arxiv.org/abs/0809.3437">MultiNest</a>-based sampling method). Nested sampling is similar to the MCMC method, however the nature of the sampling allows one to calculate the integral of the probability distribution, and as a by-product can produce samples from the marginal posterior distributions. For Dynesty, only one input is required:
      <ul>
        <li><em>No. of live points </em>: this is described in greater detail <a href="https://dynesty.readthedocs.io/en/latest/faq.html#live-point-questions">here</a>. This needs to be a positive integer and in general should be at least 1 greater than the number of fitting parameters that exist.
    </ul>
      </div>
      <div id="nestle" class="tab-pane fade">
      <a href="http://kylebarbary.com/nestle/">Nestle</a> provides an implementation of the <a href="https://en.wikipedia.org/wiki/Nested_sampling_algorithm">Nested Sampling</a> algorithm, with access to a couple of different sampling method (although here it is currently fixed to used a <a href="https://arxiv.org/abs/0809.3437">MultiNest</a>-based sampling method). Nested sampling is similar to the MCMC method, however the nature of the sampling allows one to calculate the integral of the probability distribution, and as a by-product can produce samples from the marginal posterior distributions.  For Nestle, two inputs are required:
      <ul>
          <li><em>No. of live points </em>: the number of active points, a positive interger at least one greater than the number of fitting parameters that exist. </li>
          <li><em>Method</em> : How the sampler chooses new points within the target parameter space. Currently can choose from 'Classic', 'Single' or 'Multi'. Further information can be found <a href="http://kylebarbary.com/nestle/">here</a></li>
        </ul>
      </div>
      <div id="pymc3" class="tab-pane fade">
        <a href="https://docs.pymc.io/">PyMC3</a> is another MCMC sampler, which can uses a variety of efficient sampling algorithms. The output is a chain of points drawn from the posterior probability distributions of the parameters. For PyMC3, three inputs are required:
        <ul>
          <li><em>No. of draws </em>: The number of sample draws from the posterior per chain. </li>
          <li><em>No. of chains </em>: The number of independent MCMC chains to run. </li>
          <li><em>No. of <a href="http://support.sas.com/documentation/cdl/en/statug/63033/HTML/default/viewer.htm#statug_introbayes_sect007.htm">burn-in iterations</a></em>: this is the number of iterations that are thrown away from the start of the chain (the iteration points above come after the burn-in points). This allows time for the MCMC to converge on the bulk of the posterior and for points sampled away from that to not be included in the final results.
        </ul>
      </div>
    </div>
  </div>
  <b>If in doubt use the defaults and see how things <a href="#caveats">turn out</a></b>.
  
</div>

<div id="functions" class="container-fluid bg-1 text-left">
  <h2 class="text-center">ALLOWABLE FUNCTIONS AND CONSTANTS</h2>
  Here is a list of allowable functions within your model. When entering your model use the form given in the <span style="font-family:Courier;">monospace</span> font, with the function argument surrounded by brackets, e.g. <span style="font-family:Courier;">sin(x)</span>.

  <h3 class="text-left">Trigonometric functions</h3>

    <ul class="functionlist">

      <li><a href="https://en.wikipedia.org/wiki/Sine"><span class="describe">Sine</span></a>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.sin.html">sin</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Sine#Inverse">Inverse sine</a></span>: asin <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arcsin.html">arcsin</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Cosine">Cosine</a></span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.cos.html">cos</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Trigonometric_functions#Inverse_functions">Inverse cosine</a></span>: acos <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arccos.html">arccos</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Trigonometric_functions#Sine.2C_cosine_and_tangent">Tangent</a></span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.tan.html">tan</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Trigonometric_functions#Inverse_functions">Inverse tangent</a></span>: atan/atan2 <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arctan.html">arctan</a>/<a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arctan2.html#numpy.arctan2">arctan2</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic</a> sine</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.sinh.html">sinh</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Inverse hyperbolic</a> sine</span>: asinh <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arcsinh.html">arcsinh</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic</a> cosine</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.cosh.html">cosh</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Inverse hyperbolic</a>: cosine</span> acosh <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arccosh.html">arccosh</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic</a> tangent</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.tanh.html">tanh</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Hyperbolic_function">Inverse hyperbolic</a> tangent</span>: atanh <span class="describe">or</span> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.arctanh.html">arctanh</a></li>
    </ul>

  <h3 class="text-left">Other functions</h3>

    <ul class="functionlist">

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Exponential_function">Exponential function</a> <em>e</em></span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.exp.html">exp</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Natural_logarithm">Natural logarithm</a> (base <em>e</em>)</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.log.html">log</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Common_logarithm">Commom logarithm</a> (base 10)</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.log10.html">log10</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Binary_logarithm">Binary logarithm</a> (base 2)</span>: <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.log2.html">log2</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Gamma_function">Gamma function</a></span>: <a href="http://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.special.gamma.html">gamma</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Error_function">Error function</a></span>: <a href="http://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.special.erf.html">erf</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Factorial">Factorial "!"</a></span>: <a href="http://docs.scipy.org/doc/scipy-0.16.0/reference/generated/scipy.misc.factorial.html">factorial</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Heaviside_step_function">Heavside function </a></span>: <a href="https://docs.scipy.org/doc/numpy-1.15.1/reference/generated/numpy.heaviside.html">heaviside</a></li>

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Piecewise">Piecewise function </a></span>: <a href="https://docs.scipy.org/doc/numpy/reference/generated/numpy.piecewise.html">piecewise</a></li>

    </ul>

  <h3 class="text-left">Constants</h3>

  These constants can be input rather than having to give their numerical values.

    <ul class="functionlist">

      <li><span class="describe"><a href="https://en.wikipedia.org/wiki/Pi">&pi;</a></span>: pi</li>

    </ul>
</div>

<div id="caveats" class="container-fluid bg-3 text-left">
  <h2>CAVEATS</h2>

  <p>
    The sampling algorithms provided are not guaranteed to produce sensible results every time, and your output may contain errors or look odd. Some information and trouble shooting for the samplers can be found <a href="https://bilby-dev.github.io/bilby/samplers.html">here</a>.
  </p>
  <p>
    For very high <a href="https://en.wikipedia.org/wiki/Signal-to-noise_ratio">SNR</a> models, it is possible for MCMC solutions to converge very slowly as exploring the parameter space becomes difficult. For such cases, solutions will take longer to be produced.
  </p>
  <p>
    If users really want to understand what is being done by this code I would advise learning about <a href="https://en.wikipedia.org/wiki/Bayesian_statistics">Bayesian analyses</a> and <a href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo">Markov chain Monte Carlo</a> methods. I would also advise learning <a href="https://www.python.org/">Python</a>, or another programming language, and coding the analysis up themselves, particularly if you have a more complex problem. However, this site aims to be useful starting point.
  </p>
</div>

<!-- include footer -->
<?php
$shareurl = "https://www.theonlinemcmc.com";
include('footer.inc');
?>

</div>
</body>
</html>
