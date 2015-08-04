<!DOCTYPE HTML>
<html>
<head>
<title>The Online MCMC: Submitted</title>
<link rel="stylesheet" type="text/css" href="simple.css"/>
</head>
<body>

<!-- php code to submit python script -->
<?php
session_start();
?>

<?php
$outdir = $_SESSION["outdir"];

// submit a process to run the python script in the directory that has been passed through
$errfile = 'err_code.txt';
$pycommand = './pyfile.py';
$pid = shell_exec(sprintf('cd %s; %s > %s 2>&1 & echo $!', $outdir, $pycommand, $errfile));
?>

<div id="page-wrap">

<h1>Submission successful</h1>

<p>
Your submission has been successful. You should receive an email when the results have been completed.
</p>

<br>

<!-- include footer file -->
<?php include('footer.inc'); ?>

</div>
</body>
</html>

