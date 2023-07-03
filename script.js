const words = document.querySelector(".inputs .words");
const wordsCount = document.querySelector("#words-count");
const codeDiv = document.querySelector("#code pre code");
const timeInput = document.querySelector("#word-time");
const showInput = document.querySelector("#show");
const hideInput = document.querySelector("#hide");
const generateBtn = document.querySelector("#generate-code");
const copyButton = document.getElementById("copy-button");
const hideFeedback = document.querySelector("#hide-error");
const modeBtn = document.querySelector("#dark-mode");

let time = parseFloat(timeInput.value);
let showTime = parseFloat(showInput.value);
let hideTime = parseFloat(hideInput.value);
let allWordsInputs = document.querySelectorAll(".word");
let wordsArray = [];
let wordPrecentage;
let letterShowP;
let letterHideP;

wordsCount.addEventListener("change", (e) => {
  calcPrecentage();
  resetCode();

  words.innerHTML = "";
  if (parseInt(e.target.value) >= 1 && parseInt(e.target.value) <= 20 && Number.isInteger(parseFloat(e.target.value))) {
    wordsArray.length = e.target.value;
    for (let i = 0; i < wordsCount.value; i++) {
      const wordDiv = document.createElement("div");
      wordDiv.setAttribute("class", "my-input-group col");
      const wordSpan = document.createElement("span");
      wordSpan.setAttribute("class", "input-group-text text-bg-primary border-0");
      wordSpan.innerHTML = `الكلمة: ${i + 1}#`;
      const wordInput = document.createElement("input");
      wordInput.setAttribute("type", "text");
      wordInput.setAttribute("class", `form-control text-truncate word word-${i + 1}`);
      wordInput.setAttribute("required", "");
      wordDiv.append(wordSpan);
      wordDiv.append(wordInput);
      words.append(wordDiv);
    }
    wordsCount.classList.remove("is-invalid");
  } else {
    wordsCount.classList.add("is-invalid");
    generateBtn.setAttribute("disabled", "");
  }
});

words.addEventListener("change", () => {
  allWordsInputs = document.querySelectorAll(".word");
  allWordsInputs.forEach((el, i) => {
    wordsArray[i] = el.value;
  });
});

timeInput.addEventListener("change", (el) => {
  time = parseFloat(el.target.value);
  validation();
});

showInput.addEventListener("change", (el) => {
  showTime = parseFloat(el.target.value);
  validation();
});

hideInput.addEventListener("change", (el) => {
  hideTime = parseFloat(el.target.value);
  validation();
});

generateBtn.addEventListener("click", () => {
  if (validation() && wordsCount.value > 0 && Number.isInteger(parseFloat(wordsCount.value))) {
    generateCode();
  }
});

modeBtn.addEventListener("click", () => {
  if (document.documentElement.hasAttribute("data-bs-theme")) {
    document.documentElement.removeAttribute("data-bs-theme");
    localStorage.removeItem("dark-mode");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("dark-mode", true);
  }
});

if (localStorage.getItem("dark-mode")) {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  modeBtn.setAttribute("checked", "");
}

copyButton.addEventListener("click", (e) => {
  const span = copyButton.querySelector("span");
  const icon = copyButton.querySelector("i");

  span.innerText = "تم النسخ! ";
  icon.className = "bi bi-clipboard-check-fill";

  copyButton.classList.remove("text-bg-primary");
  copyButton.classList.add("text-bg-success");

  setTimeout(() => {
    span.textContent = "نسخ ";
    icon.className = "bi bi-clipboard";

    copyButton.classList.remove("text-bg-success");
    copyButton.classList.add("text-bg-primary");
  }, 2000);
});

Prism.highlightAll();

let clipboard = new ClipboardJS(copyButton, {
  text: function () {
    return codeDiv.textContent;
  },
});

