$(function() {
  const SELECTED_LOCATION_PATTERN = /.:./;

  toggleUnknownTimeWrapper();
  completeLocationFields();

  $("#unknown-time").change(toggleUnknownTimeWrapper);
  $('.country').change(countryChange);
  $('.state').change(stateChange);
  $('.city').change(cityChange);

  function completeLocationFields() {
    $("#state-input").hide();
    $("#city-input").hide();

    var countryCode = $("#selected-country").val();

    if (SELECTED_LOCATION_PATTERN.test(countryCode)) {
      var selectedState = $("#selected-state").val();
      getStates(countryCode, function() { 
        if (SELECTED_LOCATION_PATTERN.test(selectedState)) {
          $(".state").val(selectedState);
          var selectedCity = $("#selected-city").val();
          getCities(countryCode, selectedState, function() { $(".city").val(selectedCity) });
        }
      });
    }
  }

  function getCurrentPath() {
    var loc = document.location.href;
    return loc.substring(0, loc.lastIndexOf('/'));
  }

  function toggleUnknownTimeWrapper() {
    var unknownTime = $("#unknown-time").is(":checked");
    if (unknownTime) {
      $("#unknown-time-wrapper").show();
      $("#known-time-wrapper").hide();
    } else {
      $("#known-time-wrapper").show();
      $("#unknown-time-wrapper").hide();
    }
  }

  function clearStateFields() {
    $(".state").find('option').remove();
    $("#state-input").hide();
    $("#selected-state").val('');
  }

  function clearCityFields() {
    $(".city").find('option').remove();
    $("#city-input").hide();
    $("#selected-city").val('');
  }

  function countryChange(callback) {
    var countryCode = $(".country").val();
    $("#selected-country").val(countryCode);

    clearStateFields();
    clearCityFields();

    if (SELECTED_LOCATION_PATTERN.test(countryCode)) {
      getStates(countryCode);
    }
  }

  function stateChange(callback) {
    var countryCode = $(".country").val();
    var state = $(".state").val();
    $("#selected-state").val(state);

    clearCityFields();
    if (SELECTED_LOCATION_PATTERN.test(state)) {
      getCities(countryCode, state);
    }
  }

  function cityChange() {
    var city = $(".city").val();
    $("#selected-city").val(city);
  }

  function getStates(countryCode, callback) {
    $.ajax({
      type: "POST",
      url: getCurrentPath() + "/lib/get_states.php",
      data: { countryCode: countryCode },
      cache: false,
      success: function(html) {
        $(".state").html(html);
        $("#state-input").show();
        if (callback) {
          callback();
        }
      }
    });
  }

  function getCities(countryCode, state, callback) {
    $.ajax({
      type: "POST",
      url: getCurrentPath() + "/lib/get_cities.php",
      data: { countryCode: countryCode, state: state },
      cache: false,
      success: function(html) {
        $(".city").html(html);
        $("#city-input").show();
        if (callback) {
          callback();
        }
      }
    });
  }

});
