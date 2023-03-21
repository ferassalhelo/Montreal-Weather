import json from "../temperatures_2023.json" assert { type: "json" };

// function
let index = [
  { month: 1, start: 0, end: 31 },
  { month: 2, start: 31, end: 59 },
  { month: 3, start: 59, end: 90 },
  { month: 4, start: 90, end: 120 },
  { month: 5, start: 120, end: 151 },
  { month: 6, start: 151, end: 181 },
  { month: 7, start: 181, end: 212 },
  { month: 8, start: 212, end: 243 },
  { month: 9, start: 243, end: 273 },
  { month: 10, start: 273, end: 304 },
  { month: 11, start: 304, end: 334 },
  { month: 12, start: 334, end: 365 },
];

// today functoion
let nowTime = new Date().toLocaleDateString();
let today = (nowTime.substr(-4, 4) + "/" + nowTime.slice(0, -5)).replace(
  /\//g,
  "-"
);

if (today.length < 10) {
  const handleDate = today.split("");
  handleDate.splice(5, 0, "0");
  let result = handleDate.join("");
  today = result;
}

let todayIndex = json.temperatures.findIndex(
  (item) => item.DateDuJour === today
);

let getImg = (tump) => {
  if (tump <= 0) {
    return "./media/snowflake.gif";
  }
  if (tump <= 10) {
    return "./media/rain.gif";
  }
  if (tump <= 20) {
    return "./media/clouds.gif";
  }
  if (tump > 20) {
    return "./media/sun.gif";
  }
};
// Dom Element
// today section (the first)
let nowDateItem = document.getElementById("nowDate");
let nowTempItem = document.getElementById("nowTemp");
let minTempTodayItem = document.getElementById("minTempToday");
let maxTempTodayItem = document.getElementById("maxTempToday");
let mainImg = document.getElementById("mainImg");

nowDateItem.innerHTML = json.temperatures[todayIndex].DateDuJour;
nowTempItem.innerHTML = json.temperatures[todayIndex].TempDuJour;
minTempTodayItem.innerHTML = json.temperatures[todayIndex].TempMin;
maxTempTodayItem.innerHTML = json.temperatures[todayIndex].TempMax;
mainImg.src = getImg(json.temperatures[todayIndex].TempDuJour);
// month section (the therd)
let minValueInMonth = document.getElementById("minValueInMonth");
let avarageValueInMonth = document.getElementById("avarageValueInMonth");
let maxValueInMonth = document.getElementById("maxValueInMonth");
let selectBox = document.getElementById("selectBox");

let d = new Date();
let monthNumber = d.getMonth();
let indexMonth = index[monthNumber];
let monthDays = json.temperatures.slice(indexMonth.start, indexMonth.end);

let monthInfo = () => {
  let count = monthDays.length + 1;
  let min = 0;
  let avarage = 0;
  let max = 0;
  monthDays.map((item) => {
    item.TempMin < min ? (min = item.TempMin) : null;
    item.TempMax > max ? (max = item.TempMax) : null;
    avarage += item.TempMax + item.TempMin;
  });
  minValueInMonth.innerHTML = min;
  avarageValueInMonth.innerHTML = Math.ceil(avarage / count);
  maxValueInMonth.innerHTML = max;
};

// several days
let btns = document.getElementById("btns");
let daysCntainer = document.getElementById("daysContainer");
let dayesNumber = 3;

let pushDayes = () => {
  let dayes = json.temperatures.slice(todayIndex, +todayIndex + +dayesNumber);
  dayes.map((item) => {
    return (daysCntainer.innerHTML += `<div class="col">
    <div class="card">
        <img src="${getImg(
          item.TempDuJour
        )}" class="card-img-top border-bottom" alt="img">
        <div class="card-body">
            <h2 class="card-title">Day: ${item.DateDuJour}</h2>
            <h1 class="text-success">Tum:  ${item.TempDuJour}°C</h1>
            <h2 class="text-danger">Min:  ${item.TempMax}°C</h2>
            <h2 class="text-info">Max:  ${item.TempMin}°C</h2>
        </div>
    </div>
</div>`);
  });
};
pushDayes();

let createChar = () => {
  /**
   * ---------------------------------------
   * This demo was created using amCharts 5.
   *
   * For more information visit:
   * https://www.amcharts.com/
   *
   * Documentation is available at:
   * https://www.amcharts.com/docs/v5/
   * ---------------------------------------
   */

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("chartdiv");

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout,
      pinchZoomX: true,
    })
  );

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  var cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "none",
    })
  );
  cursor.lineY.set("visible", false);

  // The data
  var data = json.temperatures.slice(
    index[monthNumber].start,
    index[monthNumber].end
  );

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, {});
  xRenderer.grid.template.set("location", 0.5);
  xRenderer.labels.template.setAll({
    location: 0.5,
    multiLocation: 0.5,
  });

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "DateDuJour",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  xAxis.data.setAll(data);

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxPrecision: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        inversed: false,
      }),
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

  function createSeries(name, field) {
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "DateDuJour",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
        }),
      })
    );

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get("fill"),
        }),
      });
    });

    // create hover state for series and for mainContainer, so that when series is hovered,
    // the state would be passed down to the strokes which are in mainContainer.
    series.set("setStateOnChildren", true);
    series.states.create("hover", {});

    series.mainContainer.set("setStateOnChildren", true);
    series.mainContainer.states.create("hover", {});

    series.strokes.template.states.create("hover", {
      strokeWidth: 4,
    });

    series.data.setAll(data);
    series.appear(1000);
  }

  createSeries("TempMin", "TempMin");
  createSeries("TempMax", "TempMax");
  // Add scrollbar
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
      marginBottom: 20,
    })
  );

  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  // Make series change state when legend item is hovered
  legend.itemContainers.template.states.create("hover", {});

  legend.itemContainers.template.events.on("pointerover", function (e) {
    e.target.dataItem.dataContext.hover();
  });
  legend.itemContainers.template.events.on("pointerout", function (e) {
    e.target.dataItem.dataContext.unhover();
  });

  legend.data.setAll(chart.series.values);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 100);
};

createChar();
monthInfo();
selectBox.addEventListener("click", (e) => {
  document.getElementById("charContanir").innerHTML = "";
  document.getElementById("charContanir").innerHTML = '<div id="chartdiv">';
  e.target.value !== undefined ? (monthNumber = e.target.value - 1) : null;
  indexMonth = index[monthNumber];
  monthDays = json.temperatures.slice(indexMonth.start, indexMonth.end);
  monthInfo();
  createChar();
});

btns.addEventListener("click", (e) => {
  daysCntainer.innerHTML = "";
  e.target.value !== undefined ? (dayesNumber = e.target.value) : null;
  pushDayes();
});