function generateCode() {
  codeDiv.innerText = `.test::after {\n  content: "";\n  animation: typing ${
    time * wordsCount.value
  }s linear infinite;\n}\n
@keyframes typing {
  0% {content: "";}\n`;

  wordsArray.map((word, wordIndex) => {
    if (hideTime > 0) {
      codeDiv.append(
        generateLines(word, wordIndex, wordPrecentage) + (wordPrecentage * (wordIndex + 1) + "%" + ' {content: "";}\n')
      );
    } else {
      codeDiv.append(generateLines(word, wordIndex, wordPrecentage));
    }
  });
  codeDiv.append(`}`);
}

function generateLines(word = "", wordIndex = 0, precentage = 0) {
  let currLetters = "";
  let showPhase = "  ";
  let hidePhase = "";
  let totalPhase = "";
  word.split("").forEach((letter, letterIndex) => {
    currLetters += letter;
    showPhase +=
      precentage * wordIndex +
      (calcShow() / word.length) * (letterIndex + 1) +
      "% {" +
      'content: "' +
      currLetters +
      '";}\n  ';
  });

  currWord = word.split("");
  if (hideTime > 0) {
    word.split("").forEach(() => {
      hidePhase +=
        precentage * (wordIndex + 1) -
        (calcHide() / word.length) * (currWord.join("").length + 1) +
        "% {" +
        'content: "' +
        currWord.join("") +
        '";}\n  ';
      currWord.pop();
    });
  } else {
    hidePhase = `${precentage * (wordIndex + 1)}% {content: "${word}";}\n`;
  }

  totalPhase = showPhase + hidePhase;
  return totalPhase;
}

function resetCode() {
  codeDiv.innerHTML = `
  @keyframes typing {
    // املأ الخانات المطلوبة أعلاه ثم اضغط على زر [عرض كود الأنميشن]
  }`;
}

function calcPrecentage() {
  wordPrecentage = 100 / parseInt(wordsCount.value) > 0 ? 100 / parseInt(wordsCount.value) : null;
}

function calcShow() {
  return (wordPrecentage * showTime) / time;
}
function calcHide() {
  return (wordPrecentage * hideTime) / time;
}

function validation() {
  let isValid = false;
  if (wordsCount.value > 0 || Number.isInteger(parseFloat(wordsCount.value))) {
    wordsCount.classList.remove("is-invalid");
    isValid = true;
  } else {
    wordsCount.classList.add("is-invalid");
    isValid = false;
  }

  if (time > 0) {
    timeInput.classList.remove("is-invalid");
    isValid = true;
  } else {
    timeInput.classList.add("is-invalid");
    isValid = false;
  }

  if (showTime >= 0 && showTime <= time) {
    showInput.classList.remove("is-invalid");
    isValid = true;
  } else {
    showInput.classList.add("is-invalid");
    isValid = false;
  }

  if (hideTime >= 0) {
    if (time - showTime >= 0 && hideTime <= time - showTime) {
      hideInput.classList.remove("is-invalid");
      isValid = true;
    } else if (time - showTime === 0) {
      hideFeedback.innerHTML = `بما أن مدتا الظهور والعرض متساويتان، فمدة الاختفاء لا يمكن أن تزيد عن الصفر`;
      hideInput.classList.add("is-invalid");
      isValid = false;
    } else if (time - showTime >= 0 && !(hideTime <= time - showTime)) {
      hideFeedback.innerHTML = `يجب أن تكون مدة الاختفاء أصغر من أو تساوي (${time - showTime})`;
      hideInput.classList.add("is-invalid");
      isValid = false;
    } else {
      hideFeedback.innerHTML = `يجب أن تكون مدة الاختفاء صفر أو أكثر، وأقل من مدة عرض الكلمة`;
      hideInput.classList.add("is-invalid");
      isValid = false;
    }
  } else {
    hideFeedback.innerHTML = `يجب أن تكون مدة الاختفاء صفر أو أكثر، وأقل من مدة عرض الكلمة`;
    hideInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) {
    generateBtn.setAttribute("disabled", "");
  } else {
    generateBtn.removeAttribute("disabled");
  }

  return isValid;
}
