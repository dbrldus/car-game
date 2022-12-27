const EndingScreen = document.getElementById("endUI");
const UIScreen = document.getElementById("ui");
const LeaderboardScreen = document.getElementById("lb_Screen");
const lbContent = document.getElementById("lbContent");
const numberInput = document.getElementById("number");
const nameInput = document.getElementById("name");
var score = 0;

export function GameStart() {
  EndingScreen.style.display = "none";
}

export function GameEnd(_score) {
  EndingScreen.style.display = "flex";
  score = _score;
}

function SaveRecord() {
  var number = numberInput.value;
  var name = nameInput.value;

  var data = JSON.parse(localStorage.getItem("LeaderBoard_Car") ?? "[]");
  if (data.length != 0) {
    var data_1 = data.filter((value) => value.score >= score);
    var data_2 = data.filter((value) => value.score < score);
    data = [...data_1, { number, name, score }, ...data_2];
  } else {
    data.push({ number, name, score });
  }

  localStorage.setItem("LeaderBoard_Car", JSON.stringify(data));

  numberInput.value = "";
  nameInput.value = "";
  EndingScreen.style.display = "none";
}

document
  .getElementById("playerInfoForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    SaveRecord();
  });

document.getElementById("leaderboard").addEventListener("click", () => {
  showLBscreen();
});

document.getElementById("lbBack").addEventListener("click", () => {
  hideLBscreen();
});

const showLBscreen = () => {
  LeaderboardScreen.style.display = "flex";
  EndingScreen.style.display = "none";
  UIScreen.style.display = "none";
  loadLeaderboard();
};

const hideLBscreen = () => {
  LeaderboardScreen.style.display = "none";
  UIScreen.style.display = "flex";
};

const loadLeaderboard = () => {
  var data = JSON.parse(localStorage.getItem("LeaderBoard_Car")) ?? [];
  var filtered = data.filter((value, index) => index < 10);
  var element = "";
  filtered.forEach((value, index) => {
    element += `<div id="lbListItem">${index + 1}. ${value.number} ${
      value.name
    } ${value.score}</div>`;
  });

  lbContent.innerHTML = element;
};
