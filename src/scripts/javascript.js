document.getElementById("loginForm").addEventListener("submit", function(event) {
    const senha = document.querySelector("input[name='senha']").value;
    const nome = document.querySelector("input[name='nome']").value;

    if (senha !== "princesa2025") {
        event.preventDefault();
        alert(`Oops, ${nome || "usuário"}! 💡 A senha está incorreta. Tente novamente! 💖`);
    } else {
        alert(`Bem-vinda, ${nome || "princesa"}! 👑`);
        // Aqui você pode redirecionar para outra página se quiser:
        // window.location.href = "painel.html";
    }
});
