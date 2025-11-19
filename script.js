/**
 * Navega entre as "páginas" principais (Home e Curso).
 * @param {string} pageId - O ID da <section> (página) para mostrar.
 * @param {boolean} [startCourse=false] - Se true, inicializa a barra de progresso.
 */
function navigateTo(pageId, startCourse = false) {
    // Esconde todas as páginas e o rodapé
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';


    // Mostra a página alvo
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        if (pageId === 'page-course') {
            targetPage.style.display = 'grid';
            if (footer) footer.style.display = 'block'; // Mostra o rodapé na pág. do curso
        } else if (pageId === 'page-home') {
            targetPage.style.display = 'flex';
        } else {
            targetPage.style.display = 'block';
        }
    }

    // Se o usuário clicou em "Iniciar Minicurso", inicializa o módulo 1 e a barra de progresso
    if (pageId === 'page-course' && startCourse) {
        showModule('module-1', document.querySelector('.nav-link[onclick*="module-1"]'));
    }
}

/**
 * Mostra um módulo de conteúdo específico dentro da página do curso.
 * @param {string} moduleId - O ID do <article> (módulo) para mostrar.
 * @param {HTMLElement} [clickedLink=null] - O elemento <a> que foi clicado (opcional).
 */
function showModule(moduleId, clickedLink = null) {
    // 1. Esconde todos os conteúdos de módulo
    document.querySelectorAll('.module-content .module').forEach(module => {
        module.classList.remove('active-content');
    });

    // 2. Mostra o conteúdo do módulo alvo
    const targetModule = document.getElementById(moduleId);
    if (targetModule) {
        targetModule.classList.add('active-content');
    }

    // 3. Gerencia o estado "ativo" nos links da navegação
    document.querySelectorAll('.module-nav .nav-link').forEach(link => {
        link.classList.remove('active-module');
    });
    
    // Encontra o link correspondente
    let correspondingLink = clickedLink;
    if (!correspondingLink) {
        correspondingLink = document.querySelector(`.nav-link[onclick*="'${moduleId}'"]`);
    }
    if (correspondingLink) {
        correspondingLink.classList.add('active-module');
    }

    // 4. Atualiza a Barra de Progresso
    const totalModules = 6;
    const currentModule = parseInt(moduleId.split('-')[1]);
    const progress = (currentModule / totalModules) * 100;
    
    const progressBar = document.getElementById('course-progress-bar');
    if(progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // 5. Rola a tela para o topo do conteúdo no mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.module-content').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Verifica a resposta de uma pergunta do quiz e dá feedback.
 * @param {string} questionName - O 'name' dos inputs de rádio (ex: 'q1').
 */
function checkQuiz(questionName) {
    const feedbackEl = document.getElementById(`feedback-${questionName}`);
    const radios = document.getElementsByName(questionName);
    let userAnswer = null;

    radios.forEach(radio => {
        if (radio.checked) {
            userAnswer = radio.value;
        }
    });

    if (!userAnswer) {
        feedbackEl.textContent = "Por favor, selecione uma resposta.";
        feedbackEl.className = "quiz-feedback feedback-incorreto";
        return;
    }

    if (userAnswer === "correto") {
        if (questionName === 'q1') {
            feedbackEl.textContent = "Correto! Os algoritmos aprendem com os dados que fornecemos, e dados do mundo real contêm vieses históricos.";
        } else if (questionName === 'q2') {
            feedbackEl.textContent = "Correto! É uma forma de censura velada que diminui o alcance de pautas específicas.";
        } else if (questionName === 'q3') {
            feedbackEl.textContent = "Correto! Interagir (mesmo criticando) é visto como 'engajamento' pelo algoritmo, o que aumenta o alcance do post. Denunciar e bloquear é o ideal.";
        }
        feedbackEl.className = "quiz-feedback feedback-correto";
    } else {
        if (questionName === 'q1') {
            feedbackEl.textContent = "Incorreto. A principal causa é o viés nos dados de treinamento, não uma falha aleatória ou hackers.";
        } else if (questionName === 'q2') {
            feedbackEl.textContent = "Incorreto. O banimento permanente é uma ação explícita; o shadowbanning é secreto.";
        } else if (questionName === 'q3') {
            feedbackEl.textContent = "Incorreto. Comentar ou compartilhar, mesmo para criticar, sinaliza ao algoritmo que o post é 'relevante' e o espalha para mais pessoas.";
        }
        feedbackEl.className = "quiz-feedback feedback-incorreto";
    }
}


/**
 * Gera um certificado em PDF usando jsPDF.
 */
function generateCertificate() {
    const name = document.getElementById('certificate-name').value;
    if (name.trim() === "") {
        alert("Por favor, digite seu nome.");
        return;
    }

    // Pega a biblioteca jsPDF que foi carregada no <head>
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Design Básico do Certificado
    doc.setFillColor(245, 245, 245); // Fundo claro (PDFs preferem)
    doc.rect(0, 0, 297, 210, 'F'); // Retângulo de fundo
    
    doc.setDrawColor(255, 215, 0); // Cor da borda (dourado)
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190); // Borda

    doc.setTextColor(18, 18, 18); // Preto
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 60, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text("Certificamos que", 148.5, 90, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(200, 160, 0); // Dourado escuro
    doc.text(name, 148.5, 110, { align: 'center' });
    
    doc.setTextColor(18, 18, 18); // Preto
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text("concluiu com sucesso o minicurso online", 148.5, 130, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Racismo Digital: Desconstruindo o Algoritmo", 148.5, 145, { align: 'center' });
    
    // Data
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Emitido em: ${dateStr}`, 148.5, 170, { align: 'center' });

    // Assinatura (placeholder)
    doc.setDrawColor(18, 18, 18);
    doc.line(110, 180, 190, 180); // Linha da assinatura
    doc.setFontSize(10);
    doc.text("Unegro - Parceria Educacional", 148.5, 185, { align: 'center' });
    
    doc.save(`Certificado-Racismo-Digital-${name}.pdf`);
}


/* --- NOVO: INICIALIZAÇÃO DO MENU MOBILE --- */
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('module-nav');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const collapsibleContent = document.getElementById('nav-content-collapsible');
    const navLinks = document.querySelectorAll('.module-nav .nav-link');

    if (toggleBtn && nav && collapsibleContent) {
        toggleBtn.addEventListener('click', () => {
            // Adiciona/Remove a classe .nav-open do <nav>
            const isOpen = nav.classList.toggle('nav-open');
            
            // Atualiza o ícone do botão e acessibilidade
            if (isOpen) {
                toggleBtn.innerHTML = '&#x2715;'; // Ícone 'X'
                toggleBtn.setAttribute('aria-expanded', 'true');
                toggleBtn.setAttribute('aria-label', 'Fechar Menu');
            } else {
                toggleBtn.innerHTML = '&#9776;'; // Ícone Hamburger
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    }

    // Fecha o menu ao clicar em um link (Boa UX)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Só fecha se o menu estiver aberto (em modo mobile)
            if (window.innerWidth <= 768 && nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                toggleBtn.innerHTML = '&#9776;'; // Reseta ícone
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    });
});