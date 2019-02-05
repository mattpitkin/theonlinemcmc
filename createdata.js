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

  // Show only relevant argument inputs depending on sampler
  $('#sampler_input_type').change(function(){
    var vartype = $(this).val();
    $("#id_dynesty_div").css("display", "none"); $("#id_nestle_div").css("display", "none"); $("#id_pymc3_div").css("display", "none"); $("#id_emcee_div").css("display", "none");
    if (vartype == "emcee"){
      // un-hide the div element
      $("#id_emcee_div").css("display", "");
    }
    else if(vartype == "dynesty"){
      $("#id_dynesty_div").css("display", "");
    }
    else if (vartype == "nestle"){
      $("#id_nestle_div").css("display", "");
    }
    else if (vartype == "pymc3"){
      $("#id_pymc3_div").css("display", "");
    }
    else{
      alert("Invalid sampler.");
      return false;
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
    var mfuncs = ["sin", "cos", "tan", "erf", "gamma", "acosh", "asinh", "atanh", "arccos", "arcsin", "arctan", "atan2", "arctan2", "arccosh", "arcsinh", "arctanh", "pi", "exp", "log2", "log10", "log", "sinh", "cosh", "tanh", "acos", "asin", "atan", "heaviside"];
    var index;

    // replace math functions with whitespace 
    for (index = 0; index < mfuncs.length; index++) {
      // the \b bounding the word will mean that only whole words are replaced

      modeleqtmp = modeleqtmp.replace(new RegExp("\\b"+mfuncs[index]+"\\b", "g"), " "); // global flag "g" added in to remove all occurences - https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
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
      // remove ALL function names not just first occurrence - https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
      modeleq = modeleq.replace(new RegExp(repfuncs[index].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), repfuncsnew[index]);
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






  
  // random example generator - not currently in use
  $("#id_randexample").click(function(){
    // Generate random equation - id="modeleq"
    document.getElementById("modeleq").value = "m*x+c"; // .value = randeq;
    // un-hide the div element
    $("#id_variables_div").css("display", ""); 
    // un-hide conditions field
    $("#id_conditions").prop("type", "text");
    var variables = ['m','c','x'];
    var tableel = document.getElementById("table_id");
    var row = tableel.insertRow(0);
    row.setAttribute("id","id_vartype_x",0); // Update abscissa 'x'
    var cell = row.insertCell(0);
    cell.innerHTML = "x";
    var cell1 = row.insertCell(-1);
    var idvartype = "id_vartype_x";
    cell1.innerHTML = "<select id=\""+idvartype+"\" class=\"form-control\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Constant\">Constant</option>\
  <option value=\"Variable\">Variable</option>\
  <option value=\"Abscissa\">Independent variable/abscissa</option>\
</select>";
    document.getElementById("id_vartype_x").value = "Abscissa";
    var newcell = row.insertCell(-1);
    var idabscissatype = "id_abscissa_x";
    newcell.innerHTML = "<select id=\""+idabscissatype+"\" class=\"form-control\">\
    <option value=\"\">--Input type--</option>\
    <option value=\"Input\">Input</option>\
    <option value=\"Upload\">Upload</option>\
</select>";
    document.getElementById("id_abscissa_x").value = "Input";
    var cell = row.insertCell(-1);
    cell.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_abscissaval\" class=\"form-control\">1,2,3,4</textarea>";
    for (index = 0; index < 2; index++){ // loop through 'm' and 'c' variables
      var row = tableel.insertRow(0);
      row.setAttribute("id", "id_"+variables[index], 0);
      var cell = row.insertCell(0);
      cell.innerHTML = variables[index];
      var cell = row.insertCell(-1);
      var idvartype = "id_vartype_"+variables[index];
      cell.innerHTML = "<select id=\""+idvartype+"\" class=\"form-control\">\
    <option value=\"\">--Type--</option>\
    <option value=\"Constant\">Constant</option>\
    <option value=\"Variable\">Variable</option>\
    <option value=\"Abscissa\">Independent variable/abscissa</option>\
  </select>";
      var newcell = row.insertCell(-1);
      var idpriortype = "id_priortype_"+variables[index];
      newcell.innerHTML = "<select id=\""+idpriortype+"\" class=\"form-control\">\
      <option value=\"\">--Prior--</option>\
      <option value=\"Uniform\">Uniform</option>\
      <option value=\"LogUniform\">Log(Uniform)</option>\
      <option value=\"Gaussian\">Gaussian</option>\
      <option value=\"Exponential\">Exponential</option>\
  </select>";
      document.getElementById("id_priortype_"+variables[index]).value = "Uniform";
      var cell = row.insertCell(-1);
      cell.innerHTML = "<input type=\"text\" id=\"minval_"+variables[index]+"\" value=\"-10\" class=\"form-control\">";
      cell = row.insertCell(-1);
      cell.innerHTML = "<input type=\"text\" id=\"maxval_"+variables[index]+"\" value=\"10\" class=\"form-control\">";
    }
    
    
    document.getElementById("id_vartype_m").value = "Variable";
    document.getElementById("id_vartype_c").value = "Variable";
    document.getElementById("data_input_type").value = "Input";
    var input = document.getElementById("id_data_div");
    //var cell = input.insertCell(-1);
    //cell.innerHTML = "<textarea rows=\"1\" cols=\"20\" id=\"id_abscissaval\" class=\"form-control\">1,2,3,4</textarea>";

    // Input data - same length as abscissa

      // Add noise to the data
    // Select Gaussian likelihood with fixed standard deviation of 0.1
    document.getElementById("likelihood_input_type").value = "Gaussian";
    var liketablerow = document.getElementById("like_row");
    var newcell = liketablerow.insertCell(-1);
    newcell.innerHTML = "<select id=\"id_gauss_like_type\" class=\"form-control\">\
  <option value=\"\">--Type--</option>\
  <option value=\"Known1\">Input &sigma; value</option>\
  <option value=\"Known2\">Input &sigma; values</option>\
  <option value=\"Fit\">Fit &sigma; value</option>\
</select>";
    document.getElementById("id_gauss_like_type").value = "Known1";
    var newcell2 = liketablerow.insertCell(-1);
    newcell2.innerHTML = "<input type=\"text\" id=\"id_gauss_known\" class=\"form-control\" value=\"&sigma;\">";
    document.getElementById("id_gauss_known").value = 0.1;
    // Select random sampler
    var samplers = ["emcee","dynesty"];
    var sampler = samplers[Math.floor(Math.random() * 2)];
    document.getElementById("sampler_input_type").value = sampler;
    $("#id_"+sampler+"_div").css("display", "");
  });







  // form submission
  $("#id_submit_variables").click(function(){
    pyfile = ""; // clear global variable    

    // create bilby python file for submission (use format function defined at the start of the code)
    pyfile = "\
#!/usr/bin/env python\n\n\
# import required packages \n\
import bilby\n\
import numpy as np\n\
from numpy import exp, log\n\
\
\n\
# import model function from separate file\n\
from mymodel import mymodel\n\
\n\
# import post-processing function from theonlinemcmc package\n\
from theonlinemcmc import *\n\
\n\
# initialise error code value\n\
errval = 0\n\
errout = 0\n\
\n\
# set number of MCMC points\n\
{setargs}\
\n\
# read in the data\n\
{readdata}\
\n\
{intcheck}\
# read in the abscissa values\n\
{readabscissa}\
\n\
# read in sigma (standard deviation) values (there may be nothing here if it not applicable to your likelihood)\n\
{readsigma}\
\n\
# Set up priors\n\
{priordict}\
\n\
# Check for valid sigma\n\
{sigmacheck}\
# Caclulate likelihood\n\
{runlikelihood}\
\n\
# Run sampler\n\
{runsampler}\
{postout}\
{postprocess}\
{database}\
";
    
    var outputStrings = {}; // object to pass to formatter
    
    var theta = []; // array for unpacking variables that require fitting

    // get all parameters requiring fitting and put them in an object
    var fitarray = {};
    var priordict = "";
    priordict += "priors = dict()\n"; // dictionary used for storing priors with bilby
    priordict += "try:\n";
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
          priordict += "  priors['"+variables[index]+"'] = bilby.core.prior.Uniform("+minmaxvals[0]+", "+minmaxvals[1]+", '"+variables[index]+"')\n";
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
          priordict += "  priors['"+variables[index]+"'] = bilby.core.prior.Gaussian("+meanstdvals[0]+", "+meanstdvals[1]+", '"+variables[index]+"')\n";
        }
        
        if ( priortype == "Exponential" ){
          var idmeanval = "#meanval_" + variables[index];
          var meanvals = getExponentialMeanValue(idmeanval);

          if ( meanvals.length == 0 ){
            return false; // there has been a problem
          }

          fitarray[variables[index]].meanval = meanvals[0];
          priordict += "  priors['"+variables[index]+"'] = bilby.core.prior.Exponential("+meanvals[0]+",'"+variables[index]+"')\n";
        }
      }
    }

    // check sampler is valid
    var samplertype = $("#sampler_input_type").val(); // read in desired sampler
    outputStrings["samplertype"] = samplertype;

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
        priordict += "  priors['sigma'] = bilby.core.prior.Uniform("+minmaxvals[0]+", "+minmaxvals[1]+", 'sigma')\n";
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
        priordict += "  priors['sigma'] = bilby.core.prior.Gaussian("+meanstdvals[0]+", "+meanstdvals[1]+", 'sigma')\n";
      }

      if ( priortype == "Exponential" ){
        var idmeanval = "#sigma_gauss_prior_mean";
        var meanvals = getExponentialMeanValue(idmeanval);

        if ( meanvals.length == 0 ){
          return false; // there has been a problem
        }

        fitarray["sigma_gauss"].meanval = meanvals[0];
        priordict += "  priors['sigma'] = bilby.core.prior.Exponential("+meanvals[0]+",'sigma')\n";
      } 
    }
    priordict += "except Exception as e:\n";
    priordict += "  errval = PRIOR_INIT_ERR\n";
    priordict += "  errout = e\n";
    outputStrings["priordict"] = priordict; // used in python file for bilby
    // write model function
    var modelfunction = "# import functions that can be used by the model\n\
from numpy import pi, sin, cos, tan, exp, log, log10, log2, arccos, arcsin, arctan, arctan2, sinh, cosh, tanh, arccosh, arcsinh, arctanh, heaviside\n\
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
    modelStrings['arguments'] = abscissastring + ", " + thetanosigma.join();
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
    
    // loop through fit array object
    for ( var priorvar in fitarray ){
      var priortype = fitarray[priorvar].priortype;
    }

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
    
    // Sampler keyword arguments - id values stored in php file
    sampler_args = {
      'emcee':['#mcmc_nensemble','#nburn','#mcmc_niteration'],
      'nestle':['#nlive','#nestle_method'],
      'dynesty':['#nlive'],
      'pymc3' :['#draws','#chains','#nburn']
    };
    // Sampler keyword argument names required by bilby in python file
    real_sampler_args = {
      'emcee':['nwalkers','nburn','nsteps'],
      'nestle':['npoints','Method'],
      'dynesty':['nlive'],
      'pymc3' :['draws','chains','tune']
    };
    // values expected for input arguments to check against - doesn't have checks for parity etc
    args_expectation = {
      '#nlive':function(nlive){var check = (isNumber(nlive) && nlive > 0 && nlive%1==0); 
                              if(check==false){alert("Input value for nlive must be a positive integer")}; return check},
      '#nestle_method':function(nmethod){var check = ["'single'","'classic'","'multi'"].includes(nmethod);
                              if(check==false){alert("Input value for nmethod must be classic, single or multi")}; return check}, 
      '#mcmc_nensemble' : function(nens){var check = (isNumber(nens) && nens > 1 && (nens%2===0) && (nens%1==0));
                              if(check==false){alert("Input value for the number of ensemble points must be a positive, even integer")}; return check}, // No check for number of variables yet, currently set for ndim == 1
      '#mcmc_niteration' : function(niter){var check = (isNumber(niter) && niter > 0 && niter%1==0);
                              if(check==false){alert("Input value for the number of iterations must be a positive integer")}; return check}, 
      '#nburn' : function(nburn){var check = (isNumber(nburn) && nburn > -1 && nburn%1==0);
                              if(check==false){alert("Input value for the number of burnin points must be a positive integer")}; return check},
      '#draws' : function(draws){var check = (isNumber(draws) && draws > -1 && draws%1==0);
                              if(check==false){alert("Input value for the number of draws must be a positive integer")}; return check},
      '#chains' : function(chains){var check = (isNumber(chains) && chains > -1 && chains%1==0);
                              if(check==false){alert("Input value for the number of MCMC chains must be a positive integer")}; return check}
    };
    
    var varsampler = $('#sampler_input_type').val(); // which bilby sampler to call
    var setargs = ""; // inputting arguments to python file
    var bilbyinput = ""; // same as above but formatted for sampler function input (bilby.run_sampler...)
    var input = ""; // empty var to store each input value
    var theta_length = sampler_args[varsampler].length; // ndim value
    for (index = 0; index < theta_length; index++){
        input = $(sampler_args[varsampler][index]).val();
        if (args_expectation[sampler_args[varsampler][index]](input) == false){ // check for correct data type
          return false;                                                               
        }                                                                             
        setargs += real_sampler_args[varsampler][index]  + " = " + input + "\n";
        bilbyinput += real_sampler_args[varsampler][index] + " = " + input + ",";
    }

    outputStrings['setargs'] = setargs;   

    // read in data
    var readdata = 'if errval == 0:\n';
    readdata += '  try:\n';
    readdata += '    data = np.loadtxt("' + datafile +'")\n';
    readdata += '  except:\n';
    readdata += '    try:\n';
    readdata += '      data = np.loadtxt("' + datafile + '", delimiter=",")\n';
    readdata += '    except Exception as e:\n';
    readdata += '      errval = DATA_READ_ERR\n';
    readdata += '      errout = e\n\n';
    
    outputStrings['readdata'] = readdata;
    
    // read in abscissa
    var readabscissa = 'if errval == 0:\n';
    readabscissa += '  try:\n';
    readabscissa += '    ' + abscissavar + ' = np.loadtxt("' + absfile + '")\n';
    readabscissa += '  except:\n';
    readabscissa += '    try:\n';
    readabscissa += '      ' + abscissavar + ' = np.loadtxt("' + absfile + '", delimiter=",")\n';
    readabscissa += '    except Exception as e:\n';
    readabscissa += '      errval = ABSCISSA_READ_ERR\n';
    readabscissa += '      errout = e\n';
    readabscissa += 'if errval == 0:\n';
    readabscissa += '  if len('+ abscissavar + ') != len(data):\n';
    readabscissa += '    errval = DATA_LENGTH_ERR\n';
    readabscissa += '    errout = "The length of data is incorrect."\n\n';
    
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
        readsigma += 'if errval == 0:\n';
        readsigma += '  try:\n';
        readsigma += '    sigma_data = np.loadtxt("' + sigmafile + '")\n';
        readsigma += '    sigma = sigma_data\n';
        readsigma += '    if len(sigma_data) != len(data):\n';
        readsigma += '      errval = DATA_LENGTH_ERR\n';
        readsigma += '      errout = "The length of data is incorrect."\n';
        readsigma += '  except:\n';
        readsigma += '    try:\n';
        readsigma += '      sigma_data = np.loadtxt("' + sigmafile + '", delimiter=",")\n';
        readsigma += '      if len(sigma_data) != len(data):\n';
        readsigma += '        errval = DATA_LENGTH_ERR\n';
        readsigma += '        errout = "The length of data is incorrect."\n';
        readsigma += '    except Exception as e:\n';
        readsigma += '      errval = SIGMA_READ_ERR\n';
        readsigma += '      errout = e\n';
        sigmavar += "sigma_data";

        sigmavar += ",";
      }
    }
    
    outputStrings['readsigma'] = readsigma;
    // run likelihood 
    if ( $("#likelihood_input_type").val() == "Gaussian" ){
      // sigma check for bilby only required if 
      var sigmacheck = "";
      if (sigmavar == ""){
        bilbysigmavar = ",sigma";
        sigmacheck += "try: # no fixed values of sigma given so attempting to generate normal random list between allowed values\n";
        sigmacheck += " sigma = abs(np.random.normal((priors['sigma_gauss'].maximum+priors['sigma_gauss'].minimum)/2,priors['sigma_gauss'].maximum-priors['sigma_gauss'].minimum, len(x)))\n";
        sigmacheck += "except:\n";
        sigmacheck += " sigma = 0.1\n";
      } // this is a botched job at the moment to try and make sure variable sigma can run in bilby
      else{
        sigmacheck = "sigma = ";
        sigmacheck += sigmavar.substring(0, sigmavar.length - 1);
        bilbysigmavar = ",";
        bilbysigmavar += sigmacheck;
        sigmacheck += "\n";
      }
      intcheck = "";
      bilbylikefunction = "Gaussian";
    }
    else if( $("#likelihood_input_type").val() == "Studentst" ){
      bilbysigmavar = ", nu=data.size, sigma=1";
      sigmacheck = "sigma = 1\n";
      bilbylikefunction = "StudentT";
      intcheck = "";
    }
    else if($("#likelihood_input_type").val() == "Poisson" ){
      bilbylikefunction = "Poisson";
      sigmacheck = "";
      bilbysigmavar = "";
      intcheck = "# Checking data values are all integers\n";
      intcheck += "if np.all(np.mod(data, 1) == 0) == True:\n";
      intcheck += "  data = data.astype(int)\n";
      intcheck += "else:\n";
      intcheck += "  errval = POIS_INT_ERR\n";
      intcheck += "  errout = 'Data must be non-negative integers'\n\n";
    }
    
    outputStrings["intcheck"] = intcheck;
    outputStrings["sigmacheck"] = sigmacheck;
    var runlikelihood = "if errval == 0:\n";
    runlikelihood += "  try:\n";
    runlikelihood += "    likelihood = bilby.likelihood."+bilbylikefunction+"Likelihood"+"("+ abscissavar +", data, mymodel "+bilbysigmavar+")\n";
    runlikelihood += "  except Exception as e:\n";
    runlikelihood += "    errval = SAMPLER_RUN_ERR\n";
    runlikelihood += "    errout = e\n";
    outputStrings["runlikelihood"] = runlikelihood;

    var runsampler = "if errval == 0:\n";
    runsampler += " try:\n";
    runsampler += "   result = bilby.run_sampler(likelihood = likelihood,\n";
    runsampler += "   priors=priors, "+bilbyinput+" sampler='"+samplertype+"')\n";
    runsampler += "   result.plot_corner()\n";
    runsampler += "   result.plot_with_data(mymodel,"+ abscissavar +",data)\n";
    runsampler += " except Exception as e:\n";
    runsampler += "   errval = SAMPLER_RUN_ERR\n";
    runsampler += "   errout = e\n";
    outputStrings['runsampler'] = runsampler;

    // output chain and log probabilities to gzipped file
    var postout = "";
    postout += " # output the posterior samples, likelihood and variables\n";
    postout += "if errval == 0:\n";
    postout += " try:\n";
    postout += "   np.savetxt('posterior_samples.txt.gz', result.posterior.values, fmt='%s')\n"; // fmt='%s' from https://stackoverflow.com/questions/48230230/typeerror-mismatch-between-array-dtype-object-and-format-specifier-18e
    postout += "   fv = open('variables.txt', 'w')\n";
    postout += "   fv.write(\"" + theta.join() + "\")\n";
    postout += "   fv.close()\n";
    postout += " except Exception as e:\n";
    postout += "   errval = POST_OUTPUT_ERR\n";
    postout += "   errout = e\n\n";
    
    outputStrings['postout'] = postout;
    
    var emailaddress = $("#id_email").val();
    emailaddress = emailaddress.replace(/['"]+/g, ''); // remove any quotes (" or ') in the string (hopefully this helps against insertion)
    if( emailaddress.search('@') == -1 ){
      alert("Email address is not valid");
      return false;
    }

    // run a pre-written script to parse the output, create plots and an output webpage and email user
    var hrefloc = window.location.href;
    var lIndex = hrefloc.lastIndexOf('/'); // strip the current page off the href
    var postprocess = "# run post-processing script\n";
    postprocess += "if errval == 0:\n";
    postprocess += " try:\n";
    postprocess += "   postprocessing(result.covariance_matrix, result.posterior.values, \"" + theta.join(',') + "\", " + abscissavar + ", \"" + abscissavar + "\", data, \"" + emailaddress + "\", \"" + hrefloc.substr(0, lIndex) + "/results/" + outdir + "\",result.log_evidence)\n";
    postprocess += " except Exception as e:\n";
    postprocess += "   errval = POST_PROCESS_ERR\n";
    postprocess += "   errout = e\n\n";
    
    postprocess += "success = True\n";
    postprocess += "if errval != 0:\n";
    postprocess += "  # run different script in case error codes are encountered\n";
    postprocess += "  errorpage(errout, errval, \"" + emailaddress + "\", \"" + hrefloc.substr(0, lIndex) + "/results/" + outdir + "\")\n";
    postprocess += "  success = False\n\n";
    
    outputStrings['postprocess'] = postprocess;
    var database = "# submit some information to a database\n";
    database = "database_add_row(\"" + outdir + "\", \"" + modelStrings['outputstring'] + "\", \"" + theta.join(',') + "\", " + (theta.length).toString() + ", success)\n\n";

    outputStrings['database'] = database;
    
    outputdata['pyfile'] = pyfile.format(outputStrings); // the bilby python file
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

