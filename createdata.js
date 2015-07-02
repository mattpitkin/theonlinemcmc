var pyfile = "";
var modeleq = "";
var variables = [];
var nabscissa = 0; // number of abscissa variables (can only have 1 at the moment)

// create object to hold all info
var returncode = "";

var data_form_id = ""; // the id that the data input form will have (there are two possibilities)

$(document).ready(function() {
  $("#id_model_button").click(function(){
    // add input header
    document.getElementById("id_input_header").innerHTML = "Parameter inputs";

    // un-hide conditions field
    $("#id_conditions").prop("type", "text");

    // add input data field
    inputData();

    // add likelihood input header
    document.getElementById("id_likelihood_header").innerHTML = "Likelihood input";
    inputLikelihood();

    // add MCMC value input header
    document.getElementById("id_mcmc_header").innerHTML = "MCMC inputs";
    inputMCMC();

    // un-hide the form submission button
    $("#id_submit_variables").prop("type", "submit");

    // get model equation from form
    modeleq = $('#modeleq').val();
    var modeleqtmp = modeleq.slice(); // copy of model equation

    // list of math functions that need to be removed to count variables (maybe include more functions from http://docs.scipy.org/doc/scipy-0.14.0/reference/special.html in the future)
    var mfuncs = ["pi", "sin", "cos", "tan", "exp", "log", "log10", "sinh", "cosh", "tanh", "acos", "asin", "atan", "erf", "gamma"];
    var index;

    // replace math functions with whitespace 
    for (index = 0; index < mfuncs.length; index++) {
      modeleqtmp = modeleqtmp.replace(mfuncs[index], " ");
    }

    // list of characters to replace
    modeleqtmp = modeleqtmp.replace(/[&\/+().*]/g, " ");
    modeleqtmp = modeleqtmp.replace("^", " ");
    modeleqtmp = modeleqtmp.replace("-", " ");

    // replace all numbers with a space (using regular expression \d to represent all numbers and g to represent global replace) 
    modeleqtmp = modeleqtmp.replace(/[\d]+/g, " ");
    modeleqtmp = modeleqtmp.trim(); // strip leading and trailing whitespace

    // get names of variables in model equation by splitting modeleqtpm on any whitespace
    var variablestmp = modeleqtmp.split(/[ \t\n\r]+/);

    // remove any repeated variables (from http://stackoverflow.com/a/9229821/1862861)
    variables = variablestmp.filter(function(item, pos) {
      return variablestmp.indexOf(item) == pos;
    })

    // replace any different function names (e.g. acos -> arccos, and so on)
    var repfuncs = ["acos", "asin", "atan2", "atan", "^"];
    var repfuncsnew = ["arccos", "arcsin", "arctan2", "arctan", "**"];
    for (index=0; index < repfuncs.length; index++){
      modeleq = modeleq.replace(repfuncs[index], repfuncsnew[index]);
    }

    makeTable();
  });

  function inputLikelihood(){
    document.getElementById("id_likelihood_div").innerHTML = "<table id=\"like_table\">\
<tr id=\"like_row\"><td>\
<select id=\"likelihood_input_type\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Gaussian\">Gaussian</option>\
  <option value=\"Studentst\">Students t</option>\
</select>\
</td></tr></table>\
<br>";

    $('#likelihood_input_type').change(function(){
      var liketablerow = document.getElementById("like_row");
      // delete any extra cells from previous choices
      while ( liketablerow.cells.length > 1 ){
        liketablerow.deleteCell(-1);
      }

      if ( $(this).val() == "Gaussian" ){
        var newcell = liketablerow.insertCell(-1);
        newcell.innerHTML = "<select id=\"id_gauss_like_type\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Known1\">Input &sigma; value</option>\
  <option value=\"Known2\">Input &sigma; values</option>\
  <option value=\"Fit\">Fit &sigma; value</option>\
</select>";

        $('#id_gauss_like_type').change(function(){
          while ( liketablerow.cells.length > 2 ){
            liketablerow.deleteCell(-1);
          }

          var gausstype = $(this).val();
          var newcell2 = liketablerow.insertCell(-1);
          
          if ( gausstype == "Known1" ){  
            newcell2.innerHTML = "<input type=\"text\" id=\"id_gauss_known\" value=\"&sigma;\">";
          }
          if ( gausstype == "Known2" ){
            newcell2.innerHTML = "<select id=\"id_gauss_known2_type\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Input\">Input</option>\
  <option value=\"Upload\">Upload</option>\
</select>";
            
            $('#id_gauss_known2_type').change(function(){
              while ( liketablerow.cells.length > 3 ){
                liketablerow.deleteCell(-1);
              }

              var newcell3 = liketablerow.insertCell(-1);

              if ( $(this).val() == "Input" ){
                newcell3.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_gauss_like_sigma_input\"></textarea>";
              }
              if ( $(this).val() == "Upload" ){
                newcell3.innerHTML = "<input type=\"file\" id=\"id_gauss_like_sigma_upload\">";
              }
            });
          }

          if ( gausstype == "Fit" ){
            newcell2.innerHTML = "<select id=\"sigma_gauss_prior\">\
  <option value=\"\">--Prior type--</option>\
  <option value=\"Uniform\">Uniform</option>\
  <option value=\"LogUniform\">Log(Uniform)</option>\
  <option value=\"Gaussian\">Gaussian</option>\
</select>";
            
            $('#sigma_gauss_prior').change(function(){
              while ( liketablerow.cells.length > 3 ){
                liketablerow.deleteCell(-1);
              }

              if ( $(this).val() == "Uniform" || $(this).val() == "LogUniform" ){
                var newcell3 = liketablerow.insertCell(-1);
                newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_min\" value=\"Min.\">";
                newcell3 = liketablerow.insertCell(-1);
                newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_max\" value=\"Max.\">";
              }

              if ( $(this).val() == "Gaussian" ){
                var newcell3 = liketablerow.insertCell(-1);
                newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_mean\" value=\"Mean\">";
                newcell3 = liketablerow.insertCell(-1);
                newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_sigma\" value=\"Standard deviation\">";
              }
            });
          }
        });
      }
    });
  }

  function inputMCMC(){
    document.getElementById("id_mcmc_div").innerHTML = "<table id=\"mcmc_table\">\
  <tr><td>Number of ensemble points (default: 100)</td><td><input type=\"text\" id=\"mcmc_nensemble\" value=\"100\"></td></tr>\
  <tr><td>Number of MCMC interations (default: 1000)</td><td><input type=\"text\" id=\"mcmc_niteration\" value=\"1000\"></td></tr>\
  <tr><td>Number of MCMC burn-in interations (default: 1000)</td><td><input type=\"text\" id=\"mcmc_nburnin\" value=\"1000\"></td></tr>\
</table><br>";
  }

  function makeTable(){
    if ( variables.length > 0 ){
      var tableel = document.getElementById("table_id");
      var nrows = tableel.rows.length;
      // delete any rows already present in cell
      if ( nrows > 0 ){
        for ( index=0; index < nrows; index++ ){
          tableel.deleteRow(-1);
        }
      }

      for (index=0; index < variables.length; index++){
        var row = tableel.insertRow(0);
        // set ID of row based on variable names
        row.setAttribute("id", "id_"+variables[index], 0);
        var cell = row.insertCell(0);
        cell.innerHTML = variables[index];

        createSelection(row, variables[index]);
      }
    }
  }

  function inputData(){
    document.getElementById("id_data_header").innerHTML = "Data input";

    // add input data selection
    document.getElementById("id_data_div").innerHTML = "<select id=\"data_input_type\">\
   <option value=\"\">--Type--</option>\
   <option value=\"Input\">Input</option>\
   <option value=\"Upload\">Upload</option>\
</select><br><br>";

    $('#data_input_type').change(function(){
      var vartype = $(this).val();

      if ( vartype == "Input" ){
        $("#id_submit_data_upload").prop("type", "hidden"); // make sure other option is re-hidden if things change
        $("#id_submit_data_form").css("display", "");
        data_form_id = "#id_submit_data_form";
      }
      if ( vartype == "Upload" ){
       $("#id_submit_data_form").css("display", "none"); // make sure other option is re-hidden if things change
       $("#id_submit_data_upload").prop("type", "file");
       data_form_id = "#id_submit_data_upload";
      }
    });
  }

  function createSelection(row, variable){
    var cell = row.insertCell(-1);
    var idvartype = "id_vartype_"+variable;
    cell.innerHTML = "<select id=\""+idvartype+"\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Constant\">Constant</option>\
  <option value=\"Variable\">Variable</option>\
  <option value=\"Abscissa\">Independent variable/abscissa</option>\
</select>";

    $('#'+idvartype).change(function(){
      var vartype = $(this).val();
        
      // number of cells in row
      var ncells = row.cells.length;
        
      if ( ncells > 2 ){
        for ( j = ncells; j > 2; j-- ){ row.deleteCell(-1); }
      }
  
      if( vartype == "Constant" ){
        // place input form in cell
        var newcell = row.insertCell(-1);
        newcell.innerHTML = "<input type=\"text\" id=\"id_constant_"+variable+"\" value=\"Value\">";
      }
        
      if( vartype == "Variable" ){
        // place select for in cell
        var newcell = row.insertCell(-1);
        var idpriortype = "id_priortype_"+variable;
        newcell.innerHTML = "<select id=\""+idpriortype+"\">\
    <option value=\"\">--Prior--</option>\
    <option value=\"Uniform\">Uniform</option>\
    <option value=\"LogUniform\">Log(Uniform)</option>\
    <option value=\"Gaussian\">Gaussian</option>\
</select>";

        createPriorSelection(row, variable);
      }

      if ( nabscissa == 1 && vartype != "Abscissa" ){
        // reset nabscissa count incase an abscissa variable is changed to something else
        nabscissa = 0;
      }

      if( vartype == "Abscissa" ){
        if ( nabscissa == 1 ){
          alert('Can only have one abscissa at the moment');
          $(this).val(""); // revert back to empty value
        }
        else if ( nabscissa == 0 ){
          nabscissa = 1;

          var newcell = row.insertCell(-1);
          var idabscissatype = "id_abscissa_"+variable;
          newcell.innerHTML = "<select id=\""+idabscissatype+"\">\
    <option value=\"\">--Input type--</option>\
    <option value=\"Input\">Input</option>\
    <option value=\"Upload\">Upload</option>\
</select>";

          createAbscissaForm(row, variable);
        }
      }
    });
  }

  function createPriorSelection(row, variable){
    var idpriortype = "id_priortype_"+variable;

    $('#'+idpriortype).change(function(){
      var priortype = $(this).val();
        
      // number of cells in row
      var ncells = row.cells.length;
        
      if ( ncells > 3 ){
        for ( j = ncells; j > 3; j-- ){ row.deleteCell(-1); }
      }
        
      if( priortype == "Uniform" || priortype == "LogUniform" ){
        var cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"minval_"+variable+"\" value=\"Min.\">";
        cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"maxval_"+variable+"\" value=\"Max.\">";
      }

      if( priortype == "Gaussian" ){
        var cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" name=\"meanval_"+variable+"\" value=\"Mean\">";
        cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" name=\"sigmaval_"+variable+"\" value=\"Standard deviation\">";
      }
    });
  }

  function createAbscissaForm(row, variable){
    var idabscissatype = "id_abscissa_"+variable;

    $('#'+idabscissatype).change(function(){
      var abscissatype = $(this).val();
        
      // number of cells in row
      var ncells = row.cells.length;

      if ( ncells > 3 ){
        for ( j = ncells; j > 3; j-- ){ row.deleteCell(-1); }
      }
      
      // add input form
      if ( abscissatype == "Input" ){
        var cell = row.insertCell(-1);
        //cell.innerHTML = "<input type=\"text\" id=\"id_abscissaval_"+variable+"\" value=\"\">";
        cell.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_abscissaval_"+variable+"\"></textarea>";
      }

      if ( abscissatype == "Upload" ){
        var cell = row.insertCell(-1);
        var idabscissafile = "id_abscissafile";
        cell.innerHTML = "<input type=\"file\" id=\""+idabscissafile+"\" value=\"\">";
      }

    });
  }

  // form submission
  $("#id_formvariables").submit(function(){
    // create python file for submission
    pyfile += "#!/usr/bin/env python\n\n";
    
    // import required packages
    pyfile += "import emcee\n";

    pyfile += "import numpy as np\n\
from numpy import pi, sin, cos, tan, exp, log, log10, arccos, arcsin, arctan, arctan2, sinh, cosh, tanh\n\
from scipy.special import erf, gamma\n\
from scipy.misc import factorial\n\n"

    // get all parameters requiring fitting and put them in an object
    var fitarray = {};
    for( index=0; index < variables.length; index++ ){
      var idvartype = "#id_vartype_" + variables[index];      
      var typeval = $(idvartype).val();

      if ( typeval == "Variable" ){
        fitarray[variables[index]] = {priortype: "", minval: 0., maxval: 0., meanval: 0., sigmaval: 0.}; // object is an object that will contain prior info

        // fill in prior info
        var idpriortype = "#id_priortype_" + variables[index];
        var priortype = $(idpriortype).val();

        fitarray[variables[index]].priortype = priortype;

        if ( priortype == "Uniform" || priortype == "LogUniform" ){
          // get min/max values
          var idminval = "#minval_" + variables[index];
          var idmaxval = "#maxval_" + variables[index];
          var minmaxvals = getMinMaxValues(idminval, idmaxval);

          fitarray[variables[index]].minval = minmaxvals[0];
          fitarray[variables[index]].maxval = minmaxvals[1];
        }

        if ( priortype == "Gaussian" ){
          // get mean/standard deviation values
          var idmeanval = "#meanval_" + variables[index];
          var idsigmaval = "#sigmaval_" + variables[index];
          var meanstdvals = getGaussianValues(idmeanval, idsigmaval);

          fitarray[variables[index]].meanval = meanstdvals[0];
          fitarray[variables[index]].sigmaval = meanstdvals[1];
        }
      }
    }

    // TODO: check for fit parameters in likelihood function i.e. fitting a sigma value

    pyfile += "# define the model to fit to the data\n";
    pyfile += "def mymodel(";

    var theta = "  "; // string for unpacking variables
    var conststrings = "";
    var abscissastring = "";
    for (index=0; index < variables.length; index++){
      // check for constants
      var idvartype = "#id_vartype_" + variables[index];      
      var typeval = $(idvartype).val();

      if ( typeval == "Constant" ){
        var idconst = "#id_constant_" + variables[index];
        var constval = $(idconst).val();
        if ( constval != "Value" ){ // "Value" is the default value
          // check value is actually a number
          if ( isNumber( constval ) ){
            conststring += "  " + variables[index] + " = " + constval + "\n";
          }
          else{
            alert("Constant value is not a number!");
          }
        }
      }
      else{
        if ( typeval == "Variable" ){
          theta += variables[index];
        }
        if ( typeval == "Abscissa" ){
          abscissastring = variables[index];
        }

        pyfile += variables[index];

        if ( index < variables.length-1 ){
          pyfile += ", ";
          theta += ", ";
        }
        else{
          pyfile += "):\n  ";
          theta += "= theta\n";
        }
      }
    }

    pyfile += conststring; // include constant values

    pyfile += "  return ";
    pyfile += modeleq.replace(/[ \t\n\r]+/, "");
    pyfile += "\n\n";

    // create log posterior function
    pyfile += "# define the log posterior function\n";
    pyfile += "def lnprob(theta, " + abscissastring + "):\n";
    pyfile += "  lp = lnprior(theta)\n\
  if not np.isfinite(lp):\n\
    return -np.inf\n\n\
  return lp + lnlike(theta, " + abscissastring + ")\n\n"

    // create log prior function
    pyfile += "# define the log prior function\n";
    pyfile += "def lnprior(theta):\n";
    pyfile += "  lp = 0.\n" + theta; 

    for (index=0; index < variables.length; index++){
      var idvartype = "#id_vartype_" + variables[index];      
      var typeval = $(idvartype).val();

      if( typeval == "Variable" ){
        var idpriortype = "#id_priortype_" + variables[index];
        var priortype = $(idpriortype).val();

        if ( priortype == "Uniform" || priortype == "LogUniform" ){
          // get min/max values
          var idminval = "#minval_" + variables[index];
          var idmaxval = "#maxval_" + variables[index];

          var minval = $(idminval).val();
          if ( minval != "Min." ){
            if ( isNumber(minval) ){
              pyfile += "  if ";

              if ( priortype == "Uniform" ){ pyfile += minval; }
              if ( priortype == "LogUniform" ){ 
                if ( parseFloat(minval) <= 0. ){
                  alert("For loguniform prior the range must be positive.");
                }
                pyfile += "log("+minval+")"; 
              }
              pyfile += "< " + variables[index] + " < ";
            }
            else{
              alert("Minimum value is not a number");
            }
          }
          else{
            alert("Minimum value not specified for " + variables[index]);
          }
        
          var maxval = $(idmaxval).val();
          if ( maxval != "Max." ){
            if ( isNumber(maxval) ){
              // check max val is greater than min val
              if ( parseFloat( maxval ) < parseFloat( minval ) ){
                alert("Maximum value is less than minimum value!");
              }

              if ( priortype == "Uniform" ){ pyfile += maxval; }
              if ( priortype == "LogUniform" ){ pyfile += "log("+maxval+")"; }
              pyfile += "\n    lp = 0.\n";
              pyfile += "  else:\n";
              pyfile += "    return -np.inf\n\n";
            }
            else{
              alert("Maximum value is not a number");
            }
          }
          else{
            alert("Maximum value not specified for " + variables[index]);
          }
        }

        if ( priortype == "Gaussian" ){
          // get min/max values
          var idmeanval = "#meanval_" + variables[index];
          var idsigmaval = "#sigmaval_" + variables[index];

          var meanval = $(idmeanval).val();
          var sigmaval = $(idsigmaval).val();

          // check and get mean and sigma values
          if ( meanval != "Mean" ){          
            if ( isNumber( meanval ) ){
              if ( sigmaval != "Standard deviation" ){
                if ( isNumber( sigmaval ) ){
                  pyfile
                }
                else{
                  alert("Standard deviation value is not a number");
                }
              }
              else{
                alert("Standard deviation value not specified for Gaussian prior on " + variables[index]);
              }
            }
            else{
              alert("Mean value is not a number");
            }
          }
          else{
            alert("Mean value not specified for Gaussian prior on " + variables[index]);
          }

          // set Gaussian prior
        }

        // maybe have other prior type (exponential?) (plus hyperparameters?)
      }
    }

    // add condition in prior (should check that the condition actually contains the given variables)
    var conditions = $("#id_conditions").val();
    if ( conditions != "Conditions (e.g. x < 0 && y > z)" ){ // the default value
      pyfile += "  if not (" + conditions + "):\n";
      pyfile += "    return -np.inf\n\n";
    }

    // create log likelihood function
    // need to add inputs for likelihoods

    // read in input data

    // need to add inputs for MCMC - number of ensemble samples, burn-in and MCMC interations

    // set up initial points from prior

    // set MCMC to run

    // create a unique directory for output

    // output chain and log probabilities to file

    // run a pre-written script to parse the output, create plots and an output webpage and email user

    // submit data and use stuff from e.g. http://stackoverflow.com/questions/2320069/jquery-ajax-file-upload
    // to upload data if required


    // this is a test!
    $.ajax({
      method: 'POST',
      data: {pyfile: pyfile},
      success: function(data){
        alert("Successfully submitted data");
      }
    });
  });

  // function to get minimum and maximum values based on tag ids
  function getMinMaxValues(idminval, idmaxval){
    var minval = $(idminval).val();
    if ( minval != "Min." ){
      if ( !isNumber(minval) ){
        alert("Minimum value is not a number");
      }
    }
    else{
      alert("Minimum value not specified for " + variables[index]);
    }

    var maxval = $(idmaxval).val();
    if ( maxval != "Max." ){
      if ( isNumber(maxval) ){
        // check max val is greater than min val
        if ( parseFloat( maxval ) < parseFloat( minval ) ){
          alert("Maximum value is less than minimum value!");
        }
      }
      else{
        alert("Maximum value is not a number");
      }
    }
    else{
      alert("Maximum value not specified for " + variables[index]);
    }

    return [minval, maxval];
  }

  // function to get mean and sigma values for a Gaussian prior
  function getGaussianValues(idmeanval, idsigmaval){
    var meanval = $(idmeanval).val();
    var sigmaval = $(idsigmaval).val();

    // check and get mean and sigma values
    if ( meanval != "Mean" ){          
      if ( isNumber( meanval ) ){
        if ( sigmaval != "Standard deviation" ){
          if ( isNumber( sigmaval ) ){
            if ( sigmaval < 0. ){
              alert("Standard devaition must be a positive number");
            }
          }
          else{
            alert("Standard deviation value is not a number");
          }
        }
        else{
          alert("Standard deviation value not specified");
        }
      }
      else{
        alert("Mean value is not a number");
      }
    }
    else{
      alert("Mean value not specified for Gaussian prior on " + variables[index]);
    }

    return [meanval, sigmaval];
  }

  // function to check if string is number (from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric)
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
});

