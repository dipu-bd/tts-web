(() => {
  const editor = document.getElementById('editor');
  const reader = document.getElementById('reader');
  const clearBtn = document.getElementById('clearBtn');
  const pasteBtn = document.getElementById('pasteBtn');
  const readBtn  = document.getElementById('readBtn');

  let isReading = false;
  let currentIndex = -1;
  let seq = 0; // invalidate pending reads on restart

  function paragraphsFrom(text){
    return text.split(/\n+/).map(s => s.trim()).filter(Boolean);
  }

  function setReadingUI(on){
    isReading = on;
    if(on){
      editor.classList.add('hidden');
      reader.classList.remove('hidden');
      clearBtn.disabled = true;
      pasteBtn.disabled = true;
      readBtn.textContent = 'Stop';
    } else {
      editor.classList.remove('hidden');
      reader.classList.add('hidden');
      clearBtn.disabled = false;
      pasteBtn.disabled = false;
      readBtn.textContent = 'Read';
      currentIndex = -1;
      reader.innerHTML = '';
    }
  }

  function stop(){
    seq++;
    window.speechSynthesis.cancel();
    setReadingUI(false);
  }

  async function handlePaste(){
    try{
      const clip = await navigator.clipboard.readText();
      if(clip){
        const prefix = editor.value && !editor.value.endsWith('\n') ? '\n' : '';
        editor.value = editor.value + prefix + clip;
      }
    }catch{
      alert('Clipboard access denied');
    }
  }

  function renderReader(paragraphs){
    reader.innerHTML = '';
    paragraphs.forEach((p, i) => {
      const el = document.createElement('p');
      el.textContent = p;
      el.addEventListener('click', () => startFrom(i));
      reader.appendChild(el);
    });
  }

  function markActive(i){
    const nodes = Array.from(reader.children);
    nodes.forEach((n, idx) => {
      if(idx === i){ n.classList.add('active'); n.scrollIntoView({behavior:'smooth', block:'center'}); }
      else { n.classList.remove('active'); }
    });
  }

  function startFrom(index){
    const paras = paragraphsFrom(editor.value);
    if(!paras.length) return;

    // invalidate previous run and clear queue
    seq++;
    const mySeq = seq;
    window.speechSynthesis.cancel();
    setReadingUI(true);
    renderReader(paras);

    function speakNext(i){
      if(mySeq !== seq) return; // aborted
      if(i >= paras.length){ stop(); return; }
      currentIndex = i;
      markActive(i);

      const utt = new SpeechSynthesisUtterance(paras[i]);
      utt.onend = () => speakNext(i + 1);
      utt.onerror = () => speakNext(i + 1);
      window.speechSynthesis.speak(utt);
    }

    // Allow cancel to flush before speaking again
    setTimeout(() => {
      if(mySeq !== seq) return;
      speakNext(index);
    }, 0);
  }

  // Button handlers
  clearBtn.addEventListener('click', () => { if(!isReading) editor.value = ''; });
  pasteBtn.addEventListener('click', handlePaste);
  readBtn.addEventListener('click', () => {
    if(isReading) stop();
    else startFrom(0);
  });

  // Expose selection-to-continue: user clicks a paragraph in reader view

  // Graceful unload
  window.addEventListener('visibilitychange', () => {
    if(document.visibilityState !== 'visible'){ window.speechSynthesis.cancel(); }
  });
})();
