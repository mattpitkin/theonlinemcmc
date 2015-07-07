<!DOCTYPE HTML>
<html>
<head>
<!-- Include jQuery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

<!-- Include MathJax -->
<!--
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript"
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
-->

<!-- Include script to create the input data table and output the python script -->
<script type="text/javascript" src="createdata.js"></script>

</head>
<body>

<!-- php code to write out python and submit process -->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (!empty($_POST["pyfile"])) {
    $outdir = $_POST["outdir"];
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }

    $pyfile = $_POST["pyfile"];
    // output data to file
    file_put_contents($outdir.'/pyfile.py', $pyfile);
  }

  if(!empty($_POST["labelab"])){
    if ($_POST["labelab"] == "abscissafile"){
      // get directory and check if it exists
      $outdirab = $_POST["outdirab"];
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
    $outdir = $_POST["outdir"];
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }
    file_put_contents($outdir.'/abscissa_file.txt', $_POST["abscissa_data"]);
  }

  // if input data values have been input output them to a file called data_file.txt
  if (!empty($_POST["input_data"])){
    $outdir = $_POST["outdir"];
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }
    file_put_contents($outdir.'/data_file.txt', $_POST["input_data"]);
  }

  if(!empty($_POST["labeldt"])){
    if ($_POST["labeldt"] == "datafile"){
      // get directory and check if it exists
      $outdirdt = $_POST["outdirdt"];
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
    $outdir = $_POST["outdir"];
    if(!file_exists($outdir)){
      mkdir($outdir, 0777, true);
    }
    file_put_contents($outdir.'/sigma_file.txt', $_POST["sigma_data"]);
  }

  if(!empty($_POST["labelsi"])){
    if ($_POST["labelsi"] == "sigmafile"){
      // get directory and check if it exists
      $outdirdsi = $_POST["outdirsi"];
      if (!file_exists($outdirsi)){
        mkdir($outdirsi, 0777, true);
      }

      if ($_FILES["file"]["name"]){
        // rename the uploaded data file to data_file.txt
        move_uploaded_file($_FILES["file"]["tmp_name"], $outdirsi."/sigma_file.txt");
      }
    }
  }
}
?>

<h1>The Online MCMC</h1>

<p>
Do you have some data and a model that you want to fit to it? Well here's the website for you.
On this website you can input a model function defined by a set of parameters including those that you want
fit, and your data, and it will run a <a href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo">Markov
chain Monte Carlo</a> algorithm to estimate the posterior probability distributions of those parameters.
This site makes use of the python MCMC package <a href="http://dan.iel.fm/emcee/current/">emcee</a> written
by <a href="http://dan.iel.fm/">Dan Foreman-Mackey</a>.
</p>

<h2>Your model</h2>

<p>
Firstly, you must input the model that you want to fit to your data. When inputting this model you can use
the standard operators "+", "-", "x", "/". You can also use the trigonometric functions "sin", "cos" and "tan"
including the hyperbolic versions of these functions and there inverses "asin" (or "arcsin"), "acos" (or
"arccos") and "atan"/"atan2" (or "arctan"/"arctan2"). For the natural logarithm of a value use "log", whilst
for log with the base 10 use "log10". For the constant <em>e</em> to the power of a value use "exp". To
raise a value to a given power use either "^" or "**". Other functions currently available are the gamma function
"<a href="http://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.special.gamma.html">gamma</a>" and error function "<a href="http://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.special.erf.html">erf</a>". The
factorial (!) of a value can be obtained using "factorial". The constant &pi; can be input using "pi".
</p>

<p>
When entering the model be careful to use parentheses to group the required parts of the equation.
</p>

<p>
An example of an input model is:<br>
<pre>
2.2*sin(2.0*pi*f*t) + a*t^2 - (exp(2.3)/b)
</pre>
This webpage would parse this information and extract the parameters <code>f</code>, <code>t</code>, <code>a</code>
and <code>b</code>. Once the model is submitted you can choose the type of each parameter:
<ul>
 <li><strong>constant</strong> - the parameter is a fixed constant that you can define</li>
 <li><strong>variable</strong> - the parameter is a variable that you would like to fit for which you will need to define a prior</li>
 <li><strong>independent variable/abscissa</strong> - the parameter is a value, or set of values, at which the
model is defined (e.g. in the above example the <code>t</code> (time) value could be such a parameter) that you can input directly or through file upload (uploaded files can be plain ascii text with whitespace or comma separated
values [in the future xls or ods could be used])</li>
</ul>
</p>

<div>
  Model equation: <input type="test" name="modeleq" id="modeleq" value="">
 <input type="button" id="id_model_button" value="Submit">
</div>


<h2 id="id_input_header"></h2>
<form method="post" id="id_formvariables" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
<div>
  <table id="table_id">
  </table>
<br>
<!-- Allow conditions on parameters e.g. x > y or x < 0 && y > 2 to be set -->
<input type="hidden" id="id_conditions" value="Conditions (e.g. x < 0 && y > z)" size="30">
</div>

<h2 id="id_data_header">Data input</h2>
<div id="id_data_div">
<select id="data_input_type">
  <option value="">--Type--</option>
  <option value="Input">Input</option>
  <option value="Upload">Upload</option>
</select>
<br>
</div>
<input type="hidden" id="id_submit_data_upload">
<textarea style="display:none" id="id_submit_data_form"></textarea>

<h2 id="id_likelihood_header">Likelihood input</h2>
<div id="id_likelihood_div">
  <table id="like_table">
    <tr id="like_row"><td>
      <select id="likelihood_input_type">
        <option value="">--Type--</option>
        <option value="Gaussian">Gaussian</option>
        <option value="Studentst">Student's t</option>
      </select></td>
    </tr>
</table>
</div>

<h2 id="id_mcmc_header">MCMC inputs</h2>
<div id="id_mcmc_div">
<table id="mcmc_table">
  <tr>
    <td>Number of ensemble points (default: 100)</td>
    <td><input type="text" id="mcmc_nensemble" value="100"></td>
  </tr>
  <tr>
    <td>Number of MCMC interations (default: 1000)</td>
    <td><input type="text" id="mcmc_niteration" value="1000"></td>
  </tr>
  <tr>
    <td>Number of MCMC burn-in interations (default: 1000)</td>
    <td><input type="text" id="mcmc_nburnin" value="1000"></td>
  </tr>
</table>
</div>
<br>

<input type="button" id="id_submit_variables" value="Submit">
</form>

<br>
<div>&copy; Matthew Pitkin (2015)</div>
</body>
</html>

