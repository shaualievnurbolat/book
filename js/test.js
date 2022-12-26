// Количество вопросов на которые будет отвечать пользователь
const TOTAL_QUESTIONS_NUMBER = 25;

const app = new Vue({
  el: "#test",
  data: {
    xmlDoc: null,

    currentQuestionNumber: 1,
    question: "",
    answers: [],
    key: "",
    checkedAnswers: [],

    // Общее количество вопросов в .xml файле
    totalQuestionsNumber: 0,
    // Вопросы, на которые уже ответили (чтобы не повторялись вопросы при получении их случайным образом)
    alreadyReceivedTasks: [],

    rightAnswers: "",
    wrongAnswers: "",
    testResult: null,

    barTotalWidth: 0,
    barRightWidth: 0,
    barWrongWidth: 0,

    finished: false,
    testLoaded: false,
    status: "Загрузка",
  },
  methods: {
    checkAnswer(selectedAnswer = "") {
      let toCheck = selectedAnswer === "" ? this.checkedAnswers.sort().join("") : selectedAnswer;
      toCheck == this.right ? this.rightAnswers++ : this.wrongAnswers++;

      this.testResult = String(Math.round((this.rightAnswers / TOTAL_QUESTIONS_NUMBER) * 100)) + "%";

      this.barTotalWidth = (100 / TOTAL_QUESTIONS_NUMBER) * this.currentQuestionNumber;
      this.barRightWidth = (100 / TOTAL_QUESTIONS_NUMBER) * this.rightAnswers;
      this.barWrongWidth = (100 / TOTAL_QUESTIONS_NUMBER) * this.wrongAnswers;

      if (this.currentQuestionNumber == TOTAL_QUESTIONS_NUMBER) {
        this.finished = true;
        return;
      }

      if (this.hasMultipleAnswers()) {
        $(":checkbox").prop("checked", false).parent().removeClass("active");
        this.checkedAnswers = [];
      }

      this.currentQuestionNumber++;
      this.nextQuestion();
    },
    nextQuestion() {
      var randomNumber = null;

      do {
        randomNumber = getRandomInt(0, this.totalQuestionsNumber);
      } while (this.alreadyReceivedTasks.includes(randomNumber));
      this.alreadyReceivedTasks.push(randomNumber);

      let task = this.xmlDoc.getElementsByTagName("task")[randomNumber];
      this.question = task.getAttribute("question");
      this.key = task.getAttribute("key");
      this.right = task.attributes["answer" + this.key].nodeValue;
      let tAnswers = [];
      for (let attr of task.attributes) {
        if (attr.name.startsWith("answer")) {
          tAnswers.push(attr.nodeValue);
        }
      }
      tAnswers.sort(() => (Math.random() > 0.5 ? 1 : -1));
      this.answers = [];
      let n = 0;
      for (let attr of task.attributes) {
        if (attr.name.startsWith("answer")) {
          this.answers.push({
            key: attr.name.charAt(attr.name.length - 1),
            text: tAnswers[n],
          });
          n++;
        }
      }
    },
    testReset() {
      this.currentQuestionNumber = 1;
      this.question = "";
      this.answers = [];
      this.key = "";
      this.checkedAnswers = [];

      this.alreadyReceivedTasks = [];

      this.rightAnswers = "";
      this.wrongAnswers = "";
      this.testResult = null;

      this.barRightWidth = 0;
      this.barWrongWidth = 0;

      this.finished = false;

      this.nextQuestion();
    },
    hasMultipleAnswers() {
      return this.key.length > 1;
    },
  },
  computed: {
    answerButtonsColumns() {
      const columns = [];
      var i,
        j,
        chunk = 5;
      for (i = 0, j = this.answers.length; i < j; i += chunk) {
        columns.push(this.answers.slice(i, i + chunk));
      }
      return columns;
    },
  },
  beforeMount() {
    //	let variant = location.search.split('variant=')[1];
    fetch("test.xml")
      .then((response) => response.text())
      .then((text) => new window.DOMParser().parseFromString(text, "text/xml"))
      .then((xml) => {
        this.xmlDoc = xml;
        this.testLoaded = xml.getElementsByTagName("test").length == 1;
        if (!this.testLoaded) {
          this.status = "Запрашиваемый тест отсутствует";
          return;
        }
        this.totalQuestionsNumber = this.xmlDoc.getElementsByTagName("task").length;
        this.barTotalWidth = (100 / TOTAL_QUESTIONS_NUMBER) * this.currentQuestionNumber;
        this.nextQuestion();
      });
  },
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // Максимум не включается, минимум включается
}
