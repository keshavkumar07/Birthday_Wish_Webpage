document.addEventListener("DOMContentLoaded", () => {
  const flame = document.getElementById("flame");
  const cakeContainer = document.getElementById("cakeContainer");
  const cakePrompt = document.getElementById("cakePrompt");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const soundBtn = document.getElementById("soundBtn");
  const floatingBg = document.getElementById("floatingBg");

  // Web Audio Synthesizer Engine
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Plays a full ~10-second "Happy Birthday" melody
  function playFull10SecMelody() {
    initAudio();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Note frequencies (Hz) & relative timing
    const melody = [
      { note: 261.63, duration: 0.35 }, // Hap-
      { note: 261.63, duration: 0.25 }, // py
      { note: 293.66, duration: 0.6 },  // Birth-
      { note: 261.63, duration: 0.6 },  // day
      { note: 349.23, duration: 0.6 },  // to
      { note: 329.63, duration: 1.0 },  // you
      
      { note: 261.63, duration: 0.35 }, // Hap-
      { note: 261.63, duration: 0.25 }, // py
      { note: 293.66, duration: 0.6 },  // Birth-
      { note: 261.63, duration: 0.6 },  // day
      { note: 392.00, duration: 0.6 },  // to
      { note: 349.23, duration: 1.0 },  // you

      { note: 261.63, duration: 0.35 }, // Hap-
      { note: 261.63, duration: 0.25 }, // py
      { note: 523.25, duration: 0.6 },  // Birth-
      { note: 440.00, duration: 0.6 },  // day
      { note: 349.23, duration: 0.6 },  // dear
      { note: 329.63, duration: 0.6 },  // Mus-
      { note: 293.66, duration: 0.9 },  // kan Ji

      { note: 466.16, duration: 0.35 }, // Hap-
      { note: 466.16, duration: 0.25 }, // py
      { note: 440.00, duration: 0.6 },  // Birth-
      { note: 349.23, duration: 0.6 },  // day
      { note: 392.00, duration: 0.6 },  // to
      { note: 349.23, duration: 1.2 }   // you!
    ];

    let currentTime = audioCtx.currentTime;

    melody.forEach((item) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(item.note, currentTime);

      // Smooth sound fade
      gain.gain.setValueAtTime(0.35, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + item.duration - 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(currentTime);
      osc.stop(currentTime + item.duration);

      currentTime += item.duration;
    });
  }

  // Initial Confetti Shower
  launchConfetti();

  // Candle Blow Out Event
  let isBlown = false;
  cakeContainer.addEventListener("click", () => {
    if (!isBlown) {
      flame.classList.add("off");
      cakePrompt.textContent = "Your wish is registered! Happy Birthday Muskan Ji! ✨";
      cakePrompt.style.color = "#ffa502";
      
      // Play full 10 second birthday music & launch confetti
      playFull10SecMelody();
      launchConfetti();
      isBlown = true;
    } else {
      flame.classList.remove("off");
      cakePrompt.textContent = "Tap the flame or blow into your mic to make a wish! 🕯️✨";
      cakePrompt.style.color = "#eccc68";
      isBlown = false;
    }
  });

  // Microphone Blow Detection
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const micAudioCtx = new AudioContext();
      const analyzer = micAudioCtx.createAnalyser();
      const microphone = micAudioCtx.createMediaStreamSource(stream);
      const scriptProcessor = micAudioCtx.createScriptProcessor(2048, 1, 1);

      analyzer.smoothingTimeConstant = 0.8;
      analyzer.fftSize = 1024;

      microphone.connect(analyzer);
      analyzer.connect(scriptProcessor);
      scriptProcessor.connect(micAudioCtx.destination);

      scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(array);
        let values = 0;
        for (let i = 0; i < array.length; i++) {
          values += array[i];
        }
        const average = values / array.length;
        if (average > 45 && !isBlown) { 
          flame.classList.add("off");
          cakePrompt.textContent = "You blew out the candle! Wish Granted! 🎉";
          playFull10SecMelody();
          launchConfetti();
          isBlown = true;
        }
      };
    }).catch(() => {
      // Tap interaction remains active if mic permissions are declined
    });
  }

  // Buttons Event Listeners
  celebrateBtn.addEventListener("click", () => {
    playFull10SecMelody();
    launchConfetti();
  });

  soundBtn.addEventListener("click", playFull10SecMelody);

  function launchConfetti() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 }
      });
    }
  }

  // Floating Background Emoji Particle Generator
  const emojis = ["🎈", "🌸", "✨", "💖", "🎉", "⭐"];
  function spawnParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = (Math.random() * 3 + 4) + "s";
    floatingBg.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 7000);
  }

  setInterval(spawnParticle, 500);
});

// Flip gift card function
function flipCard(card) {
  card.classList.toggle("flipped");
}