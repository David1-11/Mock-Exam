let examQuestions = [];
let currentIdx = 0;
let userAnswers = {};
let timeLeft = 4800;
let securityWarnings = 0;

window.onblur = function() {
    securityWarnings++;
    if(securityWarnings >= 3) {
        alert("SECURITY BREACH: Multiple tab switches detected. Auto-submitting...");
        finishExam();
    } else {
        alert(`SECURITY WARNING: You left the exam screen! (${securityWarnings}/3 Warnings)`);
    }
};

function startExam() {
    const name = document.getElementById('student-name').value;
    if(!name) return alert("Full Name Required!");

    examQuestions = [];
    // Picks 20 questions randomly from 5 subjects in the large bank
    for(let subject in masterBank) {
        let shuffled = masterBank[subject].sort(() => 0.5 - Math.random());
        examQuestions.push(...shuffled.slice(0, 20)); 
    }
    examQuestions.sort(() => 0.5 - Math.random());

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('exam-screen').classList.remove('hidden');
    document.getElementById('exam-controls').classList.remove('hidden');

    const timer = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft/60), s = timeLeft % 60;
        const box = document.getElementById('timer-box');
        box.innerText = `${m}:${s<10?'0':''}${s}`;
        if(timeLeft < 300) box.classList.add('low-time');
        if(timeLeft <= 0) { clearInterval(timer); finishExam(); }
    }, 1000);

    renderQuestion();
}

function renderQuestion() {
    const q = examQuestions[currentIdx];
    document.getElementById('q-number').innerText = `Question ${currentIdx + 1} of 100`;
    document.getElementById('q-text').innerText = q.q;
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-card' + (userAnswers[currentIdx] === opt ? ' selected' : '');
        btn.onclick = () => { userAnswers[currentIdx] = opt; renderQuestion(); };
        grid.appendChild(btn);
    });

    document.getElementById('next-btn').classList.toggle('hidden', currentIdx === examQuestions.length - 1);
    document.getElementById('submit-btn').classList.toggle('hidden', currentIdx !== examQuestions.length - 1);
}

function navigate(dir) {
    currentIdx += dir;
    renderQuestion();
}

function finishExam() {
    let score = 0;
    examQuestions.forEach((q, i) => { if(userAnswers[i] === q.a) score++; });
    const name = document.getElementById('student-name').value;
    const phone = "2347082828150";
    const report = `*IBEJU SENIOR HIGH SCHOOL RESULT*%0A*Candidate:* ${name}%0A*Score:* ${score}/100%0A*Security:* ${securityWarnings} switches`;
    window.location.href = `https://wa.me/${phone}?text=${report}`;
}