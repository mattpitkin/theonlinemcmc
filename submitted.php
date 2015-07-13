<!DOCTYPE HTML>
<html>
<head>

</head>
<body>

<!-- php code to submit python script -->
<?php
session_start();
?>

<?php
$outdir = $_SESSION["outdir"];
$emailaddress = $_SESSION["email"];

// copy a pre-written post-processing file into the individuals directory

// copy the email into the file

// submit a process to run the python script in the directory that has been passed through
$errfile = $outdir.'/err_code.txt';
$outfile = $outdir.'/out_code.txt';
$pycommand = $outdir.'/pyfile.py';
$pid = shell_exec(sprintf('%s > %s 2>%s & echo $!', $pycommand, $outfile, $errfile));
?>

<h1>Submission successful</h1>

<p>
Your submission has been successful. You should receive an email when the results have been completed.
</p>

<br>
<div>&copy; Matthew Pitkin (2015)</div>
</body>
</html>

