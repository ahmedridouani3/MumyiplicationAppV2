// Jeu des Multiplications — logique du jeu

const QUESTIONS_PAR_NIVEAU = 10;

// Plage de tables selon le niveau (le niveau augmente toutes les 10 questions)
const PALIERS_NIVEAU = [
  { min: 1, max: 3 },
  { min: 2, max: 5 },
  { min: 3, max: 7 },
  { min: 1, max: 9 },
];

let niveau = 1;
let score = 0;
let numeroQuestion = 1;
let a = 0;
let b = 0;
let enAttente = false; // vrai pendant l'affichage du message avant la question suivante

const elNiveau = document.getElementById("niveau");
const elQuestion = document.getElementById("question");
const elReponse = document.getElementById("reponse");
const elMessage = document.getElementById("message");
const elScore = document.getElementById("score");
const elNumero = document.getElementById("numero");

function palierActuel() {
  const index = Math.min(niveau - 1, PALIERS_NIVEAU.length - 1);
  return PALIERS_NIVEAU[index];
}

function entierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genererQuestion() {
  const palier = palierActuel();
  a = entierAleatoire(palier.min, palier.max);
  b = entierAleatoire(1, 9);

  elQuestion.textContent = `${a} × ${b} = ?`;
  elNiveau.textContent = `Niveau ${niveau}`;
  elNumero.textContent = numeroQuestion;
  elMessage.textContent = "";
  elMessage.className = "";
  elReponse.value = "";
  elReponse.disabled = false;
  elReponse.focus();
  enAttente = false;
}

function verifierReponse() {
  if (enAttente) return;

  const saisie = elReponse.value.trim();
  if (saisie === "") {
    elReponse.focus();
    return;
  }

  const reponseJoueur = Number(saisie);
  const bonneReponse = a * b;
  enAttente = true;
  elReponse.disabled = true;

  if (reponseJoueur === bonneReponse) {
    score += 1;
    elScore.textContent = score;
    elMessage.textContent = "✅ Bravo, bonne réponse !";
    elMessage.className = "correct";
  } else {
    elMessage.textContent = `❌ Pas tout à fait. La bonne réponse était ${bonneReponse}.`;
    elMessage.className = "incorrect";
  }

  setTimeout(passerASuivante, 1200);
}

function passerASuivante() {
  if (numeroQuestion >= QUESTIONS_PAR_NIVEAU) {
    terminerNiveau();
  } else {
    numeroQuestion += 1;
    genererQuestion();
  }
}

function terminerNiveau() {
  const reussite = score >= Math.ceil(QUESTIONS_PAR_NIVEAU * 0.7);

  if (reussite && niveau < PALIERS_NIVEAU.length) {
    niveau += 1;
    elMessage.textContent = `🎉 Niveau terminé ! Score : ${score}/${QUESTIONS_PAR_NIVEAU}. Direction le niveau ${niveau} !`;
  } else if (reussite) {
    elMessage.textContent = `🏆 Niveau terminé ! Score : ${score}/${QUESTIONS_PAR_NIVEAU}. Tu maîtrises toutes les tables !`;
  } else {
    elMessage.textContent = `Niveau terminé. Score : ${score}/${QUESTIONS_PAR_NIVEAU}. On refait ce niveau pour s'entraîner encore un peu.`;
  }
  elMessage.className = "info";

  numeroQuestion = 1;
  score = 0;
  elScore.textContent = score;

  setTimeout(genererQuestion, 2200);
}

function reinitialiser() {
  niveau = 1;
  score = 0;
  numeroQuestion = 1;
  elScore.textContent = score;
  genererQuestion();
}

elReponse.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    verifierReponse();
  }
});

genererQuestion();
