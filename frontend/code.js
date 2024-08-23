
$(document).ready(function () {

  let domain = "http://localhost:2000";

  let searchOffset = 0;
  const numItems = 5;
  let searchArgs = '';

  const closeAll = function () {
    $("#homepage").hide();
    $("#aboutpage").hide();
    $("#searchpage").hide();
    $("#itempage").hide();
    $("#analyticspage").hide();
  }

  const getSortType = function () {
    return $("input[name='btnradio']:checked").attr("sort").substring(6);
  }

  const getStars = function (n) {
    let num = Math.round(parseFloat(n));
    return '<h3 style="color: #fbc700;">' + '&#9733;'.repeat(num) + '&#9734;'.repeat(numItems - num) + '</h3>';
  }


  populateSearch = function () {
    $.ajax({
      url: domain + "/search/" + getSortType() + "/" + searchOffset + "/" + searchArgs,
      type: "GET",
      contentType: "application/json",
      data: JSON.stringify({
        // Your data here
      }),
      success: function (data) {
        // Handle success
        $('#searchtable').html('');

        $.each(data, function (index, value) {

          $('#searchtable').append(`
            <tr item="` + value.id + `">
            <td><img src="" width="100px" height="100px"/></td>
            <th scope="row" valign="middle">` + value.name + `</th>
            <td valign="middle">
              <ul style="list-style: none;">
                <li><span class="badge rounded-pill bg-info">Tag 1</span></li>
                <li><span class="badge rounded-pill bg-info">Tag 2</span></li>
              </ul>
            </td>
            <td valign="middle">` + getStars(value.avgrating) + `</td>
            <td valign="middle">$` + value.price + `</td>`);
        });

        // add tags
        $("#searchtable").children().each(function () {
          let elem = $(this);
          let id = $(this).attr("item");
          $.ajax({
            url: domain + "/tags/" + id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
              // Your data here
            }),
            success: function (data) {
              // Handle success
              elem.find("td>ul").html(''); // Clear previous tags
              $.each(data, function (index, value) {
                elem.find("td>ul").append('<li><span class="badge rounded-pill bg-info">' + value.tag + '</span></li>');
              });
            },
            error: function () {
              // Handle error
              //alert("Error!");
            }
          });

          // add images
          $.ajax({
            url: domain + "/search/" + id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
              // Your data here
            }),
            success: function (data) {
              // Handle success
              elem.find("td>img").attr('src', "data:image/jpg;base64," + btoa(String.fromCharCode.apply(null, data[0].image.data)));
            },
            error: function () {
              // Handle error
              //alert("Error!");
            }
          });
        });

        // add click function to each item
        $("#searchtable").children().click(function () {

          let id = $(this).attr("item");

          // add basic information
          $.ajax({
            url: domain + "/search/" + id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
              // Your data here
            }),
            success: function (data) {
              // Handle success
              $('#itemimage').attr('src', "data:image/jpg;base64," + btoa(String.fromCharCode.apply(null, data[0].image.data)));
              $('#itemname').text(data[0].name);
              $('#itemprice').text(data[0].price);
              $('#itemdesc').text(data[0].description);
              closeAll();
              $("#itempage").show();
            },
            error: function () {
              // Handle error
              alert("Error!");
            }
          });

          // add tags
          $.ajax({
            url: domain + "/tags/" + id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
              // Your data here
            }),
            success: function (data) {
              // Handle success

              $('#itemtags').html('');
              $.each(data, function (index, value) {
                $('#itemtags').append(
                  '<li><span class="badge rounded-pill bg-info">' + value.tag + '</span></li>');
              });
            },
            error: function () {
              // Handle error
              alert("Error!");
            }
          });

          // add reviews
          $.ajax({
            url: domain + "/reviews/" + id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
              // Your data here
            }),
            success: function (data) {
              // Handle success
              $('#itemreviews').html('');
              $.each(data, function (index, value) {
                $('#itemreviews').append(`
                  <li>
                    <h3 style="color: #fbc700;">` + getStars(value.rating) + `</h3>
                    <p>` + value.comment + `</p>
                    <br>
                  </li>`);
              });
            },
            error: function () {
              // Handle error
              alert("Error!");
            }
          });
        });

      },
      error: function () {
        // Handle error
        alert("Error!");
      }
    });
  }

  $("#homepagebutton").click(function () {
    closeAll();
    $("#homepage").show();
  });

  $("#aboutbutton").click(function () {
    closeAll();
    $("#aboutpage").show();
  });

  $("#searchbutton").click(function () {
    closeAll();
    $("#searchpage").show();
  });

  $("#searchbutton2").click(function () {
    $("#searchbutton").click();
  });

  $("#analyticsbutton").click(function () {
    closeAll();
    $("#analyticspage").show();
  });

  $("#backbutton").click(function () {
    $("#itempage").hide();
    $("#searchpage").show();
  });

  $("#namesearchbutton").click(function () {
    searchOffset = 0;
    $("#searchrange").text("1-" + numItems);
    $('#tagsearchbar').val('');
    if ($('#namesearchbar').val().length === 0) {
      searchArgs = '';
    }
    else {
      searchArgs = 'name/' + $('#namesearchbar').val();
    }
    populateSearch();
  });

  $("#tagsearchbutton").click(function () {
    searchOffset = 0;
    $("#searchrange").text("1-" + numItems);
    $('#namesearchbar').val('');
    if ($('#tagsearchbar').val().length === 0) {
      searchArgs = '';
    }
    else {
      searchArgs = 'tag/' + $('#tagsearchbar').val();
    }
    populateSearch();
  });

  $("input[name='btnradio']").change(function () {
    searchOffset = 0;
    $("#searchrange").text("1-" + numItems);
    populateSearch();
  });

  $("#leftbutton").click(function () {
    if (searchOffset > 0) {
      searchOffset -= numItems;
      $("#searchrange").text((searchOffset + 1) + "-" + (searchOffset + numItems));
      populateSearch();
    }
  });

  $("#rightbutton").click(function () {
    searchOffset += numItems;
    $("#searchrange").text((searchOffset + 1) + "-" + (searchOffset + numItems));
    populateSearch();
  });

  // fill top item
  $.ajax({
    url: domain + "/top",
    type: "GET",
    contentType: "application/json",
    data: JSON.stringify({
      // Your data here
    }),
    success: function (data) {
      // Handle success
      $('#topitemtable').html('');
      $('#topitemtable').append(`
        <tr item="` + data[0].id + `">
        <td><img src="` +
        "data:image/jpg;base64," + btoa(String.fromCharCode.apply(null, data[0].image.data))
        + `" width="100px" height="100px"/></td>
        <th scope="row" valign="middle">` + data[0].name + `</th>
        <td valign="middle">
          <ul style="list-style: none;">
            
          </ul>
        </td>
        <td valign="middle">` + getStars(data[0].avgrating) + `</td>
        <td valign="middle">$` + data[0].price + `</td>`
      );

    },
    error: function () {
      // Handle error
      alert("Error!");
    }
  });

  $('#btnradio1').click();

  let xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
  let yValues = [55, 49, 44, 24, 15];
  const barColors = ["red", "green", "blue", "orange", "brown", "yellow", "purple", "black", "magenta", "gray"];

  let chart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: { display: false },
      title: { display: false }
    }
  });

  $("#analyticsselect").change(function () {
    const selected = $("#analyticsselect").find(":selected").attr("graph");
    $.ajax({
      url: domain + "/top10/" + selected,
      type: "GET",
      contentType: "application/json",
      data: JSON.stringify({
        // Your data here
      }),
      success: function (data) {
        // Handle success
        xValues = [];
        yValues = [];

        $.each(data, function (index, value) {
          xValues.push(value.name);
          yValues.push(value.value);
        });
        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.update();
      },
      error: function () {
        // Handle error
        alert("Error!");
      }
    });
  });

  $("#analyticsselect").trigger("change");



});
