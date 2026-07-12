// Mouse Parallax Logic
const hero = document.querySelector(".hero");

if (hero) {
    hero.addEventListener("mousemove", (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        document.querySelectorAll(".floating").forEach((item, index) => {
            const speed = (index + 1) * 15;
            item.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}