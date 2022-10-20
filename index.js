const timeTravelOneWay = 50;
const travelOneWayCost = 700;
const travelRoundtripCost = 1200;

const routeSelect = document.getElementById("route");
const timeSelect = document.getElementById("time");
const timeSelectReverse = document.getElementById("time-reverse");
const labelTimeSelectReverse = document.querySelector(
  'label[for="time-reverse"]'
);
const inputCountTicket = document.getElementById("num");

const excursionProps = {
  route: routeSelect.value,
  timeStart: null,
  ticketCount: 0,
  costTravel: 0,
  timeTravel: 0,
  timeEnd: null,
};

function selectedLogic() {
  window.addEventListener("DOMContentLoaded", () => {
    timeSelect.disabled = 1;
    inputCountTicket.disabled = 1;
    timeSelectReverse.style.display = "none";
    labelTimeSelectReverse.style.display = "none";
  });

  function hideOptionsTime() {
    Array.from(timeSelect.options).forEach((option) => {
      option.style.display = "none";
    });
  }

  function selectedTime() {
    Array.from(timeSelect.options)
      .filter((option) => option.dataset.route === routeSelect.value)
      .forEach((option) => {
        option.style.display = "block";
      });
  }

  routeSelect.addEventListener("change", (e) => {
    if (e.target.value !== "choose route")
      (timeSelect.disabled = 0), (inputCountTicket.disabled = 0);
    else timeSelect.disabled = 1;
    timeSelectReverse.style.display = "none";
    labelTimeSelectReverse.style.display = "none";

    hideOptionsTime();

    switch (e.target.value) {
      case "из A в B":
        selectedTime();
        getInterval();
        break;

      case "из B в A":
        selectedTime();
        getInterval();
        break;

      case "из A в B и обратно в А":
        Array.from(timeSelect.options)
          .filter((option) => option.dataset.route == "из A в B")
          .forEach((option) => {
            option.style.display = "block";
          });
        labelTimeSelectReverse.style.display = "inline-block";
        timeSelectReverse.style.display = "inline-block";
        timeReverseChange();
        break;
    }
  });

  function getInterval() {
    timeSelect.addEventListener("change", (e) => {
      const partsTimeA = e.target.value.split(":");

      const timeWithInterval = new Date();
      timeWithInterval.setHours(partsTimeA[0], partsTimeA[1]);

      const timeStopA = new Date(timeWithInterval.getTime() + 50 * 60 * 1000);

      excursionProps.timeEnd = `${timeStopA.getHours()}:${timeStopA.getMinutes()}`;
    });
  }

  function timeReverseChange() {
    timeSelect.addEventListener("change", (e) => {
      const partsTimeA = e.target.value.split(":");

      const timeWithInterval = new Date();
      timeWithInterval.setHours(partsTimeA[0], partsTimeA[1]);

      const timeStopA = new Date(timeWithInterval.getTime() + 50 * 60 * 1000);

      Array.from(timeSelectReverse.options).forEach((option) => {
        const partsTimeB = option.value.split(":");
        const timeStartB = new Date();
        timeStartB.setHours(partsTimeB[0], partsTimeB[1]);

        if (timeStopA > timeStartB) option.disabled = true;
      });

      timeSelectReverse.addEventListener("change", (e) => {
        excursionProps.timeEnd = e.target.value;
      });
    });
  }
}

selectedLogic();

function getValueSelect(select, obj, objName) {
  select.addEventListener("change", () => {
    const value = select.options[select.selectedIndex].value;
    obj[objName] = value;
  });
}

getValueSelect(routeSelect, excursionProps, "route");
getValueSelect(timeSelect, excursionProps, "timeStart");

inputCountTicket.addEventListener("input", () => {
  excursionProps.ticketCount = inputCountTicket.value;
});

function getProps() {
  excursionProps.route === "из A в B и обратно в А"
    ? ((excursionProps.costTravel =
        excursionProps.ticketCount * travelRoundtripCost),
      (excursionProps.timeTravel = timeTravelOneWay * 2))
    : ((excursionProps.costTravel =
        excursionProps.ticketCount * travelOneWayCost),
      (excursionProps.timeTravel = timeTravelOneWay));
}

const btn = document.getElementById("btn");
const textBlock = document.getElementById("text-message-block");

btn.addEventListener("click", () => {
  if (
    excursionProps.route === "choose" ||
    excursionProps.timeStart === null ||
    excursionProps.ticketCount === "0"
  ) {
    textBlock.textContent = "Заполните правильно все поля";
    textBlock.style.color = "red";
    return;
  }
  getProps();
  textBlock.textContent = `Вы выбрали ${excursionProps.ticketCount} билета по маршруту ${excursionProps.route} стоимостью ${excursionProps.costTravel} р.
  Это путшествие займет у вас ${excursionProps.timeTravel} мин
  Теплоход отправляется в ${excursionProps.timeStart}, а прибудет ${excursionProps.timeEnd}`;
});
