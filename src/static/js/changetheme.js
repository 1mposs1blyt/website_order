var themeNow = localStorage.getItem("theme");
if (!localStorage.getItem("theme")) {
  $("body").attr("data-bs-theme", "light");
  $("nav").attr("data-bs-theme", "light");
  $("div").attr("data-bs-theme", "light");
  $("#themeIcon").addClass("bi bi-moon");
  $("themeswitcher").prop("checked", false);
  // $("#themeIcon").toggleClass("bi bi-sun");
  localStorage.setItem("theme", "light");
} else {
  if (themeNow == "dark") {
    $("#themeswitcher").prop("checked", true);
    $("#themeIcon").toggleClass("bi bi-moon");
    $("#themeIcon").toggleClass("bi bi-sun");
  } else if (themeNow == "light"){
    $("#themeswitcher").prop("checked", false);
    $("#themeIcon").toggleClass("bi bi-sun");
    $("#themeIcon").toggleClass("bi bi-moon");
  }
}

$("body").attr("data-bs-theme", themeNow);
$("nav").attr("data-bs-theme", themeNow);
$("div").attr("data-bs-theme", themeNow);
function switchTheme() {
  var themeNow = localStorage.getItem("theme");
  if (themeNow == "dark") {
    $("body").attr("data-bs-theme", "light");
    $("nav").attr("data-bs-theme", "light");
    $("div").attr("data-bs-theme", "light");
    $("#themeIcon").toggleClass("bi bi-moon");
    $("#themeIcon").toggleClass("bi bi-sun");
    // $('themeswitcher').prop("checked",true)
    localStorage.setItem("theme", "light");
  } else if (themeNow == "light") {
    $("body").attr("data-bs-theme", "dark");
    $("div").attr("data-bs-theme", "dark");
    $("nav").attr("data-bs-theme", "dark");
    $("#themeIcon").toggleClass("bi bi-sun");
    $("#themeIcon").toggleClass("bi bi-moon");
    //
    localStorage.setItem("theme", "dark");
  }
}
// if (themeNow == "dark") {
//   $("#themeIcon").toggleClass("bi bi-moon");
//   $("#themeIcon").toggleClass("bi bi-sun");

// } else if (themeNow == "light") {
//   $("#themeIcon").toggleClass("bi bi-sun");
//   $("#themeIcon").toggleClass("bi bi-moon");
//   $("body").attr("data-bs-theme", "dark");
//   $("div").attr("data-bs-theme", "dark");
//   $("nav").attr("data-bs-theme", "dark");
// }
