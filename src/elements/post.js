const submitButton = document.getElementById("submitPost");
const textPost = document.getElementById("textPost");
const imageUpload = document.getElementById("imageUpload");
const postsContainer = document.getElementById("postsContainer");

// Habilitar ou desabilitar o botão de envio
textPost.addEventListener("input", () => {
    submitButton.disabled = textPost.value.trim().length === 0;
});

submitButton.addEventListener("click", () => {
    const text = textPost.value.trim();
    const file = imageUpload.files[0];

    const post = document.createElement("div");
    post.classList.add("post");

    // Adicionar imagem, se houver
    if (file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        post.appendChild(img);
    }

    // Adicionar texto
    const textElement = document.createElement("p");
    textElement.textContent = text;
    post.appendChild(textElement);

    postsContainer.prepend(post); // Adicionar post no início

    // Limpar campos
    textPost.value = '';
    imageUpload.value = '';
    submitButton.disabled = true;
});