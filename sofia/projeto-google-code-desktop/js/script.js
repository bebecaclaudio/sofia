document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.app-main-content .section');
    const archetypeList = document.getElementById('archetype-list');
    const archetypeSearchInput = document.getElementById('archetype-search-input');
    const codeEditor = document.getElementById('code-editor');
    const fileListItems = document.querySelectorAll('.app-sidebar .file-list .file-item');
    const geminiPanel = document.querySelector('.gemini-panel');
    const panelHeader = geminiPanel ? geminiPanel.querySelector('.panel-header') : null;
    const minimizeButton = geminiPanel ? geminiPanel.querySelector('.control-button.minimize') : null;
    const maximizeButton = geminiPanel ? geminiPanel.querySelector('.control-button.maximize') : null;
    const closeButton = geminiPanel ? geminiPanel.querySelector('.control-button.close') : null;
    const panelBody = geminiPanel ? geminiPanel.querySelector('.panel-body') : null;
    const geminiInputArea = geminiPanel ? geminiPanel.querySelector('.gemini-input-area') : null;
    const geminiResponse = geminiPanel ? geminiPanel.querySelector('.gemini-response') : null;
    const chatContainer = geminiPanel ? geminiPanel.querySelector('.chat-container') : null;
    const chatHeader = chatContainer ? chatContainer.querySelector('.chat-header') : null;
    const chatMessages = chatContainer ? chatContainer.querySelector('.chat-messages') : null;
    const chatInput = chatContainer ? chatContainer.querySelector('.chat-input-area input') : null;
    const sendMessageButton = chatContainer ? chatContainer.querySelector('.chat-input-area button') : null;
    const collaboratorList = document.querySelector('.collaborator-list-ul');
    const collaboratorNameDisplay = chatContainer ? chatContainer.querySelector('.collaborator-name') : null;


    let activeChatUser = null;
    const users = {
        user1: { name: 'Usuário 1', online: true },
        user2: { name: 'Usuário 2', online: true },
    };

    // Navegação na sidebar
    navItems.forEach(navItem => {
        navItem.addEventListener('click', function() {
            navItems.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            this.classList.add('active');
            const targetId = this.dataset.section;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Inserir código do arquétipo no editor
    if (archetypeList && codeEditor) {
        archetypeList.addEventListener('click', function(event) {
            const archetypeItem = event.target.closest('.archetype-item');
            if (archetypeItem) {
                const codeSnippet = archetypeItem.dataset.code;
                codeEditor.value += (codeEditor.value ? '\n' : '') + codeSnippet + '; // Arquétipo inserido\n';
            }
        });
    }

    // Filtrar arquétipos
    if (archetypeSearchInput && archetypeList) {
        archetypeSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const archetypeItems = archetypeList.querySelectorAll('.archetype-item');

            archetypeItems.forEach(item => {
                const itemName = item.querySelector('span:last-child').textContent.toLowerCase();
                item.style.display = itemName.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }

    // Selecionar arquivo na sidebar
    fileListItems.forEach(item => {
        item.addEventListener('click', function() {
            fileListItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            const fileName = this.querySelector('span:last-child').textContent;
            const editorFileName = document.querySelector('#editor .file-info .file-name');
            if (editorFileName) {
                editorFileName.textContent = fileName;
            }

            navItems.forEach(nav => {
                if (nav.dataset.section === 'editor') {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById('editor').classList.add('active');
        });
    });

    // Lógica para arrastar o painel Gemini
    if (panelHeader && geminiPanel) {
        let isDragging = false;
        let offsetX, offsetY;

        panelHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - geminiPanel.getBoundingClientRect().left;
            offsetY = e.clientY - geminiPanel.getBoundingClientRect().top;
            geminiPanel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            geminiPanel.style.left = e.clientX - offsetX + 'px';
            geminiPanel.style.top = e.clientY - offsetY + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            geminiPanel.style.cursor = 'grab';
        });
    }

    // Lógica para minimizar o painel Gemini
    if (minimizeButton && panelBody) {
        minimizeButton.addEventListener('click', () => {
            panelBody.style.display = panelBody.style.display === 'none' ? 'block' : 'none';
            const icon = minimizeButton.querySelector('.material-icons');
            icon.textContent = panelBody.style.display === 'none' ? 'add' : 'remove';
        });
    }

    // Lógica para fechar o painel Gemini (simplesmente remover do DOM por enquanto)
    if (closeButton && geminiPanel) {
        closeButton.addEventListener('click', () => {
            geminiPanel.remove();
        });
    }

    // Lógica para maximizar/ampliar o painel Gemini
    if (maximizeButton && geminiPanel) {
        maximizeButton.addEventListener('click', () => {
            const isMaximized = geminiPanel.classList.contains('maximized');
            if (isMaximized) {
                geminiPanel.classList.remove('maximized');
                geminiPanel.style.width = '300px';
                geminiPanel.style.height = 'auto';
                geminiPanel.style.top = '80px';
                geminiPanel.style.right = '20px';
                maximizeButton.querySelector('.material-icons').textContent = 'fullscreen';
            } else {
                geminiPanel.classList.add('maximized');
                geminiPanel.style.top = '0';
                geminiPanel.style.left = '0';
                geminiPanel.style.right = '0';
                geminiPanel.style.bottom = '0';
                geminiPanel.style.width = 'auto';
                geminiPanel.style.height = 'auto';
                maximizeButton.querySelector('.material-icons').textContent = 'fullscreen_exit';
            }
        });
    }

    // Lógica para iniciar chat com colaborador
    if (collaboratorList && chatContainer) {
        collaboratorList.addEventListener('click', (event) => {
            const collaboratorItem = event.target.closest('.collaborator-item');
            if (collaboratorItem) {
                const userId = collaboratorItem.dataset.userId;
                activeChatUser = userId;
                if (chatHeader && collaboratorNameDisplay) {
                    collaboratorNameDisplay.textContent = users[userId].name;
                }
                geminiInputArea.style.display = 'none';
                geminiResponse.style.display = 'none';
                chatContainer.style.display = 'flex';
            }
        });
    }

    // Lógica para enviar mensagem no chat
    if (sendMessageButton && chatInput && chatMessages) {
        sendMessageButton.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message !== '' && activeChatUser) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message', 'sent');
                messageDiv.textContent = message;
                chatMessages.appendChild(messageDiv);
                chatInput.value = '';

                // Simular recebimento de mensagem do outro usuário (para teste)
                setTimeout(() => {
                    const replyDiv = document.createElement('div');
                    replyDiv.classList.add('chat-message', 'received');
                    replyDiv.textContent = `Mensagem de ${users[activeChatUser].name}: Recebi sua mensagem!`;
                    chatMessages.appendChild(replyDiv);
                }, 1000);
            }
        });
    }
});