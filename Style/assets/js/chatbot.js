/**
 * VG Portfolio AI Chatbot — v2
 * Fixed click handling, character-by-character typing, sophisticated NLP
 */
(function() {
  'use strict';

  const AVATAR = 'assets/img/chatbot-avatar.webp';

  // ── Portfolio Knowledge Base ──
  const KB = {
    name: 'Vijaya Gowtham',
    nick: 'Vijay',
    title: 'Full Stack Developer & AI Engineer',
    roles: ['AI Engineer','UI Designer','Frontend Developer','Full Stack Developer'],
    location: 'Tamil Nadu, India',
    email: 'vijayagowthamv@gmail.com',
    phone: '+91 9789716993',
    linkedin: 'https://www.linkedin.com/in/vijayagowtham/',
    github: 'https://github.com/Vijayagowtham',
    summary: 'Aspiring Full Stack Developer and AI & Data Science student who builds clean, responsive web apps and turns ideas into digital solutions. Passionate about leveraging AI to create impactful, real-world applications.',
    education: { degree:'B.Tech – AI and Data Science', university:'Dhanalakshmi Srinivasan Engineering College (Autonomous)', year:'2023-2027', cgpa:'8.1/10' },
    skills: {
      frontend: ['HTML5','CSS3','JavaScript','React.js','Next.js','Tailwind CSS','Responsive Design','Component-Based UI'],
      backend: ['Node.js','Express.js','Java','Spring Boot','REST APIs','CRUD Operations'],
      database: ['MongoDB','Supabase','Firebase','PostgreSQL'],
      ai: ['OpenAI API','Gemini API','Claude API','n8n','Flowise','Chatbot Development','Prompt Engineering','Workflow Automation'],
      tools: ['Git','GitHub','Postman','VS Code','Vercel','Netlify','Figma','Docker']
    },
    projects: [
      { name:'Daily Motivation Dashboard', desc:'Web app delivering daily inspirational quotes, goal tracking, and mood insights.', tech:['HTML','CSS','JavaScript','API Integration'], link:'https://dailymotivationdashboard.netlify.app' },
      { name:'BudgetAI – Smart Expense Manager', desc:'Full-stack AI-powered personal finance app with smart expense tracking, charts, CSV export, financial goals, and an AI Financial Advisor.', tech:['React','Node.js','Supabase','AI'], link:'https://ai01budget01mangement01system.vercel.app/' },
      { name:'Student Leave Management System', desc:'Web-based leave management with request forms, approval workflows, status tracking, and role-based access.', tech:['HTML','CSS','JavaScript','Firebase'] },
      { name:'Hospital Load Balancing System', desc:'Intelligent patient distribution and resource monitoring across medical centers using predictive analytics.', tech:['React','Node.js','Supabase','PostgreSQL'] },
      { name:'Employee Management System', desc:'HR dashboard for tracking attendance, departmental analytics, and staff profiles with dark-mode UI.', tech:['HTML','CSS','JavaScript','Firebase'] },
      { name:'CarSpot App', desc:'Premium luxury car marketplace with advanced filtering, comparison features, and sleek responsive UI.', tech:['HTML','CSS','JavaScript','UI Design'] },
      { name:'AI-Driven Healthcare Chatbot', desc:'Built for Smart India Hackathon 2025 — AI chatbot providing symptom-based health guidance. Recognized as SIH 2025 Grand Finalist.', tech:['React','Node.js','AI APIs','Chatbot Logic'] }
    ],
    internships: [
      { role:'Full Stack Developer Intern', company:'VINSUP INFOTECH (P) LTD', highlights:'Led design of multiple landing pages, optimized for performance. Tech: HTML, CSS, JS, Java, Spring Boot, PostgreSQL.' },
      { role:'Software Development Intern', company:'SKILLCRAFT TECHNOLOGY (Remote)', highlights:'Developed, tested, and debugged full-stack web applications. Implemented features and resolved defects with cross-functional teams.' }
    ],
    certs: ['Cloud Computing (NPTEL)','Full Stack Development (VINSUP INFOTECH)','Data Science (Infosys Springboard)','Generative AI (Microsoft)','Communication Skills (TCS)','HTML CSS JavaScript (MIND LUSTER)'],
    achievements: ['Smart India Hackathon 2025 Grand Finalist','GENESIS Hackathon Participant (SRM Easwari)','Student Coordinator – AI & DS Department Symposium']
  };

  // ── Intent Detection ──
  const INTENTS = [
    { id:'greeting',   kw:['hi','hello','hey','howdy','greetings','good morning','good evening','sup','yo'] },
    { id:'about',      kw:['who is','about','tell me about','introduce','background','describe','who are you','what does vijay do'] },
    { id:'skills',     kw:['skills','technologies','tech stack','what can','abilities','expertise','proficient','capable','know'] },
    { id:'projects',   kw:['projects','built','portfolio','work','created','developed','apps','applications','show me'] },
    { id:'hire',       kw:['hire','why should','strengths','value','stand out','unique','special','best','what makes'] },
    { id:'education',  kw:['education','degree','study','university','college','academic','school','cgpa','gpa'] },
    { id:'experience', kw:['internship','experience','work experience','job','career','professional','worked'] },
    { id:'contact',    kw:['contact','reach','email','phone','connect','get in touch','linkedin','github','how to reach'] },
    { id:'certs',      kw:['certifications','certificates','courses','certified','credential','learning'] },
    { id:'achievements', kw:['achievements','awards','hackathon','sih','accomplishments','recognition','won'] },
    { id:'frontend',   kw:['frontend','front end','front-end','ui','user interface','css','html','react','tailwind'] },
    { id:'backend',    kw:['backend','back end','back-end','server','api','node','express','java','spring boot'] },
    { id:'fullstack',  kw:['full stack','fullstack','full-stack','both frontend and backend','end to end'] },
    { id:'ai',         kw:['ai','artificial intelligence','machine learning','automation','chatbot','llm','openai','gemini','claude','prompt'] },
    { id:'thanks',     kw:['thanks','thank you','appreciate','helpful','great','awesome','cool'] },
    { id:'goodbye',    kw:['bye','goodbye','see you','later','take care','exit','close'] }
  ];

  function detect(msg) {
    const m = msg.toLowerCase().trim();
    let best = null, bestLen = 0;
    for (const i of INTENTS) {
      for (const k of i.kw) {
        if (m.includes(k) && k.length > bestLen) { best = i.id; bestLen = k.length; }
      }
    }
    return best || 'unknown';
  }

  // ── Response Generation ──
  function respond(intent) {
    const d = KB;
    const pick = arr => arr[Math.floor(Math.random()*arr.length)];
    const allSkills = Object.values(d.skills).flat();
    const projList = d.projects.map(p => `• **${p.name}** — ${p.desc.substring(0,70)}... [${p.tech.join(', ')}]`).join('\n');

    const R = {
      greeting: [
        `Hey there! 👋 I'm Vijay's AI assistant. I know everything about his skills, projects, experience, and more. What would you like to know?`,
        `Hello! Welcome to Vijay's portfolio. Ask me anything — skills, projects, why you should hire him — I've got all the answers!`
      ],
      about: [
        `**${d.name}** is an ${d.title} currently pursuing ${d.education.degree} at ${d.education.university} (CGPA: ${d.education.cgpa}).\n\n${d.summary}\n\nWith **${d.projects.length}+ projects**, **${d.certs.length} certifications**, and recognition as a **SIH 2025 Grand Finalist**, Vijay brings both technical depth and creative vision to every project.`
      ],
      skills: [
        `Vijay has a **powerful full-stack skill set**:\n\n🎨 **Frontend:** ${d.skills.frontend.join(', ')}\n\n⚙️ **Backend:** ${d.skills.backend.join(', ')}\n\n🗄️ **Database:** ${d.skills.database.join(', ')}\n\n🤖 **AI & Automation:** ${d.skills.ai.join(', ')}\n\n🛠️ **DevTools:** ${d.skills.tools.join(', ')}\n\nHis strongest areas are **React**, **Node.js**, **AI integrations**, and **responsive UI design**.`
      ],
      projects: [
        `Vijay has built **${d.projects.length}+ projects** across web design, full-stack development, and AI:\n\n${projList}\n\nHis standout work — the **AI-Driven Healthcare Chatbot** — earned him a spot as a **SIH 2025 Grand Finalist** among thousands of teams nationwide.`
      ],
      hire: [
        `Here's why Vijay is an excellent hire:\n\n✅ **Versatile Full-Stack Developer** — React, Node.js, Java, Spring Boot, Python\n✅ **AI & Automation Expert** — OpenAI, Gemini, Claude APIs + workflow automation\n✅ **Proven Innovator** — ${d.projects.length}+ projects, SIH 2025 Grand Finalist\n✅ **Strong Academics** — B.Tech AI & Data Science, 8.1 CGPA\n✅ **Industry Experience** — Internships at VINSUP INFOTECH & SKILLCRAFT TECHNOLOGY\n✅ **Continuous Learner** — ${d.certs.length} certifications from NPTEL, Microsoft, Infosys, TCS\n\nHe combines **technical depth** with **creative design thinking** — a rare and valuable combination.`
      ],
      education: [
        `🎓 **${d.education.degree}**\n📍 ${d.education.university}\n📅 ${d.education.year}\n📊 CGPA: **${d.education.cgpa}**\n\nVijay was also selected as a **SIH 2025 Grand Finalist** — among thousands of teams nationwide — for developing an innovative AI Healthcare Chatbot.`
      ],
      experience: [
        `Vijay has real-world industry experience:\n\n💼 **${d.internships[0].role}** at ${d.internships[0].company}\n${d.internships[0].highlights}\n\n💼 **${d.internships[1].role}** at ${d.internships[1].company}\n${d.internships[1].highlights}\n\nThese internships gave him hands-on experience with production codebases and professional development workflows.`
      ],
      contact: [
        `Reach Vijay at:\n\n📧 **Email:** ${d.email}\n📱 **Phone:** ${d.phone}\n💼 **LinkedIn:** [linkedin.com/in/vijayagowtham](${d.linkedin})\n🐙 **GitHub:** [github.com/Vijayagowtham](${d.github})\n\nHe's always open to new opportunities and creative collaborations!`
      ],
      certs: [
        `Vijay holds **${d.certs.length} professional certifications**:\n\n${d.certs.map(c=>'🏅 '+c).join('\n')}\n\nThese span **cloud computing, full-stack development, AI, data science**, and communication.`
      ],
      achievements: [
        `🏆 ${d.achievements.map(a=>'**'+a+'**').join('\n🏆 ')}\n\nThe **Smart India Hackathon** is India's largest national hackathon — being a Grand Finalist demonstrates exceptional problem-solving and execution.`
      ],
      frontend: [
        `Vijay is **highly skilled in frontend development**:\n\n• **Core:** HTML5, CSS3, JavaScript (ES6+)\n• **Frameworks:** React.js, Next.js\n• **Styling:** Tailwind CSS, Custom CSS, Responsive Design\n• **Design:** UI/UX, Figma, Component Architecture\n\nHis portfolio itself showcases his frontend expertise — with glassmorphism effects, smooth animations, and pixel-perfect responsive layouts.`
      ],
      backend: [
        `Vijay's **backend capabilities**:\n\n• **Runtime:** Node.js, Express.js\n• **Languages:** JavaScript, Java, Python\n• **Frameworks:** Spring Boot\n• **APIs:** REST, CRUD, third-party integrations\n• **Databases:** PostgreSQL, MongoDB, Firebase, Supabase\n\nHe builds **scalable architectures** with secure auth and real-time data processing.`
      ],
      fullstack: [
        `Vijay is a **true full-stack developer**:\n\n🎨 **Frontend:** React, Next.js, Tailwind CSS\n⚙️ **Backend:** Node.js, Express.js, Java, Spring Boot\n🗄️ **Database:** PostgreSQL, MongoDB, Supabase, Firebase\n🤖 **AI:** OpenAI, Gemini, Claude API integration\n\nHe's built **${d.projects.length}+ end-to-end applications** including BudgetAI and Hospital Load Balancing — all requiring full-stack expertise.`
      ],
      ai: [
        `Vijay has **strong AI & automation skills**:\n\n• **LLM APIs:** OpenAI, Gemini, Claude\n• **AI Tools:** n8n, Flowise, Llama\n• **Specialties:** Chatbot Development, Prompt Engineering, Workflow Automation\n\nHis AI Healthcare Chatbot earned him a **SIH 2025 Grand Finalist** spot — proving his ability to build impactful AI solutions.`
      ],
      thanks: [`You're welcome! 😊 Feel free to ask anything else about Vijay.`, `Glad I could help! Ask away if you have more questions.`],
      goodbye: [`Goodbye! Thanks for visiting Vijay's portfolio. 🚀`, `See you later! Come back anytime. 👋`],
      unknown: [
        `Interesting question! I can tell you about Vijay's **skills**, **projects**, **experience**, **education**, or **achievements**. What interests you?`,
        `I'd love to help! Try asking about Vijay's **tech stack**, **projects**, or why you should **hire** him. 😊`
      ]
    };
    return pick(R[intent] || R.unknown);
  }

  // ── Markdown renderer ──
  function md(t) {
    return t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline">$1</a>')
      .replace(/\n/g, '<br>');
  }

  // ── Build UI ──
  function init() {
    const root = document.getElementById('vg-chatbot-root');
    if (!root) return;

    root.innerHTML = `
      <div class="vg-chatbot-wrapper" id="vgChatWrapper">
        <div class="vg-chatbot-label" id="vgChatLabel">Chat with Vijay's AI</div>
        <button class="vg-chatbot-btn" id="vgChatBtn" aria-label="Open AI Assistant">
          <img src="${AVATAR}" alt="AI Assistant" width="48" height="48">
        </button>
      </div>
      <div class="vg-chatbot-window" id="vgChatWin">
        <div class="vg-chat-header">
          <img src="${AVATAR}" alt="" class="vg-chat-header-avatar" width="38" height="38">
          <div class="vg-chat-header-info"><h4>VG Assistant</h4><span>Online</span></div>
          <button class="vg-chat-close" id="vgChatClose" aria-label="Close"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="vg-chat-messages" id="vgChatMsgs"></div>
        <div class="vg-chat-input-area">
          <input type="text" class="vg-chat-input" id="vgChatIn" placeholder="Ask about Vijay..." autocomplete="off">
          <button class="vg-chat-send" id="vgChatSend" aria-label="Send"><i class="bi bi-send-fill"></i></button>
        </div>
      </div>`;

    const btn = document.getElementById('vgChatBtn');
    const wrapper = document.getElementById('vgChatWrapper');
    const win = document.getElementById('vgChatWin');
    const closeBtn = document.getElementById('vgChatClose');
    const input = document.getElementById('vgChatIn');
    const send = document.getElementById('vgChatSend');

    let isOpen = false;

    // ── Toggle & Drag Physics ──
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;

    function onDragStart(e) {
      if (e.type === 'touchstart' && e.touches.length > 1) return;
      isDragging = true;
      hasMoved = false;
      const touch = e.type === 'touchstart' ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      const rect = wrapper.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      
      // Remove transitions during drag for instant follow
      wrapper.style.transition = 'none';
      btn.style.animation = 'none';
    }

    function onDragMove(e) {
      if (!isDragging) return;
      const touch = e.type === 'touchmove' ? e.touches[0] : e;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
      if (!hasMoved) return;

      e.preventDefault(); // Prevent scrolling while dragging on mobile

      requestAnimationFrame(() => {
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Constrain to viewport
        newLeft = Math.max(0, Math.min(window.innerWidth - wrapper.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - wrapper.offsetHeight, newTop));

        wrapper.style.left = newLeft + 'px';
        wrapper.style.top = newTop + 'px';
        wrapper.style.right = 'auto';
        wrapper.style.bottom = 'auto';
      });
    }

    function onDragEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      
      // Restore animations
      wrapper.style.transition = 'transform 0.3s ease';
      btn.style.animation = 'chatbotGlow 3s ease-in-out infinite';

      if (!hasMoved) {
        // It was a click
        isOpen = !isOpen;
        win.classList.toggle('open', isOpen);
        // Hide label when chat is open, show when closed
        const label = document.getElementById('vgChatLabel');
        if (label) label.style.display = isOpen ? 'none' : '';
        if (isOpen) setTimeout(() => input.focus(), 350);
      }
    }

    wrapper.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    
    wrapper.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    closeBtn.addEventListener('click', () => { isOpen = false; win.classList.remove('open'); });

    // ── Send ──
  async function handleSend() {
    const txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    addMsg(txt, 'user');
    showTyping();
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt, context: KB })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      removeTyping();
      
      if (data.reply) {
        typeMsg(data.reply);
      } else {
        // Fallback to offline intent matcher
        const intent = detect(txt);
        typeMsg(respond(intent));
      }
    } catch (error) {
      console.warn("Chatbot API unavailable or network error. Using offline fallback.", error);
      removeTyping();
      // Fallback to offline intent matcher
      const intent = detect(txt);
      typeMsg(respond(intent));
    }
  }
    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    // ── Welcome ──
    setTimeout(() => {
      addMsg(`Hey there! 👋 I'm **VG Assistant**, Vijay's AI companion.\n\nAsk me about his skills, projects, experience, or anything else!`, 'bot');
      setTimeout(showChips, 400);
    }, 300);
  }

  // ── Message helpers ──
  function addMsg(text, type) {
    const el = document.getElementById('vgChatMsgs');
    const chips = el.querySelector('.vg-chat-chips');
    if (chips && type === 'user') chips.remove();
    const div = document.createElement('div');
    div.className = `vg-chat-msg ${type}`;
    const avatar = type === 'bot'
      ? `<img src="${AVATAR}" alt="" class="vg-chat-msg-avatar" width="28" height="28">`
      : `<div class="vg-chat-msg-avatar">Y</div>`;
    const content = type === 'bot' ? md(text) : esc(text);
    div.innerHTML = `${avatar}<div class="vg-chat-bubble">${content}</div>`;
    el.appendChild(div);
    scroll();
  }

  function typeMsg(text) {
    const el = document.getElementById('vgChatMsgs');
    const div = document.createElement('div');
    div.className = 'vg-chat-msg bot';
    const bubble = document.createElement('div');
    bubble.className = 'vg-chat-bubble';
    div.innerHTML = `<img src="${AVATAR}" alt="" class="vg-chat-msg-avatar" width="28" height="28">`;
    div.appendChild(bubble);
    el.appendChild(div);

    const rendered = md(text);
    let i = 0;
    const timer = setInterval(() => {
      if (i < rendered.length) {
        // Handle HTML tags: write entire tag at once
        if (rendered[i] === '<') {
          const end = rendered.indexOf('>', i);
          bubble.innerHTML += rendered.substring(i, end + 1);
          i = end + 1;
        } else {
          bubble.innerHTML += rendered[i];
          i++;
        }
        scroll();
      } else {
        clearInterval(timer);
        setTimeout(showChips, 300);
      }
    }, 12);
  }

  function showTyping() {
    const el = document.getElementById('vgChatMsgs');
    const d = document.createElement('div');
    d.className = 'vg-chat-msg bot'; d.id = 'vgTyping';
    d.innerHTML = `<img src="${AVATAR}" alt="" class="vg-chat-msg-avatar" width="28" height="28"><div class="vg-chat-bubble"><div class="vg-typing-indicator"><span></span><span></span><span></span></div></div>`;
    el.appendChild(d); scroll();
  }

  function removeTyping() { const t = document.getElementById('vgTyping'); if (t) t.remove(); }

  function showChips() {
    const el = document.getElementById('vgChatMsgs');
    if (el.querySelector('.vg-chat-chips')) return;
    const c = document.createElement('div');
    c.className = 'vg-chat-chips';
    ['Skills','Projects','Why hire Vijay?','Experience','Achievements'].forEach(t => {
      const b = document.createElement('button');
      b.className = 'vg-chat-chip'; b.textContent = t;
      b.onclick = () => { c.remove(); document.getElementById('vgChatIn').value = t; document.getElementById('vgChatSend').click(); };
      c.appendChild(b);
    });
    el.appendChild(c); scroll();
  }

  function scroll() {
    const el = document.getElementById('vgChatMsgs');
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }

  function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  // ── Start ──
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
