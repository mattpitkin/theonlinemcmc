// alter the string prototype to include a format-style functionality
// see e.g. http://stackoverflow.com/a/13639670/1862861
String.prototype.format = function() {
    var args = arguments;
    this.unkeyed_index = 0;
    return this.replace(/\{(\w*)\}/g, function(match, key) { 
        if (key === '') {
            key = this.unkeyed_index;
            this.unkeyed_index++
        }
        if (key == +key) {
            return args[key] !== 'undefined'
                ? args[key]
                : match;
        } else {
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
                    return args[i][key];
                }
            }
            return match;
        }
    }.bind(this));
};


var pyfile = "";
var modeleq = "";
var variables = [];
var nabscissa = 0; // number of abscissa variables (can only have 1 at the moment)

var data_form_id = ""; // the id that the data input form will have (there are two possibilities)

var abscissavar = "";

var absfile = "abscissa_file.txt";
var datafile = "data_file.txt";
var sigmafile = "sigma_file.txt";


$(document).ready(function() {
  // function to show examples on the page
  $("#showexample").click(function() {
    if ( $("#example").css("display") == "none" ){
      $("#example").css("display", "");
    }
  });

  // close example
  $("#close").click(function() {
    if ( $("#example").css("display") != "none" ){
      $("#example").css("display", "none");  
    }
  });

  // change data input form type
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

  // change likelihood type
  $('#likelihood_input_type').change(function(){
    var liketablerow = document.getElementById("like_row");
    // delete any extra cells from previous choices
    while ( liketablerow.cells.length > 1 ){
      liketablerow.deleteCell(-1);
    }

    if ( $(this).val() == "Gaussian" ){
      var newcell = liketablerow.insertCell(-1);
      newcell.innerHTML = "<select id=\"id_gauss_like_type\" class=\"form-control\">\
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
          newcell2.innerHTML = "<input type=\"text\" id=\"id_gauss_known\" class=\"form-control\" value=\"&sigma;\">";
        }
        if ( gausstype == "Known2" ){
          newcell2.innerHTML = "<select id=\"id_gauss_known2_type\" class=\"form-control\">\
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
              newcell3.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_gauss_like_sigma_input\" class=\"form-control\"></textarea>";
            }
            if ( $(this).val() == "Upload" ){
              newcell3.innerHTML = "<input type=\"file\" id=\"id_gauss_like_sigma_upload\" class=\"form-control\">";
            }
          });
        }

        if ( gausstype == "Fit" ){
          newcell2.innerHTML = "<select id=\"sigma_gauss_prior\" class=\"form-control\">\
  <option value=\"\">--Prior type--</option>\
  <option value=\"Uniform\">Uniform</option>\
  <option value=\"LogUniform\">Log(Uniform)</option>\
  <option value=\"Gaussian\">Gaussian</option>\
  <option value=\"Exponential\">Exponential</option>\
</select>";
            
          $('#sigma_gauss_prior').change(function(){
            while ( liketablerow.cells.length > 3 ){
              liketablerow.deleteCell(-1);
            }

            if ( $(this).val() == "Uniform" || $(this).val() == "LogUniform" ){
              var newcell3 = liketablerow.insertCell(-1);
              newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_min\" value=\"Min.\" class=\"form-control\">";
              newcell3 = liketablerow.insertCell(-1);
              newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_max\" value=\"Max.\" class=\"form-control\">";
            }

            if ( $(this).val() == "Gaussian" ){
              var newcell3 = liketablerow.insertCell(-1);
              newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_mean\" value=\"Mean\" class=\"form-control\">";
              newcell3 = liketablerow.insertCell(-1);
              newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_sigma\" value=\"Standard deviation\" class=\"form-control\">";
            }
            
            if ( $(this).val() == "Exponential" ){
              var newcell3 = liketablerow.insertCell(-1);
              newcell3.innerHTML = "<input type=\"text\" id=\"sigma_gauss_prior_mean\" value=\"Mean\" class=\"form-control\">";
            }
          });
        }
      });
    }
  });

  $("#id_model_button").click(function(){
    // un-hide the div element
    $("#id_variables_div").css("display", "");
    
    // un-hide conditions field
    $("#id_conditions").prop("type", "text");

    // get model equation from form
    modeleq = $('#modeleq').val();
    modeleq = modeleq.replace(/['"]+/g, ''); // remove any quotes (" or ') in the string (hopefully this helps against insertion)

    // check model equation for matching parentheses
    if ( !CheckParentheses(modeleq) ){
      alert("Unbalanced parentheses in model equation");
      return false;
    }

    var modeleqtmp = modeleq.slice(); // copy of model equation

    // list of characters to replace
    modeleqtmp = modeleqtmp.replace(/[&\/+(),.*]/g, " ");
    modeleqtmp = modeleqtmp.replace(/\^/g, " "); // replace carat
    modeleqtmp = modeleqtmp.replace(/-/g, " "); // replace dash

    // replace all numbers with a space (using regular expression \d to represent all numbers and g to represent global replace) 
    modeleqtmp = modeleqtmp.replace(/[\d]+/g, " ");

    // list of math functions that need to be removed to count variables (maybe include more functions from http://docs.scipy.org/doc/scipy-0.14.0/reference/special.html in the future)
    var mfuncs = ["sin", "cos", "tan", "erf", "gamma", "acosh", "asinh", "atanh", "arccos", "arcsin", "arctan", "atan2", "arctan2", "arccosh", "arcsinh", "arctanh", "pi", "exp", "log2", "log10", "log", "sinh", "cosh", "tanh", "acos", "asin", "atan"];
    var index;

    // replace math functions with whitespace 
    for (index = 0; index < mfuncs.length; index++) {
      // the \b bounding the word will mean that only whole words are replaced
      modeleqtmp = modeleqtmp.replace(new RegExp("\\b"+mfuncs[index]+"\\b"), " ");
    }

    modeleqtmp = modeleqtmp.trim(); // strip leading and trailing whitespace

    // get names of variables in model equation by splitting modeleqtpm on any whitespace
    var variablestmp = modeleqtmp.split(/[ \t\n\r]+/);

    // remove any repeated variables (from http://stackoverflow.com/a/9229821/1862861)
    variables = variablestmp.filter(function(item, pos) {
      return variablestmp.indexOf(item) == pos;
    })

    // replace any different function names (e.g. acos -> arccos, and so on)
    var repfuncs = ["acos", "asin", "atan2", "atan", "acosh", "asinh", "atanh", "^"];
    var repfuncsnew = ["arccos", "arcsin", "arctan2", "arctan", "arccosh", "arcsinh", "arctanh", "**"];
    for (index=0; index < repfuncs.length; index++){
      modeleq = modeleq.replace(repfuncs[index], repfuncsnew[index]);
    }

    makeTable();
  });

  // function to check for matching '(' and ')' parentheses in model equation (from https://codereview.stackexchange.com/a/46039)
  function CheckParentheses(str){
    var parentheses = "()", stack = [], i, character, bracePosition;

    for(i = 0; character = str[i]; i++) {
      bracePosition = parentheses.indexOf(character);

      if(bracePosition === -1) {
        continue;
      }

      if(bracePosition % 2 === 0) {
        stack.push(bracePosition + 1); // push next expected brace position
      } else {
        if(stack.pop() !== bracePosition) {
          return false;
        }
      }
    }

    return stack.length === 0;
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

  function createSelection(row, variable){
    var cell = row.insertCell(-1);
    var idvartype = "id_vartype_"+variable;
    cell.innerHTML = "<select id=\""+idvartype+"\" class=\"form-control\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Constant\">Constant</option>\
  <option value=\"Variable\">Variable</option>\
  <option value=\"Abscissa\">Independent variable/abscissa</option>\
</select>";

    var previoustype;
    
    $('#'+idvartype).focus(function(){
      previoustype = $(this).val(); // store the previous value
    }).change(function(){
      var vartype = $(this).val();

      // number of cells in row
      var ncells = row.cells.length;
        
      if ( ncells > 2 ){
        for ( j = ncells; j > 2; j-- ){ row.deleteCell(-1); }
      }
  
      if( vartype == "Constant" ){
        // place input form in cell
        var newcell = row.insertCell(-1);
        newcell.innerHTML = "<input type=\"text\" id=\"id_constant_"+variable+"\" value=\"Value\" class=\"form-control\">";
      }

      if( vartype == "Variable" ){
        // place select for in cell
        var newcell = row.insertCell(-1);
        var idpriortype = "id_priortype_"+variable;
        newcell.innerHTML = "<select id=\""+idpriortype+"\" class=\"form-control\">\
    <option value=\"\">--Prior--</option>\
    <option value=\"Uniform\">Uniform</option>\
    <option value=\"LogUniform\">Log(Uniform)</option>\
    <option value=\"Gaussian\">Gaussian</option>\
    <option value=\"Exponential\">Exponential</option>\
</select>";

        createPriorSelection(row, variable);
      }

      if ( nabscissa == 1 && vartype != "Abscissa" && previoustype == "Abscissa" ){
        // reset nabscissa count in case an abscissa variable is changed to something else
        nabscissa = 0;
      }

      previoustype = $(this).val(); // set previous to current
      
      if( vartype == "Abscissa" ){
        if ( nabscissa == 1 ){
          alert('Can only have one abscissa at the moment');
          $(this).val(""); // revert back to empty value
        }
        else if ( nabscissa == 0 ){
          nabscissa = 1;

          var newcell = row.insertCell(-1);
          var idabscissatype = "id_abscissa_"+variable;
          newcell.innerHTML = "<select id=\""+idabscissatype+"\" class=\"form-control\">\
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
        cell.innerHTML = "<input type=\"text\" id=\"minval_"+variable+"\" value=\"Min.\" class=\"form-control\">";
        cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"maxval_"+variable+"\" value=\"Max.\" class=\"form-control\">";
      }

      if( priortype == "Gaussian" ){
        var cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"meanval_"+variable+"\" value=\"Mean\" class=\"form-control\">";
        cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"sigmaval_"+variable+"\" value=\"Standard deviation\" class=\"form-control\">";
      }

      if( priortype == "Exponential" ){
        var cell = row.insertCell(-1);
        cell.innerHTML = "<input type=\"text\" id=\"meanval_"+variable+"\" value=\"Mean\" class=\"form-control\">";
      }
    });
  }

  function createAbscissaForm(row, variable){
    var idabscissatype = "id_abscissa_"+variable;
    abscissavar = variable;

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
        cell.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_abscissaval\" class=\"form-control\"></textarea>";
      }

      if ( abscissatype == "Upload" ){
        var cell = row.insertCell(-1);
        var idabscissafile = "id_abscissafile";
        cell.innerHTML = "<input type=\"file\" id=\""+idabscissafile+"\" value=\"\" class=\"form-control\">";
      }

    });
  }

  // form submission
  $("#id_submit_variables").click(function(){
    pyfile = ""; // clear global variable    

    // create python file for submission (use format function defined at the start of the code)
    pyfile = "\
#!/usr/bin/env python\n\n\
\
# import required packages\n\
import emcee\n\
import numpy as np\n\
from numpy import exp, log\n\
\n\
# import model function from separate file\n\
from mymodel import mymodel\n\
\n\
# import post-processing function from theonlinemcmc package\n\
from theonlinemcmc import *\n\
\n\
# initialise error code value\n\
errval = 0\n\
\n\
# define the log posterior function\n\
{posteriorfunction}\
\n\
# define the log prior function\n\
{priorfunction}\
\n\
# define log likelihood function\n\
{likefunction}\
\n\
# set number of MCMC points\n\
{setnmcmc}\
\n\
# initialise the start ensemble points\n\
{initialpoint}\
\n\
# read in the data\n\
{readdata}\
\n\
# read in the abscissa values\n\
{readabscissa}\
\n\
# read in sigma (standard deviation) values (there may be nothing here if it not applicable to your likelihood)\n\
{readsigma}\
\n\
# run the MCMC\n\
{runmcmc}\
{postprocess}\
{database}\
\n\
";
    
    var outputStrings = {}; // object to pass to formatter
    
    var theta = []; // array for unpacking variables that require fitting

    // get all parameters requiring fitting and put them in an object
    var fitarray = {};
    for( index=0; index < variables.length; index++ ){
      var idvartype = "#id_vartype_" + variables[index];      
      var typeval = $(idvartype).val();

      if ( typeval == "Variable" ){
        theta.push(variables[index]);

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

          if ( minmaxvals.length == 0 ){
            return false; // there has been a problem
          }
        
          fitarray[variables[index]].minval = minmaxvals[0];
          fitarray[variables[index]].maxval = minmaxvals[1];
        }

        if ( priortype == "Gaussian" ){
          // get mean/standard deviation values
          var idmeanval = "#meanval_" + variables[index];
          var idsigmaval = "#sigmaval_" + variables[index];
          var meanstdvals = getGaussianValues(idmeanval, idsigmaval);

          if ( meanstdvals.length == 0 ){
            return false; // there has been a problem
          }

          fitarray[variables[index]].meanval = meanstdvals[0];
          fitarray[variables[index]].sigmaval = meanstdvals[1];
        }
        
        if ( priortype == "Exponential" ){
          var idmeanval = "#meanval_" + variables[index];
          var meanvals = getExponentialMeanValue(idmeanval);

          if ( meanvals.length == 0 ){
            return false; // there has been a problem
          }

          fitarray[variables[index]].meanval = meanvals[0];
        }
      }
    }

    // check for fit parameters in likelihood function i.e. fitting a sigma value
    var gausstype = $('#id_gauss_like_type').val();
    if ( gausstype == "Fit" ){
      var idpriortype = "#sigma_gauss_prior";
      var priortype = $(idpriortype).val();

      variables.push("sigma_gauss"); // add sigma_gauss (parameter for fitting sigma) to variables array
      theta.push("sigma_gauss");

      fitarray["sigma_gauss"] = {priortype: "", minval: "", maxval: "", meanval: "", sigmaval: ""}; // object is an object that will contain prior info
      fitarray["sigma_gauss"].priortype = priortype;

      if ( priortype == "Uniform" || priortype == "LogUniform" ){
        // get min/max values
        var idminval = "#sigma_gauss_prior_min";
        var idmaxval = "#sigma_gauss_prior_max";
        var minmaxvals = getMinMaxValues(idminval, idmaxval);

        if ( minmaxvals.length == 0 ){
          return false; // there has been a problem
        }

        fitarray["sigma_gauss"].minval = minmaxvals[0];
        fitarray["sigma_gauss"].maxval = minmaxvals[1];
      }

      if ( priortype == "Gaussian" ){
        // get mean/standard deviation values
        var idmeanval = "#sigma_gauss_prior_mean";
        var idsigmaval = "#sigma_gauss_prior_sigma";
        var meanstdvals = getGaussianValues(idmeanval, idsigmaval);

        if ( meanstdvals.length == 0 ){ 
          return false; // there has been a problem
        }

        fitarray["sigma_gauss"].meanval = meanstdvals[0];
        fitarray["sigma_gauss"].sigmaval = meanstdvals[1];
      }

      if ( priortype == "Exponential" ){
        var idmeanval = "#sigma_gauss_prior_mean";
        var meanvals = getExponentialMeanValue(idmeanval);

        if ( meanvals.length == 0 ){
          return false; // there has been a problem
        }

        fitarray["sigma_gauss"].meanval = meanvals[0];
      }
    }

    // write model function
    var modelfunction = "# import functions that can be used by the model\n\
from numpy import pi, sin, cos, tan, exp, log, log10, log2, arccos, arcsin, arctan, arctan2, sinh, cosh, tanh, arccosh, arcsinh, arctanh\n\
from scipy.special import erf, gamma\n\
from scipy.misc import factorial\n\n\
# define the model to fit to the data\n\
def mymodel({arguments}):\n\
  {conststring}\n\
  \n\
  return {outputstring}\n\n";
    var modelStrings = {};
    
    var conststring = "";
    var abscissastring = "";
    for (index=0; index < variables.length; index++){
      // check for constants
      var idvartype = "#id_vartype_" + variables[index];      
      var typeval = $(idvartype).val();

      if ( typeval == "Constant" ){
        var idconst = "#id_constant_" + variables[index];
        var constval = $(idconst).val();
        if ( constval != "Value" ){ // "Value" is the default value
          $(idconst).removeClass("has-error");
          $(idconst).addClass("form-control");
          
          // check value is actually a number
          if ( isNumber( constval ) ){
            conststring += variables[index] + " = " + constval;
          }
          else{
            alert("Constant value is not a number!");
            // add red warning to highlight the constant that is wrong
            $(idconst).removeClass("form-control");
            $(idconst).addClass("has-error");
            $(idconst).val("Invalid value");
            return false; // abort submission
          }
        }
        else{
          alert("Constant value is not set");
          $(idconst).removeClass("form-control");
          $(idconst).addClass("has-error");
          $(idconst).val("Invalid value");
          return false;
        }
      }

      if ( typeval == "Abscissa" ){
        abscissastring = variables[index];
      }
    }
    
    if ( abscissastring == "" ){ // must have an abscissa
      alert("There must be an independent variable/abscissa as an input");
      return false;
    }

    if ( theta.length == 0 ){ // must have a parameter to fit
      alert("There must be a parameter to fit");
      return false;
    }

    var thetanosigma = theta.slice();
    // remove sigma_gauss variable name if present, as this doesn't need passed to the model
    var tindex = thetanosigma.indexOf("sigma_gauss");
    if ( tindex > -1 ){
      thetanosigma.splice(tindex, 1);
    }
    modelStrings['arguments'] = thetanosigma.join() + ", " + abscissastring;
    modelStrings['conststring'] = conststring; // include constant values
    modelStrings['outputstring'] = modeleq.replace(/[ \t\n\r]+/, ""); // add model equation

    var gauss_like_sigma = "";
    if ( $("#likelihood_input_type").val() == "Gaussian" ){
      if ( $("#id_gauss_like_type").val().search("Known") != -1 ){
        gauss_like_sigma += ", sigma_gauss";
      }
    }

    // create log posterior function
    var posteriorfunction = "def lnprob(theta, " + abscissastring + gauss_like_sigma;   
    posteriorfunction += ", data):\n  lp = lnprior(theta)\n\
  if not np.isfinite(lp):\n\
    return -np.inf\n\n\
  return lp + lnlike(theta, " + abscissastring + gauss_like_sigma + ", data)\n\n";

    outputStrings["posteriorfunction"] = posteriorfunction;

    // create log prior function
    var priorfunction = "def lnprior(theta):\n";
    priorfunction += "  lp = 0.\n";
    priorfunction += "  " + theta.join() + " = theta\n\n"; // unpack variables 

    // initial points for MCMC
    var initialpoint = "try:\n";
    
    // loop through fit array object
    for ( var priorvar in fitarray ){
      var priortype = fitarray[priorvar].priortype;

      if ( priortype == "Uniform" || priortype == "LogUniform" ){
        priorfunction += "  if ";
        
        if ( priortype == "Uniform" ){
          priorfunction += fitarray[priorvar].minval.toString() + " < " + priorvar + " < " + fitarray[priorvar].maxval.toString() + ":\n";
          priorfunction += "    lp = 0.\n";
          initialpoint += "  " + priorvar + "ini = " + fitarray[priorvar].minval.toString() + " + np.random.rand(Nens)*" + (fitarray[priorvar].maxval - fitarray[priorvar].minval).toString() + "\n";
        }
        if ( priortype == "LogUniform" ){ // work in log space
          priorfunction += "log(" + fitarray[priorvar].minval.toString() + ") < " + priorvar + " < log(" + fitarray[priorvar].maxval.toString() + "):\n";
          priorfunction += "    lp = 0.\n";
          initialpoint += "  " + priorvar + "ini = " + "log(" + fitarray[priorvar].minval + ") + np.random.rand(Nens)*(" + "log(" + fitarray[priorvar].maxval.toString() +") - log(" + fitarray[priorvar].minval.toString() + "))\n";
        }

        priorfunction += "  else:\n    return -np.inf\n\n";
      }

      if ( priortype == "Gaussian" ){
        priorfunction += "  lp -= 0.5*(" + priorvar + " - " + fitarray[priorvar].meanval.toString() + ")**2/" + fitarray[priorvar].sigmaval.toString() + "**2" + "\n\n";
        initialpoint += "  " + priorvar + "ini = " + fitarray[priorvar].meanval.toString() + " + np.random.randn(Nens)*" + fitarray[priorvar].sigmaval.toString() + "\n";
      }

      if ( priortype == "Exponential" ){
        priorfunction += "  lp -= " + priorvar + "/" + fitarray[priorvar].meanval.toString() + "\n\n";
        initialpoint += "  " + priorvar + "ini = np.random.exponential(" + fitarray[priorvar].meanval.toString() + ", Nens)\n";
      }
      
      // maybe have other prior type (exponential?) (plus hyperparameters?)
    }

    // add condition in prior (should check that the condition actually contains the given variables)
    var conditions = $("#id_conditions").val();
    if ( conditions != "Conditions (e.g. x < 0 && y > z)" ){ // the default value
      priorfunction += "  if not (" + conditions + "):\n";
      priorfunction += "    return -np.inf\n\n";
    }

    priorfunction += "  return lp\n\n";

    outputStrings['priorfunction'] = priorfunction;

    // create log likelihood function
    var likefunction = "def lnlike(theta, " + abscissastring + gauss_like_sigma + ", data):\n";
    likefunction += "  " + theta.join() + " = theta\n"; // unpack theta
    // exponentiate any log uniform prior values before inputting into model
    for ( var priorvar in fitarray ){
      var priortype = fitarray[priorvar].priortype;
      if ( priortype == "LogUniform" ){
        likefunction += "  " + priorvar + " = exp(" + priorvar + ")\n";
      }
    }
    likefunction += "  md = mymodel(" + thetanosigma.join() + "," + abscissastring + ")\n"; // get model
    if ( $("#likelihood_input_type").val() == "Gaussian" ){
      likefunction += "  return -0.5*np.sum(((md - data)/sigma_gauss)**2)\n\n";
    }
    else if( $("#likelihood_input_type").val() == "Studentst" ){
      likefunction += "  nu = 0.5*len(md) # number of degrees of freedom\n";
      likefunction += "  return -nu*log(np.sum((md - data)**2))\n\n";
    }

    outputStrings['likefunction'] = likefunction;

    // generate a unique output directory for the file and data
    var outdir = guuid();

    // object to output the data
    var outputdata = {};
    outputdata['outdir'] = outdir;

    // get abscissa data
    if( $("#id_abscissa_"+abscissavar).val() == "Input" ){
      // check all values are numbers
      var abscissa_data = ($("#id_abscissaval").val()).split(/[ \t\n\r, ]+/);
      for ( index = 0; index < abscissa_data.length; index++ ){
        if ( !isNumber(abscissa_data[index]) ){
          alert("Non-number value in independent variable/abscissa data");
          return false;
        }
      }
      outputdata['abscissa_data'] = abscissa_data.join(' ');
    }

    // upload abscissa data
    var abscissaformData = new FormData();
    if( $("#id_abscissa_"+abscissavar).val() == "Upload" ){
      var abfile = $("#id_abscissafile")[0].files[0];
      abscissaformData.append('file', abfile);
      abscissaformData.append('labelab', 'abscissafile');
      abscissaformData.append('outdirab', outdir);

      // have file size limit of 500kb
      if ( abfile.size/1024.0 > 500 ){
        alert("Independent variable/abscissa file size is too large");
        return false;
      }
    }

    // read in input data
    if ( $("#data_input_type").val() == "Input" ){ // get input data
      // check all values are numbers
      var input_data = ($(data_form_id).val()).split(/[ \t\n\r, ]+/);
      for ( index = 0; index < input_data.length; index++ ){
        if ( !isNumber(input_data[index]) ){
          alert("Non-number value in input data");
          return false;
        }
      }
      outputdata['input_data'] = input_data.join(' ');
    }

    // upload abscissa data
    var inputformData = new FormData();
    if( $("#data_input_type").val() == "Upload" ){
      var dtfile = $(data_form_id)[0].files[0];
      inputformData.append('file', dtfile);
      inputformData.append('labeldt', 'datafile');
      inputformData.append('outdirdt', outdir);

      // have file size limit of 500kb
      if ( dtfile.size/1024.0 > 500 ){
        alert("Data file size is too large");
        return false;
      }
    }

    // check for input sigma values (rather than a single value)
    var siformData = new FormData();
    if ( $("#id_gauss_like_type").val() == "Known2" ){
      if( $("#id_gauss_known2_type").val() == "Input" ){
        // check all values are numbers
        var sigma_data = ($("#id_gauss_like_sigma_input").val()).split(/[ \t\n\r, ]+/);
        for ( index = 0; index < sigma_data.length; index++ ){
          if ( !isNumber(sigma_data[index]) ){
            alert("Non-number value in sigma input data");
            return false;
          }
        }
        outputdata['sigma_data'] = sigma_data.join(' ');
      }

      if( $("#id_gauss_known2_type").val() == "Upload" ){
        var sifile = $("#id_gauss_like_sigma_upload")[0].files[0];
        siformData.append('file', sifile);
        siformData.append('labelsi', 'sigmafile');
        siformData.append('outdirsi', outdir);

        // have file size limit of 500kb
        if ( sifile.size/1024.0 > 500 ){
          alert("Data file size is too large");
          return false;
        }
      }
    }

    // need to add inputs for MCMC - number of ensemble samples, burn-in and MCMC interations
    var nens = $("#mcmc_nensemble").val();
    if ( isNumber(nens) ){
      if ( nens < theta.length || !(nens%1===0) || !(nens%2===0) ){
        alert("Number of ensemble points must be an even integer greater than the number of variables");
        return false;
      }
    }
    else{
      alert("Number of ensemble points is not a number");
      return false;
    }

    var niter = $("#mcmc_niteration").val();
    if ( isNumber(niter) ){
      if ( niter > 0 && !(niter%1===0) ){
        alert("Number of iterations must be an integer greater than zero");
        return false;
      }
    }
    else{
      alert("Number of iterations is not a number");
      return false;
    }

    var nburn = $("#mcmc_nburnin").val();
    if ( isNumber(nburn) ){
      if ( nburn > -1 && !(niter%1===0) ){
        alert("Number of burn-in iterations must an integer of zero or greater");
        return false;
      }
    }
    else{
      alert("Number of burn-in iterations is not a number");
      return false;
    }
    
    var setnmcmc = "Nmcmc = " + niter.toString() + "\nNburnin = " + nburn.toString() + "\nNens = " + nens.toString() + "\n";
    setnmcmc += "ndim = " + theta.length.toString() + "\n";

    outputStrings['setnmcmc'] = setnmcmc;
    
    // set up initial points from prior
    initialpoint += "  pos = np.array([";
    for ( index = 0; index < theta.length; index++ ){
      initialpoint += theta[index] + "ini";
      if ( index < (theta.length-1) ){ initialpoint += ", "; }
    }
    initialpoint += "]).T\n";
    initialpoint += "except:\n";
    initialpoint += "  errval = PRIOR_INIT_ERR\n";
    
    outputStrings['initialpoint'] = initialpoint;
    
    // read in data
    var readdata = 'if errval == 0:\n';
    readdata += '  try:\n';
    readdata += '    data = np.loadtxt("' + datafile +'")\n';
    readdata += '  except:\n';
    readdata += '    try:\n';
    readdata += '      data = np.loadtxt("' + datafile + '", delimiter=",")\n';
    readdata += '    except:\n';
    readdata += '      errval = DATA_READ_ERR\n\n';
    
    outputStrings['readdata'] = readdata;
    
    // read in abscissa
    var readabscissa = 'if errval == 0:\n';
    readabscissa += '  try:\n';
    readabscissa += '    ' + abscissavar + ' = np.loadtxt("' + absfile + '")\n';
    readabscissa += '  except:\n';
    readabscissa += '    try:\n';
    readabscissa += '      ' + abscissavar + ' = np.loadtxt("' + absfile + '", delimiter=",")\n';
    readabscissa += '    except:\n';
    readabscissa += '      errval = ABSCISSA_READ_ERR\n\n';
    
    outputStrings['readabscissa'] = readabscissa;
    
    // read in or set sigma values (for Gaussian likelihood)
    var readsigma = "";
    var sigmavar = "";
    if ( $('#likelihood_input_type').val() == "Gaussian" ){
      if ( $("#id_gauss_like_type").val() == "Known1" ){
        var sigmanum = $("#id_gauss_known").val();
        if ( isNumber(sigmanum) ){
          if( sigmanum <= 0.0 ){
            alert("Sigma value must be positive");
            catcherrors++;
            //return false;
          }
          else{
            sigmavar += sigmanum.toString();   
          }
        }
        else{
          alert("Sigma value is not a number");
          return false;   
        }

        sigmavar += ",";
      }
      
      if ( $("#id_gauss_like_type").val() == "Known2" ){
        readsigma += 'if errval == 0:\n'
        readsigma += '  try:\n';
        readsigma += '    sigma_data = np.loadtxt("' + sigmafile + '")\n';
        readsigma += '    if len(sigma_data) != len(data):\n';
        readsigma += '      errval = DATA_LENGTH_ERR\n';
        readsigma += '  except:\n';
        readsigma += '    try:\n';
        readsigma += '      sigma_data = np.loadtxt("' + sigmafile + '", delimiter=",")\n';
        readsigma += '      if len(sigma_data) != len(data):\n';
        readsigma += '        errval = DATA_LENGTH_ERR\n';
        readsigma += '    except:\n';
        readsigma += '      errval = SIGMA_READ_ERR\n\n';
        sigmavar += "sigma_data";

        sigmavar += ",";
      }
    }
    
    outputStrings['readsigma'] = readsigma;
    
    var runmcmc = "if errval == 0:\n";
    // check length of data and abscissa are the same
    runmcmc += "  if len(data) != len(" + abscissavar + "):\n";
    runmcmc += "    errval = DATA_LENGTH_ERR\n\n";
    
    // set MCMC to run
    var argslist = "  argslist = (" + abscissavar + ", " + sigmavar + " data)\n";
    runmcmc += argslist;
    
    runmcmc += "\nif errval == 0:\n";
    runmcmc += "  # set up sampler\n";
    runmcmc += "  try:\n";
    runmcmc += "    sampler = emcee.EnsembleSampler(Nens, ndim, lnprob, args=argslist)\n"
    runmcmc += "  except:\n";
    runmcmc += "    errval = MCMC_INIT_ERR\n\n";
    
    runmcmc += "  # run sampler\n";
    runmcmc += "  try:\n";
    runmcmc += "    sampler.run_mcmc(pos, Nmcmc+Nburnin)\n";
    runmcmc += "    # remove burn-in and flatten\n";
    runmcmc += "    samples = sampler.chain[:, Nburnin:, :].reshape((-1, ndim))\n";
    runmcmc += "    lnp = np.reshape(sampler.lnprobability[:, Nburnin:].flatten(), (-1,1))\n";
    runmcmc += "    samples = np.hstack((samples, lnp))\n";
    
    // exponentiate any log uniform values
    count = 0
    for ( var priorvar in fitarray ){
      var priortype = fitarray[priorvar].priortype;
      if ( priortype == "LogUniform" ){
        runmcmc += "    samples[:," + count.toString() + "] = exp(samples[:," + count.toString() + "])\n";
      }
      count++;
    }

    runmcmc += "  except:\n";
    runmcmc += "    errval = MCMC_RUN_ERR\n\n";

    // output chain and log probabilities to gzipped file
    runmcmc += "  # output the posterior samples, likelihood and variables\n";
    runmcmc += "  try:\n";
    runmcmc += "    np.savetxt('posterior_samples.txt.gz', samples)\n";
    runmcmc += "    fv = open('variables.txt', 'w')\n";
    runmcmc += "    fv.write(\"" + theta.join() + "\")\n";
    runmcmc += "    fv.close()\n";
    runmcmc += "  except:\n";
    runmcmc += "    errval = POST_OUTPUT_ERR\n\n";
    
    outputStrings['runmcmc'] = runmcmc;
    
    var emailaddress = $("#id_email").val();
    emailaddress = emailaddress.replace(/['"]+/g, ''); // remove any quotes (" or ') in the string (hopefully this helps against insertion)
    if( emailaddress.search('@') == -1 ){
      alert("Email address is not valid");
      return false;
    }
    
    // run a pre-written script to parse the output, create plots and an output webpage and email user
    var hrefloc = window.location.href;
    var lIndex = hrefloc.lastIndexOf('/'); // strip the current page off the href
    var postprocess = "  # run post-processing script\n";
    postprocess += "  try:\n";
    postprocess += "    postprocessing(samples, \"" + theta.join(',') + "\", " + abscissavar + ", \"" + abscissavar + "\", data, \"" + emailaddress + "\", \"" + hrefloc.substr(0, lIndex) + "/results/" + outdir + "\")\n";
    postprocess += "  except:\n";
    postprocess += "    errval = POST_PROCESS_ERR\n\n";
    
    postprocess += "success = True\n";
    postprocess += "if errval != 0:\n";
    postprocess += "  # run different script in case error codes are encountered\n";
    postprocess += "  errorpage(errval, \"" + emailaddress + "\", \"" + hrefloc.substr(0, lIndex) + "/results/" + outdir + "\")\n";
    postprocess += "  success = False\n\n";
    
    outputStrings['postprocess'] = postprocess;
    
    var database = "# submit some information to a database\n";
    database = "database_add_row(\"" + outdir + "\", \"" + modelStrings['outputstring'] + "\", \"" + theta.join(',') + "\", " + (theta.length).toString() + ", success)\n\n";

    outputStrings['database'] = database;
    
    outputdata['pyfile'] = pyfile.format(outputStrings); // the python file
    outputdata['modelfile'] = modelfunction.format(modelStrings); // the python file containing the model function

    // submit abscissa data
    if ( !$.isEmptyObject( abscissaformData ) ){
      $.ajax({
        method: 'POST',
        data: abscissaformData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success: function(data){
          //
        }
      }).done(function(data){
        console.log( data );
      });
    }
    
    // submit input data
    if ( !$.isEmptyObject( inputformData ) ){
      $.ajax({
        method: 'POST',
        data: inputformData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success: function(data){
          //
        }
      }).done(function(data){
        console.log( data );
      });
    }
    
    // submit sigma data
    if( !$.isEmptyObject(siformData) ){
      $.ajax({
        method: 'POST',
        data: siformData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success: function(data){
          //
        }
      }).done(function(data){
        console.log( data );
      });
    }

    // submit a screenshot of the form (doesn't work properly at the moment)
    //var canvasData;
    //html2canvas($("#id_image_area"), {
    //  onrendered: function(canvas) {
    //    canvasData = canvas.toDataURL("image/png");
    //    outputdata['pageimage'] = canvasData;
    //  }
    //});

    outputdata['runcode'] = 1; // if this is set run the code
    
    // submit final data (python file and any inputs)
    $.ajax({
      method: 'POST',
      data: outputdata,
      success: function(data){
        alert("Successfully submitted data");
      }
    }).done(function(data){
      console.log( data );
    });

    // actually submit the form
    $("#id_formvariables").submit();
  });

  // function to get minimum and maximum values based on tag ids
  function getMinMaxValues(idminval, idmaxval){
    var minval = $(idminval).val();
    if ( minval != "Min." ){
      $(idminval).addClass("form-control");
      $(idminval).removeClass("has-error");
        
      if ( !isNumber(minval) ){
        alert("Minimum value is not a number");
        $(idminval).removeClass("form-control");
        $(idminval).addClass("has-error");
        $(idminval).val("Invalid value");
        return [];
      }
    }
    else{
      alert("Minimum value not specified");
      $(idminval).removeClass("form-control");
      $(idminval).addClass("has-error");
      $(idminval).val("Invalid value");
      return [];
    }

    var maxval = $(idmaxval).val();
    if ( maxval != "Max." ){
      $(idmaxval).addClass("form-control");
      $(idmaxval).removeClass("has-error");
      
      if ( isNumber(maxval) ){
        // check max val is greater than min val
        if ( parseFloat( maxval ) < parseFloat( minval ) ){
          alert("Maximum value is less than minimum value!");
          $(idmaxval).removeClass("form-control");
          $(idmaxval).addClass("has-error");
          $(idmaxval).val("Invalid value");
          return [];
        }
      }
      else{
        alert("Maximum value is not a number");
        $(idmaxval).removeClass("form-control");
        $(idmaxval).addClass("has-error");
        $(idmaxval).val("Invalid value");
        return [];
      }
    }
    else{
      alert("Maximum value not specified");
      $(idmaxval).removeClass("form-control");
      $(idmaxval).addClass("has-error");
      $(idmaxval).val("Invalid value");
      return [];
    }

    return [minval, maxval];
  }

  // function to get mean value for an exponential prior
  function getExponentialMeanValue(idmeanval){
    var meanval = $(idmeanval).val();

    // check and get mean value
    if ( meanval != "Mean" ){
      if ( isNumber( meanval ) ){
        $(idmeanval).addClass("form-control");
        $(idmeanval).removeClass("has-error");  
      }
      else{
        alert("Mean value is not a number");
        $(idmeanval).removeClass("form-control");
        $(idmeanval).addClass("has-error");
        $(idmeanval).val("Invalid value");
        return [];
      }
    }
    else{
      alert("Mean value not specified for Exponential prior");
      $(idmeanval).removeClass("form-control");
      $(idmeanval).addClass("has-error");
      $(idmeanval).val("Invalid value");
      return [];
    }

    return [meanval];
  }
  
  // function to get mean and sigma values for a Gaussian prior
  function getGaussianValues(idmeanval, idsigmaval){
    var meanval = $(idmeanval).val();
    var sigmaval = $(idsigmaval).val();

    // check and get mean and sigma values
    if ( meanval != "Mean" ){
      if ( isNumber( meanval ) ){
       $(idmeanval).addClass("form-control");
       $(idmeanval).removeClass("has-error");

       if ( sigmaval != "Standard deviation" ){
          $(idsigmaval).addClass("form-control");
          $(idsigmaval).removeClass("has-error");

          if ( isNumber( sigmaval ) ){
            if ( sigmaval < 0. ){
              alert("Standard devaition must be a positive number");
              $(idsigmaval).removeClass("form-control");
              $(idsigmaval).addClass("has-error");
              $(idsigmaval).val("Invalid value");
              return [];
            }
          }
          else{
            alert("Standard deviation value is not a number");
            $(idsigmaval).removeClass("form-control");
            $(idsigmaval).addClass("has-error");
            $(idsigmaval).val("Invalid value");
            return [];
          }
        }
        else{
          alert("Standard deviation value not specified");
          $(idsigmaval).removeClass("form-control");
          $(idsigmaval).addClass("has-error");
          $(idsigmaval).val("Invalid value");
          return [];
        }
      }
      else{
        alert("Mean value is not a number");
        $(idmeanval).removeClass("form-control");
        $(idmeanval).addClass("has-error");
        $(idmeanval).val("Invalid value");
        return [];
      }
    }
    else{
      alert("Mean value not specified for Gaussian prior");
      $(idmeanval).removeClass("form-control");
      $(idmeanval).addClass("has-error");
      $(idmeanval).val("Invalid value");
      return [];
    }

    return [meanval, sigmaval];
  }

  // function to check if string is number (from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric)
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // function to generate a UUID (from http://stackoverflow.com/questions/12223529/create-globally-unique-id-in-javascript?lq=1) 
  function guuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  };
});

